import os
import json
from flask import Blueprint, request, jsonify
from flask_jwt_extended import jwt_required, get_jwt_identity
import google.generativeai as genai

from marshmallow import Schema, fields, ValidationError

try:
    from models import Brand, User
except ImportError:
    from ..models import Brand, User

# Configure the Gemini API key
try:
    genai.configure(api_key=os.environ.get("GEMINI_API_KEY"))
    model = genai.GenerativeModel("gemini-1.5-flash")
except Exception as e:
    print(f"Error configuring Gemini API: {e}")
    model = None

generate_bp = Blueprint("generate_bp", __name__, url_prefix="/generate")

# Validation Schemas
class SocialPostSchema(Schema):
    brandId = fields.String(required=True)
    platform = fields.String(required=True)
    product = fields.String(required=True)
    audience = fields.String(required=True)
    tone = fields.String(required=True)

class GenerateTextSchema(Schema):
    brandId = fields.String(required=True)
    prompt = fields.String(required=True)

class BlogIdeasSchema(Schema):
    brandId = fields.String(required=True)
    topic = fields.String(required=True)

class AdCopySchema(Schema):
    brandId = fields.String(required=True)
    product = fields.String(required=True)
    sellingPoints = fields.String(required=True)
    tone = fields.String(required=True)

class SEOKeywordsSchema(Schema):
    brandId = fields.String(required=True)
    topic = fields.String(required=True)

class EmailCampaignSchema(Schema):
    brandId = fields.String(required=True)
    goal = fields.String(required=True)
    productInfo = fields.String(required=True)
    tone = fields.String(required=True)

class TagsSchema(Schema):
    content = fields.String(required=True)
    type = fields.String(required=True)

# Helpers
def get_brand_for_user(user_id: str, brand_id: str):
    user = User.query.get(user_id)
    if not user:
        return None, "Unauthorized"
    brand = Brand.query.filter_by(id=brand_id, company_id=user.company_id).first()
    if not brand:
        return None, "Brand not found or access denied"
    return brand, None

# Endpoints
@generate_bp.route("/social-post", methods=["POST"])
@jwt_required()
def generate_social_post():
    try:
        data = request.get_json() or {}
        SocialPostSchema().load(data)
    except ValidationError as ve:
        return jsonify({"error": "Validation failed", "details": ve.messages}), 400

    current_user_id = get_jwt_identity()
    brand, err = get_brand_for_user(current_user_id, data["brandId"])
    if err:
        return jsonify({"error": err}), 404 if "not found" in err.lower() else 401
    assert brand is not None
    if brand is None:
        return jsonify({"error": "Brand not found or access denied"}), 404

    # Deterministic fallback when model isn't configured
    if not model:
        text = f"{data['platform']}: Introducing {data['product']} for {data['audience']} — on-brand, {data['tone']} tone. #{brand.name.replace(' ', '')}"
        return jsonify(text)

    prompt = f"""
You are an expert social media manager. Generate a social media post for the following brand.

Brand Name: {brand.name}
Brand Description: {brand.description}
Platform: {data['platform']}
Product/Service to Promote: {data['product']}
Target Audience: {data['audience']}
Tone of Voice: {data['tone']}

Generate the post content only, without any extra commentary.
"""

    try:
        response = model.generate_content(prompt)
        return jsonify(response.text)
    except Exception as e:
        return jsonify({"error": f"AI generation failed: {str(e)}"}), 500

@generate_bp.route("/text", methods=["POST"])
@jwt_required()
def generate_text():
    try:
        data = request.get_json() or {}
        GenerateTextSchema().load(data)
    except ValidationError as ve:
        return jsonify({"error": "Validation failed", "details": ve.messages}), 400

    current_user_id = get_jwt_identity()
    brand, err = get_brand_for_user(current_user_id, data["brandId"])
    if err:
        return jsonify({"error": err}), 404 if "not found" in err.lower() else 401
    assert brand is not None
    if brand is None:
        return jsonify({"error": "Brand not found or access denied"}), 404

    if not model:
        return jsonify({"generated_text": f"[Demo Fallback] {data['prompt']} — aligned to {brand.name} tone."})

    final_prompt = f"""
You are an AI assistant for a marketing team. Your task is to generate text based on the user's prompt, while adhering to the specified brand's identity.

Brand Information:
- Brand Name: {brand.name}
- Description: {brand.description}
- Primary Color: {brand.primary_color}
- Secondary Color: {brand.secondary_color}

User's Prompt:
"{data['prompt']}"

Please generate a response that is creative, on-brand, and directly addresses the user's prompt.
"""

    try:
        response = model.generate_content(final_prompt)
        return jsonify({"generated_text": response.text})
    except Exception as e:
        print(f"Error during AI text generation: {e}")
        return jsonify({"error": f"AI generation failed: {str(e)}"}), 500

@generate_bp.route("/blog-ideas", methods=["POST"])
@jwt_required()
def generate_blog_ideas():
    try:
        data = request.get_json() or {}
        BlogIdeasSchema().load(data)
    except ValidationError as ve:
        return jsonify({"error": "Validation failed", "details": ve.messages}), 400

    current_user_id = get_jwt_identity()
    brand, err = get_brand_for_user(current_user_id, data["brandId"])
    if err:
        return jsonify({"error": err}), 404 if "not found" in err.lower() else 401
    assert brand is not None
    if brand is None:
        return jsonify({"error": "Brand not found or access denied"}), 404

    if not model:
        return jsonify([{"title": f"{data['topic']} strategies for {brand.name}", "outline": "Intro, Tips, CTA"}])

    try:
        # ASTRA AI Quality Improvement:
        # 1. Added explicit JSON output instructions (no markdown, exact schema)
        # 2. Added safe JSON parsing with try/except
        # 3. Added graceful fallback instead of silently returning corrupted raw text
        prompt = (
            f"Generate 5 blog ideas for brand {brand.name} about: {data['topic']}. "
            "Respond ONLY with a valid JSON array of objects. "
            "Each object must have exactly two keys: 'title' (string) and 'outline' (string). "
            "Do not include markdown formatting or preamble."
        )
        resp = model.generate_content(prompt)

        raw_text = resp.text.strip()
        if raw_text.startswith("```json"):
            raw_text = raw_text[7:]
        if raw_text.endswith("```"):
            raw_text = raw_text[:-3]
        raw_text = raw_text.strip()

        parsed_data = json.loads(raw_text)

        # Basic validation: ensure it's a list and has title/outline
        if not isinstance(parsed_data, list):
            raise ValueError("Expected a JSON array")

        valid_ideas = []
        for item in parsed_data:
            if isinstance(item, dict) and 'title' in item and 'outline' in item:
                valid_ideas.append({
                    "title": str(item['title']),
                    "outline": str(item['outline'])
                })

        if not valid_ideas:
            raise ValueError("No valid blog ideas found in response")

        return jsonify(valid_ideas)

    except (json.JSONDecodeError, ValueError) as e:
        # Fallback if model hallucinates non-JSON or invalid schema
        print(f"AI Parse Error: {e}")
        return jsonify([{"title": f"{data['topic']} ideas for {brand.name}", "outline": "Intro, Key points, Conclusion (Fallback response due to unexpected AI format)"}])
        prompt = f"Generate 5 blog ideas for brand {brand.name} about: {data['topic']}. Respond ONLY as a JSON array of objects, each with 'title' and 'outline' string fields."
        resp = model.generate_content(
            prompt,
            generation_config=genai.types.GenerationConfig(response_mime_type="application/json")
        )

        # Astra: Output validation before use - handle raw JSON parsing and validate structure with fallback
        import json
        try:
            parsed = json.loads(resp.text)
            if not isinstance(parsed, list):
                raise ValueError("AI output is not a JSON array")
            return jsonify(parsed)
        except (json.JSONDecodeError, ValueError) as parse_err:
            print(f"AI JSON Parse Error: {parse_err}")
            return jsonify([{"title": f"{data['topic']} ideas for {brand.name}", "outline": "Could not generate ideas. Please try again."}])

    except Exception as e:
        return jsonify({"error": f"AI generation failed: {str(e)}"}), 500

@generate_bp.route("/ad-copy", methods=["POST"])
@jwt_required()
def generate_ad_copy():
    try:
        data = request.get_json() or {}
        AdCopySchema().load(data)
    except ValidationError as ve:
        return jsonify({"error": "Validation failed", "details": ve.messages}), 400

    current_user_id = get_jwt_identity()
    brand, err = get_brand_for_user(current_user_id, data["brandId"])
    if err:
        return jsonify({"error": err}), 404 if "not found" in err.lower() else 401
    assert brand is not None
    if brand is None:
        return jsonify({"error": "Brand not found or access denied"}), 404

    if not model:
        return jsonify(f"{brand.name}: {data['product']} — {data['sellingPoints']} (Tone: {data['tone']})")

    try:
        resp = model.generate_content(f"Write ad copy for {brand.name}. Product: {data['product']}. Selling points: {data['sellingPoints']}. Tone: {data['tone']}.")
        return jsonify(resp.text)
    except Exception as e:
        return jsonify({"error": f"AI generation failed: {str(e)}"}), 500

@generate_bp.route("/seo-keywords", methods=["POST"])
@jwt_required()
def generate_seo_keywords():
    try:
        data = request.get_json() or {}
        SEOKeywordsSchema().load(data)
    except ValidationError as ve:
        return jsonify({"error": "Validation failed", "details": ve.messages}), 400

    current_user_id = get_jwt_identity()
    brand, err = get_brand_for_user(current_user_id, data["brandId"])
    if err:
        return jsonify({"error": err}), 404 if "not found" in err.lower() else 401
    assert brand is not None
    if brand is None:
        return jsonify({"error": "Brand not found or access denied"}), 404

    if not model:
        return jsonify([{"keyword": data["topic"], "volume": 100, "difficulty": 20}])

    try:
        prompt = f"Generate 10 SEO keywords for {brand.name} about {data['topic']}. Respond ONLY as a JSON array of objects, each with 'keyword' (string), 'volume' (number), 'difficulty' (number), and 'note' (string)."
        resp = model.generate_content(
            prompt,
            generation_config=genai.types.GenerationConfig(response_mime_type="application/json")
        )

        import json
        try:
            parsed = json.loads(resp.text)
            if not isinstance(parsed, list):
                raise ValueError("AI output is not a JSON array")
            return jsonify(parsed)
        except (json.JSONDecodeError, ValueError) as parse_err:
            print(f"AI JSON Parse Error: {parse_err}")
            return jsonify([{"keyword": data["topic"], "volume": 100, "difficulty": 20, "note": "Failed to parse AI output."}])
    except Exception as e:
        return jsonify({"error": f"AI generation failed: {str(e)}"}), 500

@generate_bp.route("/email-campaign", methods=["POST"])
@jwt_required()
def generate_email_campaign():
    try:
        data = request.get_json() or {}
        EmailCampaignSchema().load(data)
    except ValidationError as ve:
        return jsonify({"error": "Validation failed", "details": ve.messages}), 400

    current_user_id = get_jwt_identity()
    brand, err = get_brand_for_user(current_user_id, data["brandId"])
    if err:
        return jsonify({"error": err}), 404 if "not found" in err.lower() else 401

    if not model:
        return jsonify({"subject": f"{brand.name}: {data['goal']}", "body": f"Introducing {data['productInfo']} — {data['tone']} tone."})

    try:
        resp = model.generate_content(f"Create an email campaign for {brand.name}. Goal: {data['goal']}. Product info: {data['productInfo']}. Tone: {data['tone']}. Return subject and body.")
        return jsonify({"subject": "Subject", "body": resp.text})
    except Exception as e:
        return jsonify({"error": f"AI generation failed: {str(e)}"}), 500

@generate_bp.route("/tags", methods=["POST"])
@jwt_required()
def generate_tags():
    try:
        data = request.get_json() or {}
        TagsSchema().load(data)
    except ValidationError as ve:
        return jsonify({"error": "Validation failed", "details": ve.messages}), 400

    # No brand context needed here; simple fallback is fine
    if not model:
        return jsonify(["demo", "brandspark", "ai"])

    try:
        resp = model.generate_content(f"Suggest 5 tags for content type {data['type']}. Content:\n{data['content']}\nReturn a JSON array of strings.")
        return jsonify(["tag1", "tag2", "tag3"])
    except Exception as e:
        return jsonify({"error": f"AI generation failed: {str(e)}"}), 500
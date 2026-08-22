## 2025-02-24 - Handle AI JSON Array Generation Parsing Gracefully
**Learning:** Returning a single truncated string instead of parsing an explicitly requested JSON array can silently lead to malformed data for the UI if the AI hallucinates formatting (like markdown wrapping), resulting in silent failures. When requesting JSON from an LLM, the raw string needs to be cleaned (stripping out markdown artifacts like ```json) and strictly parsed.
**Action:** When creating a prompt that requires structured JSON output, explicitly instruct the model NOT to include markdown or preamble. Use try/except blocks to wrap `json.loads`, validate the resulting schema (e.g., verifying it's a list with required keys), and provide a graceful fallback that matches the expected data shape in the UI if parsing or validation fails.
## 2023-10-10 - Silent Failures in JSON Output Handling
**Learning:** Returning truncated raw model text instead of parsing JSON requests masks AI output parsing failures. By just slicing the response text when a JSON array is requested, we completely fail to leverage structured data and break downstream frontend dependencies silently.
**Action:** Always use `response_mime_type="application/json"` with Gemini, validate the structure of `json.loads` output, and provide a graceful structured fallback instead of returning a mock structure containing raw string text.

## 2023-10-27 - Preserving Schema Compatibility in AI Fallbacks
**Learning:** When enforcing JSON schema outputs for AI generation, it's crucial to explicitly ask the model to generate all expected fields (like `note`) to ensure the response matches the shape required by the frontend client. Fallback mechanisms should also return a mock structure containing these identical fields.
**Action:** Always verify the full expected structure from the client before modifying the AI prompt or fallbacks to avoid schema-related regressions.
## 2023-10-10 - Bypassing AI Output Entirely
**Learning:** Returning a hardcoded response structure while ignoring the actual AI model's output constitutes a major silent failure and defeats the purpose of the integration.
**Action:** Always parse the actual AI response text (`resp.text`), validate it, and return the parsed data instead of returning mock data with a slice of raw text injected.

## 2025-02-25 - Multi-part text generation silent failures
**Learning:** Requesting multi-part text (like an email subject and body) in a single plain text response often leads to parsing issues, causing developers to silently hardcode fields (e.g., hardcoding the "subject" while only returning the "body" from the model).
**Action:** For any text generation task that requires multiple distinct fields, explicitly require a JSON object output using `response_mime_type="application/json"`. Parse and validate the response, ensuring all required fields are present, and fall back gracefully if missing.

## 2024-05-24 - [Graceful Fallbacks and Prompt Formatting for Raw Text Generation]
**Learning:** For endpoints generating plain string output (like ad copy or social posts), failing to explicitly instruct the model to exclude markdown formatting or preamble often results in corrupt string generation. When the AI fails, catching the exception and returning a generated fallback (like a generic on-brand template) is critical to prevent surfacing generic 500 errors to users and breaking the frontend formatting.
**Action:** Always add "Do not include markdown, preamble, or commentary" to simple text generation prompts. Always wrap AI call in a try/catch, logging the exact AI failure but catching the exception and returning a simple baseline template fallback that fulfills the endpoint's contract format (e.g. a plain text string representation) instead of raw 500 errors.

## 2026-08-20 - Prevent Silent 500 Errors in Plain Text Generation
**Learning:** For endpoints generating plain string output (like social posts or generic text), failing to explicitly instruct the model to exclude markdown formatting or preamble often results in corrupt string generation. If an exception happens, simply throwing a raw 500 error causes silent application/UI failures and bad UX.
**Action:** Always add "Do not include markdown, preamble, or commentary." to simple text generation prompts. Always wrap the AI call in a try/catch, log the exception, and return a clean, on-brand generic string fallback that strictly fulfills the endpoint's string contract format instead of letting raw 500 errors reach the user.

## 2025-02-25 - Output Validation for Nested AI Structures
**Learning:** Checking that `json.loads` returns an array using `isinstance(parsed, list)` is insufficient if the array contains incorrectly formatted items (e.g., missing keys or hallucinated structures). If you pass `parsed` directly to `jsonify` in this state, the frontend client will often silently crash or display broken UI when attempting to access expected keys like `keyword`, `volume`, or `difficulty`. Additionally, catching generic `Exception` blocks in AI endpoints and surfacing 500 errors causes sudden application breakages when the model service goes down or experiences a transient error.
**Action:** Always validate the structure of items *inside* generated JSON arrays and filter out invalid items before returning them. When catching generic exceptions outside of the JSON parsing block, always return a graceful fallback that matches the schema expected by the frontend rather than an HTTP 500 error.

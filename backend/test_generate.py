import json
import pytest
from app import app
from flask_jwt_extended import create_access_token

@pytest.fixture
def client():
    app.config['TESTING'] = True
    app.config['JWT_SECRET_KEY'] = 'test-secret'
    with app.test_client() as client:
        yield client

def test_generate_email_campaign_error(client, monkeypatch):
    # Mock get_brand_for_user
    monkeypatch.setattr('blueprints.generate.get_brand_for_user', lambda u, b: (type('Brand', (), {'name': 'Test Brand'}), None))

    # Mock model generation to raise exception
    class MockModel:
        def generate_content(self, *args, **kwargs):
            raise Exception("Mocked AI Error")

    monkeypatch.setattr('blueprints.generate.model', MockModel())

    with app.app_context():
        access_token = create_access_token(identity="test_user")

    response = client.post('/generate/email-campaign',
        headers={"Authorization": f"Bearer {access_token}"},
        json={
            "brandId": "123",
            "goal": "Sale",
            "productInfo": "Shoes",
            "tone": "Happy"
        }
    )

    data = response.get_json()
    assert response.status_code == 200
    assert data['subject'] == "Test Brand Update"
    assert data['body'] == "Could not generate email content correctly. Please try again."


def test_generate_tags_error(client, monkeypatch):
    # Mock model generation to raise exception
    class MockModel:
        def generate_content(self, *args, **kwargs):
            raise Exception("Mocked AI Error")

    monkeypatch.setattr('blueprints.generate.model', MockModel())

    with app.app_context():
        access_token = create_access_token(identity="test_user")

    response = client.post('/generate/tags',
        headers={"Authorization": f"Bearer {access_token}"},
        json={
            "content": "Test content",
            "type": "Blog"
        }
    )

    data = response.get_json()
    assert response.status_code == 200
    assert data == ["content", "marketing", "tags"]

#!/usr/bin/env python3
"""
Integration test script for Brand Spark SaaS platform
Tests the complete flow from landing page to backend API
"""

import requests
import json
import time

# Configuration
FRONTEND_URL = "http://localhost:3000"
BACKEND_URL = "http://localhost:8000/api"
LANDING_URL = "http://localhost:8080"

def test_backend_health():
    """Test if backend API is responding"""
    print("🔍 Testing Backend Health...")
    try:
        response = requests.get(f"{BACKEND_URL}/health")
        if response.status_code == 200:
            print("✅ Backend API is healthy")
            print(f"   Response: {response.json()}")
            return True
        else:
            print(f"❌ Backend health check failed: {response.status_code}")
            return False
    except Exception as e:
        print(f"❌ Backend connection failed: {e}")
        return False

def test_user_registration():
    """Test user registration flow"""
    print("\n🔍 Testing User Registration...")
    
    test_user = {
        "email": "test@brandspark.com",
        "password": "testpassword123",
        "first_name": "Test",
        "last_name": "User",
        "company_name": "Test Company"
    }
    
    try:
        response = requests.post(f"{BACKEND_URL}/auth/register", json=test_user)
        
        if response.status_code == 201:
            print("✅ User registration successful")
            data = response.json()
            print(f"   User ID: {data['user']['id']}")
            print(f"   Company: {data['company']['name']}")
            return data['access_token']
        else:
            print(f"❌ Registration failed: {response.status_code}")
            print(f"   Error: {response.json()}")
            return None
    except Exception as e:
        print(f"❌ Registration request failed: {e}")
        return None

def test_user_login():
    """Test user login flow"""
    print("\n🔍 Testing User Login...")
    
    login_data = {
        "email": "test@brandspark.com",
        "password": "testpassword123"
    }
    
    try:
        response = requests.post(f"{BACKEND_URL}/auth/login", json=login_data)
        
        if response.status_code == 200:
            print("✅ User login successful")
            data = response.json()
            print(f"   Welcome: {data['user']['first_name']} {data['user']['last_name']}")
            return data['access_token']
        else:
            print(f"❌ Login failed: {response.status_code}")
            print(f"   Error: {response.json()}")
            return None
    except Exception as e:
        print(f"❌ Login request failed: {e}")
        return None

def test_brand_creation(access_token):
    """Test brand creation with authentication"""
    print("\n🔍 Testing Brand Creation...")
    
    if not access_token:
        print("❌ No access token available")
        return False
    
    brand_data = {
        "name": "Test Brand",
        "description": "A test brand for integration testing",
        "primary_color": "#FF6B6B",
        "secondary_color": "#4ECDC4"
    }
    
    headers = {
        "Authorization": f"Bearer {access_token}",
        "Content-Type": "application/json"
    }
    
    try:
        response = requests.post(f"{BACKEND_URL}/brands", json=brand_data, headers=headers)
        
        if response.status_code == 201:
            print("✅ Brand creation successful")
            data = response.json()
            print(f"   Brand: {data['name']}")
            print(f"   ID: {data['id']}")
            return True
        else:
            print(f"❌ Brand creation failed: {response.status_code}")
            print(f"   Error: {response.json()}")
            return False
    except Exception as e:
        print(f"❌ Brand creation request failed: {e}")
        return False

def test_frontend_accessibility():
    """Test if frontend is accessible"""
    print("\n🔍 Testing Frontend Accessibility...")
    try:
        response = requests.get(FRONTEND_URL)
        if response.status_code == 200:
            print("✅ Frontend is accessible")
            print(f"   Status: {response.status_code}")
            return True
        else:
            print(f"❌ Frontend not accessible: {response.status_code}")
            return False
    except Exception as e:
        print(f"❌ Frontend connection failed: {e}")
        return False

def test_landing_page():
    """Test if landing page is accessible"""
    print("\n🔍 Testing Landing Page...")
    try:
        response = requests.get(LANDING_URL)
        if response.status_code == 200:
            print("✅ Landing page is accessible")
            print(f"   Status: {response.status_code}")
            # Check if it contains expected content
            if "BrandSpark" in response.text:
                print("✅ Landing page contains expected content")
                return True
            else:
                print("⚠️  Landing page missing expected content")
                return False
        else:
            print(f"❌ Landing page not accessible: {response.status_code}")
            return False
    except Exception as e:
        print(f"❌ Landing page connection failed: {e}")
        return False

def main():
    """Run all integration tests"""
    print("🚀 Brand Spark Integration Test Suite")
    print("=" * 50)
    
    results = []
    
    # Test 1: Backend Health
    results.append(test_backend_health())
    
    # Test 2: Frontend Accessibility
    results.append(test_frontend_accessibility())
    
    # Test 3: Landing Page
    results.append(test_landing_page())
    
    # Test 4: User Registration
    access_token = test_user_registration()
    results.append(access_token is not None)
    
    # Test 5: User Login (alternative flow)
    if not access_token:
        access_token = test_user_login()
        results.append(access_token is not None)
    
    # Test 6: Brand Creation
    results.append(test_brand_creation(access_token))
    
    # Summary
    print("\n" + "=" * 50)
    print("📊 TEST SUMMARY")
    print("=" * 50)
    
    passed = sum(results)
    total = len(results)
    
    print(f"✅ Passed: {passed}/{total}")
    print(f"❌ Failed: {total - passed}/{total}")
    
    if passed == total:
        print("\n🎉 ALL TESTS PASSED! Brand Spark is ready to go!")
        print("\n🌐 Access your applications:")
        print(f"   • Main App: {FRONTEND_URL}")
        print(f"   • Landing Page: {LANDING_URL}")
        print(f"   • Backend API: {BACKEND_URL}")
    else:
        print(f"\n⚠️  {total - passed} tests failed. Please check the issues above.")
    
    return passed == total

if __name__ == "__main__":
    main()
import requests
import sys
import json
from datetime import datetime
import uuid

class BlogAPITester:
    def __init__(self, base_url="http://localhost:4000"):
        self.base_url = base_url
        self.token = None
        self.user_id = None
        self.blog_id = None
        self.category_id = None
        self.comment_id = None
        self.tests_run = 0
        self.tests_passed = 0
        self.failed_tests = []

    def log_test(self, name, success, response_data=None, error=None):
        """Log test results"""
        self.tests_run += 1
        if success:
            self.tests_passed += 1
            print(f"✅ {name}: PASSED")
        else:
            self.failed_tests.append({
                'name': name,
                'error': error,
                'response': response_data
            })
            print(f"❌ {name}: FAILED - {error}")

    def make_request(self, method, endpoint, data=None, auth_required=True):
        """Make HTTP request to API"""
        url = f"{self.base_url}/api/{endpoint}"
        headers = {'Content-Type': 'application/json'}
        
        if auth_required and self.token:
            headers['Authorization'] = f'Bearer {self.token}'
        
        try:
            if method == 'GET':
                response = requests.get(url, headers=headers, timeout=10)
            elif method == 'POST':
                response = requests.post(url, json=data, headers=headers, timeout=10)
            elif method == 'PUT':
                response = requests.put(url, json=data, headers=headers, timeout=10)
            elif method == 'DELETE':
                response = requests.delete(url, headers=headers, timeout=10)
            
            try:
                response_json = response.json()
            except:
                response_json = {'raw_response': response.text}
                
            return response.status_code, response_json
            
        except requests.exceptions.RequestException as e:
            return None, {'error': str(e)}

    def test_health_check(self):
        """Test health check endpoint"""
        status, data = self.make_request('GET', 'health', auth_required=False)
        success = status == 200 and data.get('success') == True
        self.log_test("Health Check", success, data, 
                     None if success else f"Status: {status}, Response: {data}")
        return success

    def test_user_registration(self):
        """Test user registration"""
        test_uuid = str(uuid.uuid4())[:8]
        user_data = {
            "email": f"testuser_{test_uuid}@example.com",
            "username": f"testuser_{test_uuid}",
            "password": "TestPassword123!",
            "firstName": "Test",
            "lastName": "User"
        }
        
        status, data = self.make_request('POST', 'users/register', user_data, auth_required=False)
        success = status == 201 and data.get('success') == True
        
        if success:
            self.user_id = data.get('data', {}).get('user', {}).get('id')
        
        self.log_test("User Registration", success, data,
                     None if success else f"Status: {status}, Response: {data}")
        return success, user_data

    def test_user_login(self, user_data):
        """Test user login"""
        login_data = {
            "email": user_data["email"],
            "password": user_data["password"]
        }
        
        status, data = self.make_request('POST', 'users/login', login_data, auth_required=False)
        success = status == 200 and data.get('success') == True
        
        if success:
            self.token = data.get('data', {}).get('token')
        
        self.log_test("User Login", success, data,
                     None if success else f"Status: {status}, Response: {data}")
        return success

    def test_user_profile_get(self):
        """Test get user profile"""
        status, data = self.make_request('GET', 'users/profile')
        success = status == 200 and data.get('success') == True
        self.log_test("Get User Profile", success, data,
                     None if success else f"Status: {status}, Response: {data}")
        return success

    def test_user_profile_update(self):
        """Test update user profile"""
        update_data = {
            "firstName": "Updated",
            "lastName": "User",
            "bio": "This is my updated bio"
        }
        
        status, data = self.make_request('PUT', 'users/profile', update_data)
        success = status == 200 and data.get('success') == True
        self.log_test("Update User Profile", success, data,
                     None if success else f"Status: {status}, Response: {data}")
        return success

    def test_create_category(self):
        """Test create category"""
        category_data = {
            "name": f"Test Category {datetime.now().strftime('%H%M%S')}",
            "description": "A test category for blogs"
        }
        
        status, data = self.make_request('POST', 'categories', category_data)
        success = status == 201 and data.get('success') == True
        
        if success:
            # Try different possible paths for category ID
            category = data.get('data', {}).get('category', {})
            self.category_id = category.get('id') or category.get('_id') or category.get('categoryId')
            print(f"🔍 Created category ID: {self.category_id}")
            print(f"🔍 Category response: {data}")
        
        self.log_test("Create Category", success, data,
                     None if success else f"Status: {status}, Response: {data}")
        return success

    def test_get_categories(self):
        """Test get all categories"""
        status, data = self.make_request('GET', 'categories', auth_required=False)
        success = status == 200 and data.get('success') == True
        self.log_test("Get All Categories", success, data,
                     None if success else f"Status: {status}, Response: {data}")
        return success

    def test_create_blog(self):
        """Test create blog post"""
        blog_data = {
            "title": f"Test Blog Post {datetime.now().strftime('%H%M%S')}",
            "content": "<h1>Test Content</h1><p>This is a test blog post with HTML content.</p>",
            "excerpt": "This is a test excerpt",
            "categoryId": self.category_id,
            "tags": ["test", "blog", "api"],
            "status": "draft",
            "isPublic": True
        }
        
        status, data = self.make_request('POST', 'blogs', blog_data)
        success = status == 201 and data.get('success') == True
        
        if success:
            self.blog_id = data.get('data', {}).get('blog', {}).get('id')
        
        self.log_test("Create Blog Post", success, data,
                     None if success else f"Status: {status}, Response: {data}")
        return success

    def test_get_all_blogs(self):
        """Test get all blogs"""
        status, data = self.make_request('GET', 'blogs', auth_required=False)
        success = status == 200 and data.get('success') == True
        self.log_test("Get All Blogs", success, data,
                     None if success else f"Status: {status}, Response: {data}")
        return success

    def test_get_blog_by_id(self):
        """Test get blog by ID"""
        if not self.blog_id:
            self.log_test("Get Blog By ID", False, None, "No blog ID available")
            return False
            
        status, data = self.make_request('GET', f'blogs/{self.blog_id}', auth_required=False)
        success = status == 200 and data.get('success') == True
        self.log_test("Get Blog By ID", success, data,
                     None if success else f"Status: {status}, Response: {data}")
        return success

    def test_update_blog(self):
        """Test update blog post"""
        if not self.blog_id:
            self.log_test("Update Blog", False, None, "No blog ID available")
            return False
            
        update_data = {
            "title": f"Updated Blog Post {datetime.now().strftime('%H%M%S')}",
            "content": "<h1>Updated Content</h1><p>This blog post has been updated.</p>"
        }
        
        status, data = self.make_request('PUT', f'blogs/{self.blog_id}', update_data)
        success = status == 200 and data.get('success') == True
        self.log_test("Update Blog", success, data,
                     None if success else f"Status: {status}, Response: {data}")
        return success

    def test_publish_blog(self):
        """Test publish blog post"""
        if not self.blog_id:
            self.log_test("Publish Blog", False, None, "No blog ID available")
            return False
            
        status, data = self.make_request('POST', f'blogs/{self.blog_id}/publish', {})
        success = status == 200 and data.get('success') == True
        self.log_test("Publish Blog", success, data,
                     None if success else f"Status: {status}, Response: {data}")
        return success

    def test_create_comment(self):
        """Test create comment on blog"""
        if not self.blog_id:
            self.log_test("Create Comment", False, None, "No blog ID available")
            return False
            
        comment_data = {
            "blogId": self.blog_id,
            "content": "This is a test comment on the blog post."
        }
        
        status, data = self.make_request('POST', 'comments', comment_data)
        success = status == 201 and data.get('success') == True
        
        if success:
            self.comment_id = data.get('data', {}).get('comment', {}).get('id')
        
        self.log_test("Create Comment", success, data,
                     None if success else f"Status: {status}, Response: {data}")
        return success

    def test_get_comments_by_blog(self):
        """Test get comments by blog ID"""
        if not self.blog_id:
            self.log_test("Get Comments By Blog", False, None, "No blog ID available")
            return False
            
        status, data = self.make_request('GET', f'comments/blog/{self.blog_id}', auth_required=False)
        success = status == 200 and data.get('success') == True
        self.log_test("Get Comments By Blog", success, data,
                     None if success else f"Status: {status}, Response: {data}")
        return success

    def test_toggle_like_blog(self):
        """Test toggle like on blog"""
        if not self.blog_id:
            self.log_test("Toggle Like Blog", False, None, "No blog ID available")
            return False
            
        like_data = {
            "targetId": self.blog_id,
            "targetType": "blog"
        }
        
        status, data = self.make_request('POST', 'likes/toggle', like_data)
        success = status == 200 and data.get('success') == True
        self.log_test("Toggle Like Blog", success, data,
                     None if success else f"Status: {status}, Response: {data}")
        return success

    def test_get_like_status(self):
        """Test get like status"""
        if not self.blog_id:
            self.log_test("Get Like Status", False, None, "No blog ID available")
            return False
            
        status, data = self.make_request('GET', f'likes/status/blog/{self.blog_id}')
        success = status == 200 and data.get('success') == True
        self.log_test("Get Like Status", success, data,
                     None if success else f"Status: {status}, Response: {data}")
        return success

    def run_all_tests(self):
        """Run all tests in sequence"""
        print("🚀 Starting Epic Blog API Test Suite")
        print(f"📍 Testing API at: {self.base_url}")
        print("=" * 50)

        # Basic tests
        if not self.test_health_check():
            print("❌ Health check failed - stopping tests")
            return self.generate_report()

        # User authentication flow
        reg_success, user_data = self.test_user_registration()
        if not reg_success:
            print("❌ User registration failed - stopping tests")
            return self.generate_report()

        if not self.test_user_login(user_data):
            print("❌ User login failed - stopping tests")
            return self.generate_report()

        self.test_user_profile_get()
        self.test_user_profile_update()

        # Category tests
        self.test_create_category()
        self.test_get_categories()

        # Blog tests
        self.test_create_blog()
        self.test_get_all_blogs()
        self.test_get_blog_by_id()
        self.test_update_blog()
        self.test_publish_blog()

        # Comment tests
        self.test_create_comment()
        self.test_get_comments_by_blog()

        # Like tests
        self.test_toggle_like_blog()
        self.test_get_like_status()

        return self.generate_report()

    def generate_report(self):
        """Generate test report"""
        print("\n" + "=" * 50)
        print("📊 TEST RESULTS SUMMARY")
        print(f"✅ Passed: {self.tests_passed}/{self.tests_run}")
        print(f"❌ Failed: {len(self.failed_tests)}/{self.tests_run}")
        print(f"📈 Success Rate: {(self.tests_passed/self.tests_run*100):.1f}%")
        
        if self.failed_tests:
            print("\n❌ FAILED TESTS:")
            for test in self.failed_tests:
                print(f"  • {test['name']}: {test['error']}")
        
        return {
            'total_tests': self.tests_run,
            'passed_tests': self.tests_passed,
            'failed_tests': self.failed_tests,
            'success_rate': self.tests_passed/self.tests_run if self.tests_run > 0 else 0
        }

def main():
    """Main function to run tests"""
    print("🔍 Epic Blog API Backend Test Suite")
    print(f"⏰ Started at: {datetime.now().strftime('%Y-%m-%d %H:%M:%S')}")
    
    tester = BlogAPITester()
    results = tester.run_all_tests()
    
    # Return appropriate exit code
    return 0 if results['success_rate'] > 0.8 else 1

if __name__ == "__main__":
    sys.exit(main())
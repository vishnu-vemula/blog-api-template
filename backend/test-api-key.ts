
import axios from 'axios';
import 'dotenv/config';

const API_URL = 'http://localhost:4000/api';

async function testApiKeyFlow() {
  try {
    // 1. Login to get JWT
    console.log('Logging in...');
    const loginRes = await axios.post(`${API_URL}/users/login`, {
      email: 'testuser@example.com',
      password: 'password123'
    });
    const token = loginRes.data.token;
    console.log('Login successful. Token obtained.');

    // 2. Create API Key
    console.log('Creating API Key...');
    const createKeyRes = await axios.post(
      `${API_URL}/api-keys`,
      { name: 'My Test Site' },
      { headers: { Authorization: `Bearer ${token}` } }
    );
    const apiKey = createKeyRes.data.data.key;
    const keyId = createKeyRes.data.data.id;
    console.log('API Key created:', apiKey);

    // 3. Test API Key access (Fetch my blogs)
    console.log('Fetching my blogs using API Key...');
    const blogsRes = await axios.get(`${API_URL}/blogs/user/my-blogs`, {
      headers: { 'x-api-key': apiKey }
    });
    console.log('Blogs fetched successfully via API Key!', blogsRes.data);

    // 4. Cleanup (Delete API Key)
    console.log('Deleting API Key...');
    await axios.delete(`${API_URL}/api-keys/${keyId}`, {
      headers: { Authorization: `Bearer ${token}` }
    });
    console.log('API Key deleted.');

  } catch (error: any) {
    console.error('Test failed:', error.response ? error.response.data : error.message);
  }
}

testApiKeyFlow();

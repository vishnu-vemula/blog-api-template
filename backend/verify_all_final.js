const axios = require('axios');

const API_URL = 'http://localhost:4000/api';
const USERNAME = `user_${Date.now()}`;
const EMAIL = `${USERNAME}@example.com`;
const PASSWORD = 'password123';

async function verify() {
  try {
    console.log('1. Registering user...');
    const registerRes = await axios.post(`${API_URL}/users/register`, {
      email: EMAIL,
      username: USERNAME,
      password: PASSWORD,
      firstName: 'Test',
      lastName: 'User'
    });
    const { token, user } = registerRes.data.data;
    console.log('✅ User registered:', user.username);

    console.log('2. Fetching user by username...');
    const userRes = await axios.get(`${API_URL}/users/username/${USERNAME}`);
    if (userRes.data.data.id === user.id) {
        console.log('✅ User fetched by username successfully');
    } else {
        console.error('❌ User ID mismatch');
    }

    console.log('3. Creating API Key...');
    const apiKeyRes = await axios.post(`${API_URL}/api-keys`, {
        name: 'Test Key'
    }, {
        headers: { Authorization: `Bearer ${token}` }
    });
    const apiKey = apiKeyRes.data.data.key;
    console.log('✅ API Key created:', apiKey);

    console.log('4. Fetching blogs with API Key...');
    const blogsRes = await axios.get(`${API_URL}/blogs/user/my-blogs`, {
        headers: { 'x-api-key': apiKey }
    });
    
    if (blogsRes.data.success) {
        console.log('✅ Protected route accessed with API Key');
    }

  } catch (error) {
    console.error('❌ Verification failed:', error.response ? error.response.data : error.message);
    process.exit(1);
  }
}

verify();

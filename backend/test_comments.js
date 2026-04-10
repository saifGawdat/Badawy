const axios = require('axios');
const API_URL = 'http://localhost:5000/api';

const runTests = async () => {
  try {
    console.log('--- Testing Login ---');
    const loginRes = await axios.post(`${API_URL}/auth/login`, {
      username: 'admin',
      password: 'adminpassword123'
    });
    const token = loginRes.data.token;
    console.log('✅ Login successful');

    console.log('\n--- Testing Comments ---');
    // POST Comment
    const createRes = await axios.post(`${API_URL}/comments`, {
      username: 'Test User',
      description: 'Test Comment Description',
      profilePhoto: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Test'
    }, {
      headers: { 'Authorization': `Bearer ${token}` }
    });
    console.log('✅ Comment created:', createRes.data.username);
    const commentId = createRes.data._id;

    // GET Comments
    const getRes = await axios.get(`${API_URL}/comments`);
    console.log('✅ Comments listed, count:', getRes.data.length);

    // DELETE Comment
    const deleteRes = await axios.delete(`${API_URL}/comments/${commentId}`, {
      headers: { 'Authorization': `Bearer ${token}` }
    });
    console.log('✅ Comment deleted:', deleteRes.data.message);

    console.log('\n✅ All tests passed!');
  } catch (error) {
    console.error('❌ Test failed:', error.response ? error.response.data : error.message);
  }
};

runTests();

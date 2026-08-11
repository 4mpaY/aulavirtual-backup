const axios = require('axios');
const fs = require('fs');
async function test() {
  try {
    const res = await axios.get('http://localhost:3000/api/estudiante/certificados', { headers: { Cookie: '...' } });
    console.log(res.data);
  } catch (e) {
    console.error(e.response ? e.response.data : e.message);
  }
}
test();

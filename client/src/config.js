import axios from 'axios';
axios.defaults.headers.common['Bypass-Tunnel-Reminder'] = 'true';

const API_BASE_URL = window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1' 
  ? 'http://localhost:5000/api' 
  : 'https://quize-i74t.onrender.com/api';

export default API_BASE_URL;

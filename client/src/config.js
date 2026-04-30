import axios from 'axios';
axios.defaults.headers.common['Bypass-Tunnel-Reminder'] = 'true';

const API_BASE_URL = 'https://quize-i74t.onrender.com/api';

export default API_BASE_URL;

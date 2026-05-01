import axios from 'axios';
axios.defaults.headers.common['Bypass-Tunnel-Reminder'] = 'true';

const API_BASE_URL = 'http://localhost:5000/api';

export default API_BASE_URL;

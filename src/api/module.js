import axios from './axios';

export const fetchModules = () => axios.get('/api/module/fetch-module');

import axios from './axios';

export const fetchFeatures = (module_id) => axios.get(`/api/feature/fetch-feature/${module_id}`);

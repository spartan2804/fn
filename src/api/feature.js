import axios from './axios';

export const fetchFeatures = (module_id) => axios.get(`/features/${module_id}`);

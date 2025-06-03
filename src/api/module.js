import axios from './axios';

export const fetchModules = (group_id) => axios.get(`/modules/${group_id}`);

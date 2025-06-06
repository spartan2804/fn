import axios from './axios';

export const fetchGroups = (team_id) => axios.get(`/groups/${team_id}`);
export const createGroup = (team_id,data) => axios.post(`/api/group/create-group/${team_id}`, data);

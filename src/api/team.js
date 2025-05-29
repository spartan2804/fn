import axios from './axios';

export const fetchTeams = (product_id) => axios.get(`/teams/${product_id}`);
export const createTeam = (product_id,data) => axios.post(`/api/team/create-team/${product_id}`, data);

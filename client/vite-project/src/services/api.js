
import axios from 'axios';

const API_URL = 'http://localhost:5000/api';

const api = {
  // Employee endpoints
  getEmployees: () => axios.get(`${API_URL}/employees`),
  getEmployee: (id) => axios.get(`${API_URL}/employees/${id}`),
  createEmployee: (data) => axios.post(`${API_URL}/employees`, data),
  updateEmployee: (id, data) => axios.put(`${API_URL}/employees/${id}`, data),
  deleteEmployee: (id) => axios.delete(`${API_URL}/employees/${id}`),
  
  // Evaluation endpoints
  getEvaluations: () => axios.get(`${API_URL}/evaluations`),
  getEvaluation: (id) => axios.get(`${API_URL}/evaluations/${id}`),
  getEmployeeEvaluations: (employeeId) => axios.get(`${API_URL}/employees/${employeeId}/evaluations`),
  createEvaluation: (data) => axios.post(`${API_URL}/evaluations`, data),
  updateEvaluation: (id, data) => axios.put(`${API_URL}/evaluations/${id}`, data),
  deleteEvaluation: (id) => axios.delete(`${API_URL}/evaluations/${id}`),
  
  // AI algorithm endpoints
  findOptimalTeam: (data) => axios.post(`${API_URL}/optimal-team`, data),
  assignTasks: (data) => axios.post(`${API_URL}/assign-tasks`, data)
};

export default api;

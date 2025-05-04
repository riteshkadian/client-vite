import { useState } from 'react';
import api from '../services/api';

function EmployeeForm({ employee, onSubmit, onCancel, employees }) {
  const [formData, setFormData] = useState({
    name: employee?.name || '',
    position: employee?.position || '',
    department: employee?.department || '',
    joinDate: employee?.joinDate
      ? new Date(employee.joinDate).toISOString().split('T')[0]
      : '',
    skills: employee?.skills?.join(', ') || '',
  });

  const [error, setError] = useState('');

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (
      !formData.name ||
      !formData.position ||
      !formData.department ||
      !formData.joinDate
    ) {
      setError('Please fill in all required fields');
      return;
    }

    try {
      const payload = {
        ...formData,
        skills: formData.skills
          .split(',')
          .map((skill) => skill.trim())
          .filter(Boolean),
      };

      let updatedEmployees;

      if (employee) {
        // Update existing employee
        await api.updateEmployee(employee._id, payload);
        updatedEmployees = employees.map((emp) =>
          emp._id === employee._id ? { ...emp, ...payload } : emp
        );
      } else {
        // Create new employee
        const res = await api.createEmployee(payload);
        updatedEmployees = [...employees, res.data];
      }

      onSubmit(updatedEmployees);
    } catch (err) {
      setError(err.response?.data?.message || 'An error occurred');
      console.error(err);
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="space-y-6 p-6 bg-white rounded-md shadow-md max-w-md mx-auto"
    >
      <h3 className="text-xl font-semibold text-gray-800">
        {employee ? 'Edit Employee' : 'Add New Employee'}
      </h3>

      {error && <div className="text-red-600 font-medium">{error}</div>}

      {/* Name */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Name*
        </label>
        <input
          type="text"
          name="name"
          value={formData.name}
          onChange={handleChange}
          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-blue-400 text-gray-900 bg-white"
          required
        />
      </div>

      {/* Position */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Position*
        </label>
        <input
          type="text"
          name="position"
          value={formData.position}
          onChange={handleChange}
          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-blue-400 text-gray-900 bg-white"
          required
        />
      </div>

      {/* Department */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Department*
        </label>
        <input
          type="text"
          name="department"
          value={formData.department}
          onChange={handleChange}
          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-blue-400 text-gray-900 bg-white"
          required
        />
      </div>

      {/* Join Date */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Join Date*
        </label>
        <input
          type="date"
          name="joinDate"
          value={formData.joinDate}
          onChange={handleChange}
          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-blue-400 text-gray-900 bg-white"
          required
        />
      </div>

      {/* Skills */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Skills (comma-separated)
        </label>
        <input
          type="text"
          name="skills"
          value={formData.skills}
          onChange={handleChange}
          placeholder="JavaScript, React, Node.js"
          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-blue-400 text-gray-900 bg-white"
        />
      </div>

      {/* Buttons */}
      <div className="flex justify-end space-x-3 pt-4">
        <button
          type="submit"
          className="bg-blue-600 hover:bg-blue-700 text-white px-5 py-2 rounded-md transition-all"
        >
          {employee ? 'Update' : 'Create'}
        </button>
        <button
          type="button"
          onClick={onCancel}
          className="bg-gray-200 hover:bg-gray-300 text-gray-700 px-5 py-2 rounded-md transition-all"
        >
          Cancel
        </button>
      </div>
    </form>
  );
}

export default EmployeeForm;

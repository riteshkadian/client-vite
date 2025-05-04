import { useState } from 'react';
import api from '../services/api';
import React from 'react';

function EvaluationForm({ employees }) {
  const [formData, setFormData] = useState({
    employee: '',
    evaluator: { name: '', position: '' },
    period: { start: '', end: '' },
    metrics: {
      productivity: 5,
      quality: 5,
      teamwork: 5,
      innovation: 5,
      communication: 5
    },
    constraints: [],
    feedback: ''
  });

  const [success, setSuccess] = useState('');
  const [error, setError] = useState('');
  const [evaluation, setEvaluation] = useState(null);

  const handleChange = (e) => {
    const { name, value } = e.target;

    if (name.includes('.')) {
      const [parent, child] = name.split('.');
      setFormData(prev => ({
        ...prev,
        [parent]: {
          ...prev[parent],
          [child]: value
        }
      }));
    } else {
      setFormData(prev => ({ ...prev, [name]: value }));
    }
  };

  const handleMetricsChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      metrics: {
        ...prev.metrics,
        [name]: Number(value)
      }
    }));
  };

  const handleConstraintChange = (e, index) => {
    const newConstraints = [...formData.constraints];
    newConstraints[index] = e.target.value;

    setFormData(prev => ({
      ...prev,
      constraints: newConstraints
    }));
  };

  const addConstraint = () => {
    setFormData(prev => ({
      ...prev,
      constraints: [...prev.constraints, '']
    }));
  };

  const removeConstraint = (index) => {
    const newConstraints = [...formData.constraints];
    newConstraints.splice(index, 1);

    setFormData(prev => ({
      ...prev,
      constraints: newConstraints
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.employee || !formData.evaluator.name || !formData.period.start || !formData.period.end) {
      setError('Please fill in all required fields');
      return;
    }

    try {
      setError('');
      setSuccess('');

      const res = await api.createEvaluation(formData);
      setEvaluation(res.data);
      setSuccess('Evaluation created successfully');

      setFormData({
        employee: '',
        evaluator: { name: '', position: '' },
        period: { start: '', end: '' },
        metrics: {
          productivity: 5,
          quality: 5,
          teamwork: 5,
          innovation: 5,
          communication: 5
        },
        constraints: [],
        feedback: ''
      });
    } catch (err) {
      setError(err.response?.data?.message || 'An error occurred');
      console.error(err);
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-lg p-8 max-w-4xl mx-auto text-gray-800">
      <h2 className="text-2xl font-bold mb-6">Create New Evaluation</h2>

      {success && <div className="bg-green-100 text-green-800 p-3 rounded mb-4">{success}</div>}
      {error && <div className="bg-red-100 text-red-800 p-3 rounded mb-4">{error}</div>}

      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium">Employee*</label>
            <select
              name="employee"
              value={formData.employee}
              onChange={handleChange}
              className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2 text-gray-900 bg-white"
              required
            >
              <option value="">Select Employee</option>
              {employees.map(emp => (
                <option key={emp._id} value={emp._id}>
                  {emp.name} - {emp.position}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium">Evaluator Name*</label>
            <input
              type="text"
              name="evaluator.name"
              value={formData.evaluator.name}
              onChange={handleChange}
              className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2 text-gray-900"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium">Evaluator Position</label>
            <input
              type="text"
              name="evaluator.position"
              value={formData.evaluator.position}
              onChange={handleChange}
              className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2 text-gray-900"
            />
          </div>

          <div>
            <label className="block text-sm font-medium">Evaluation Period*</label>
            <div className="grid grid-cols-2 gap-2">
              <input
                type="date"
                name="period.start"
                value={formData.period.start}
                onChange={handleChange}
                className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2 text-gray-900"
                required
              />
              <input
                type="date"
                name="period.end"
                value={formData.period.end}
                onChange={handleChange}
                className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2 text-gray-900"
                required
              />
            </div>
          </div>
        </div>

        {/* Performance Metrics */}
        <div>
          <h3 className="text-lg font-semibold mb-3">Performance Metrics</h3>
          {Object.entries(formData.metrics).map(([key, val]) => (
            <div key={key} className="mb-4">
              <label className="block text-sm font-medium capitalize">
                {key}: {val}
              </label>
              <input
                type="range"
                name={key}
                min="0"
                max="10"
                value={val}
                onChange={handleMetricsChange}
                className="w-full"
              />
            </div>
          ))}
        </div>

        {/* Constraints */}
        <div>
          <div className="flex justify-between items-center mb-3">
            <h3 className="text-lg font-semibold">Constraints</h3>
            <button
              type="button"
              onClick={addConstraint}
              className="text-blue-600 text-sm font-medium hover:underline"
            >
              + Add Constraint
            </button>
          </div>

          {formData.constraints.map((constraint, index) => (
            <div key={index} className="flex space-x-2 mb-2">
              <input
                type="text"
                value={constraint}
                onChange={(e) => handleConstraintChange(e, index)}
                className="flex-1 border border-gray-300 rounded-md shadow-sm p-2 text-gray-900"
                placeholder="E.g., Must complete X training by Y date"
              />
              <button
                type="button"
                onClick={() => removeConstraint(index)}
                className="text-red-500 text-sm"
              >
                Remove
              </button>
            </div>
          ))}
        </div>

        {/* Feedback */}
        <div>
          <label className="block text-sm font-medium">Additional Feedback</label>
          <textarea
            name="feedback"
            value={formData.feedback}
            onChange={handleChange}
            rows="4"
            className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2 text-gray-900"
            placeholder="Share any additional comments or observations..."
          ></textarea>
        </div>

        <button
          type="submit"
          className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded shadow"
        >
          Submit Evaluation
        </button>
      </form>

      {evaluation && (
        <div className="mt-10 bg-gray-50 p-5 rounded border">
          <h3 className="text-lg font-semibold mb-3">AI Evaluation Results</h3>
          <dl className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <dt className="text-sm font-medium text-gray-500">Overall Score</dt>
              <dd className="text-2xl font-bold">{evaluation.overallScore}/10</dd>
            </div>
            <div>
              <dt className="text-sm font-medium text-gray-500">Recommended Training</dt>
              <dd>
                <ul className="list-disc pl-5">
                  {evaluation.recommendedTraining.map((item, i) => (
                    <li key={i}>{item}</li>
                  ))}
                </ul>
              </dd>
            </div>
          </dl>
        </div>
      )}
    </div>
  );
}

export default EvaluationForm;

// src/components/TeamBuilder.jsx
import { useState } from 'react';
import api from '../services/api';

function TeamBuilder({ employees }) {
  const [formData, setFormData] = useState({
    teamSize: 3,
    maxPerRole: 1,
    projectRequirements: ''
  });
  
  const [team, setTeam] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: name === 'teamSize' || name === 'maxPerRole' ? Number(value) : value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    try {
      setLoading(true);
      setError('');
      
      const res = await api.findOptimalTeam(formData);
      setTeam(res.data);
      
      setLoading(false);
    } catch (err) {
      setError(err.response?.data?.message || 'An error occurred');
      setLoading(false);
      console.error(err);
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-lg p-6 max-w-6xl mx-auto my-6 border border-gray-100">
      <h2 className="text-2xl font-bold mb-6 text-gray-800 border-b pb-3">Optimal Team Builder <span className="text-blue-500 font-normal text-lg">(Backtracking Algorithm)</span></h2>
      
      {error && (
        <div className="bg-red-50 text-red-700 p-4 rounded-md mb-6 border-l-4 border-red-500 flex items-center">
          <svg className="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
          </svg>
          {error}
        </div>
      )}
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
  <div className="md:pr-4">
    <form onSubmit={handleSubmit} className="space-y-5">
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">Team Size</label>
        <div className="relative">
          <input
            type="number"
            name="teamSize"
            min="2"
            max="10"
            value={formData.teamSize}
            onChange={handleChange}
            className="block w-full border border-gray-300 rounded-lg shadow-sm py-2.5 px-3 text-gray-900 bg-white focus:ring-2 focus:ring-blue-400 focus:border-blue-500 focus:outline-none transition duration-200"
          />
        </div>
        <p className="mt-1 text-xs text-gray-500">Choose between 2-10 team members</p>
      </div>
      
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">Max Members Per Role</label>
        <input
          type="number"
          name="maxPerRole"
          min="1"
          max="5"
          value={formData.maxPerRole}
          onChange={handleChange}
          className="block w-full border border-gray-300 rounded-lg shadow-sm py-2.5 px-3 text-gray-900 bg-white focus:ring-2 focus:ring-blue-400 focus:border-blue-500 focus:outline-none transition duration-200"
        />
        <p className="mt-1 text-xs text-gray-500">Limit of 1-5 people per role</p>
      </div>
      
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">Project Requirements</label>
        <textarea
          name="projectRequirements"
          value={formData.projectRequirements}
          onChange={handleChange}
          rows="4"
          className="block w-full border border-gray-300 rounded-lg shadow-sm py-2.5 px-3 text-gray-900 bg-white focus:ring-2 focus:ring-blue-400 focus:border-blue-500 focus:outline-none transition duration-200"
          placeholder="Describe the skills needed for this project..."
        ></textarea>
      </div>
      
      <button
        type="submit"
        className={`w-full flex justify-center items-center py-3 px-4 rounded-lg text-white font-medium transition duration-200 ${
          loading 
            ? 'bg-blue-400 cursor-not-allowed' 
            : 'bg-blue-600 hover:bg-blue-700 focus:ring-4 focus:ring-blue-300 focus:outline-none'
        }`}
        disabled={loading}
      >
        {loading ? (
          <>
            <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
            Building Team...
          </>
        ) : 'Build Optimal Team'}
      </button>
    </form>
  </div>
  
  <div className="md:border-l md:pl-6 border-gray-200">
    <div className="mb-6">
      <h3 className="text-lg font-semibold mb-3 text-gray-800">Team Algorithm Explanation</h3>
      <div className="bg-blue-50 p-4 rounded-lg border border-blue-100 text-sm">
        <p className="mb-3 text-gray-700">This algorithm uses <strong className="text-blue-700">backtracking</strong> to find the optimal team composition:</p>
        <ol className="list-decimal pl-5 space-y-2 text-gray-700">
          <li>Starts with an empty team</li>
          <li>Recursively tries adding/excluding each employee</li>
          <li>Uses constraints to prune invalid combinations</li>
          <li>Calculates team score based on evaluation metrics</li>
          <li>Returns the highest-scoring valid team</li>
        </ol>
      </div>
    </div>
    
    {team && (
      <div className="mt-6">
        <h3 className="text-lg font-semibold mb-3 text-gray-800 flex items-center">
          <svg className="w-5 h-5 mr-2 text-green-500" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
          </svg>
          Recommended Team
        </h3>
        <div className="bg-gray-50 rounded-lg border border-gray-200">
          <ul className="divide-y divide-gray-200">
            {team.map(member => (
              <li key={member._id} className="p-4 hover:bg-gray-100 transition duration-150">
                <div className="flex items-start">
                  <div className="flex-shrink-0 bg-blue-100 text-blue-700 rounded-full w-10 h-10 flex items-center justify-center font-bold">
                    {member.name.charAt(0)}
                  </div>
                  <div className="ml-3">
                    <div className="font-medium text-gray-800">{member.name}</div>
                    <div className="text-sm text-gray-600 mt-1">{member.position} - {member.department}</div>
                    <div className="flex flex-wrap mt-2 gap-1">
                      {member.skills.map((skill, index) => (
                        <span key={index} className="text-xs px-2 py-1 bg-gray-200 text-gray-700 rounded-full">
                          {skill}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              </li>
            ))}
          </ul>
        </div>
      </div>
    )}
  </div>
</div>
    </div>
  );
}

export default TeamBuilder;
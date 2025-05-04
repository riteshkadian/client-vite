// src/components/Dashboard.jsx
import { useState, useEffect } from 'react';
import api from '../services/api';
import EmployeeList from './EmployeeList';
import PerformanceChart from './PerformanceChart';
import EvaluationForm from './EvaluationForm';
import TeamBuilder from './TeamBuilder';
import TaskAssignment from './TaskAssignment';
function Dashboard() {
  const [employees, setEmployees] = useState([]);
  const [evaluations, setEvaluations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [activeTab, setActiveTab] = useState('overview');

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const [employeesRes, evaluationsRes] = await Promise.all([
          api.getEmployees(),
          api.getEvaluations(),
        ]);
        setEmployees(employeesRes.data);
        setEvaluations(evaluationsRes.data);
        setLoading(false);
      } catch (err) {
        setError('Failed to fetch data');
        setLoading(false);
        console.error(err);
      }
    };

    fetchData();
  }, []);

  if (loading)
    return <div className="flex justify-center items-center h-96 text-blue-600 font-semibold">Loading...</div>;

  if (error)
    return <div className="text-red-500 text-center mt-10">{error}</div>;

  return (
    <div className="max-w-7xl mx-auto w-full">
      <h1 className="text-4xl font-semibold mb-8 text-gray-800">Employee Performance Dashboard</h1>

      {/* Navigation Tabs */}
      <div className="flex space-x-4 border-b border-gray-200 mb-6">
        {[
          { label: 'Overview', key: 'overview' },
          { label: 'Employees', key: 'employees' },
          { label: 'New Evaluation', key: 'evaluations' },
          { label: 'Team Builder', key: 'team-builder' },
          { label: 'Task Assignment', key: 'task-assignment' },
        ].map((tab) => (
          <button
  key={tab.key}
  onClick={() => setActiveTab(tab.key)}
  className={`py-3 px-6 text-sm font-semibold transition-all duration-300 rounded-t-lg transform hover:scale-105 bg-gradient-to-r  ${
    activeTab === tab.key
      ? 'bg-gradient-to-r from-blue-500 to-blue-600 text-white shadow-md '
      : 'bg-transparent text-gray-100 hover:text-white hover:bg-blue-100 '
  }`}
>
  {tab.label}
</button>

        ))}
      </div>

      {/* Content */}
      <div className="mt-6">
        {activeTab === 'overview' && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-white p-6 rounded-lg shadow-md">
              <h2 className="text-xl font-semibold mb-4 text-gray-700">Performance Overview</h2>
              <PerformanceChart evaluations={evaluations} />
            </div>
            <div className="bg-white p-6 rounded-lg shadow-md">
              <h2 className="text-xl font-semibold mb-4 text-gray-700">Recent Evaluations</h2>
              <div className="space-y-4">
                {evaluations.slice(0, 5).map((evaluation) => (
                  <div key={evaluation._id} className="border-b pb-3">
                    <div className="flex justify-between">
                      <div>
                        <p className="font-medium text-gray-800">
                          {evaluation.employee?.name}
                        </p>
                        <p className="text-sm text-gray-600">
                          Overall Score: {evaluation.overallScore}/10
                        </p>
                      </div>
                      <div className="text-sm text-gray-500">
                        {new Date(evaluation.period.end).toLocaleDateString()}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {activeTab === 'employees' && (
          <div className="bg-white p-6 rounded-lg shadow-md">
            <EmployeeList employees={employees} setEmployees={setEmployees} />
          </div>
        )}

        {activeTab === 'evaluations' && (
          <div className="bg-white p-6 rounded-lg shadow-md">
            <EvaluationForm employees={employees} />
          </div>
        )}

        {activeTab === 'team-builder' && (
          <div className="bg-white p-6 rounded-lg shadow-md">
            <TeamBuilder employees={employees} />
          </div>
        )}

        {activeTab === 'task-assignment' && (
          <div className="bg-white p-6 rounded-lg shadow-md">
            <TaskAssignment employees={employees} />
          </div>
        )}
      </div>
    </div>
  );
}

export default Dashboard;
// src/components/TaskAssignment.js
import { useState } from 'react';
import api from '../services/api';

function TaskAssignment({ employees }) {
  const [tasks, setTasks] = useState([
    { id: 1, name: '', priority: 3, requiredSkills: [] }
  ]);
  
  const [assignments, setAssignments] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleTaskChange = (index, field, value) => {
    const updatedTasks = [...tasks];
    
    if (field === 'requiredSkills') {
      // Convert comma-separated string to array
      value = value.split(',').map(skill => skill.trim()).filter(Boolean);
    }
    
    updatedTasks[index] = {
      ...updatedTasks[index],
      [field]: value
    };
    
    setTasks(updatedTasks);
  };

  const addTask = () => {
    setTasks([
      ...tasks, 
      { 
        id: tasks.length + 1, 
        name: '', 
        priority: 3, 
        requiredSkills: [] 
      }
    ]);
  };

  const removeTask = (index) => {
    const updatedTasks = [...tasks];
    updatedTasks.splice(index, 1);
    setTasks(updatedTasks);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (tasks.some(task => !task.name)) {
      setError('All tasks must have a name');
      return;
    }
    
    if (!employees || employees.length === 0) {
      setError('No employees available for task assignment');
      return;
    }
    
    try {
      setLoading(true);
      setError('');
      
      // Log the actual data being sent
      console.log('Tasks data:', JSON.stringify(tasks, null, 2));
      console.log('Employees data:', JSON.stringify(employees, null, 2));
      
      // Include employees in the API call
      const res = await api.assignTasks({ tasks, employees });
      setAssignments(res.data);
      
      setLoading(false);
    } catch (err) {
      // Enhanced error logging
      console.error('API Error Details:', {
        message: err.message,
        status: err.response?.status,
        data: err.response?.data,
      });
      
      setError(err.response?.data?.message || 'An error occurred');
      setLoading(false);
    }
  };
  // Function to get priority color
  const getPriorityColor = (priority) => {
    switch(priority) {
      case 1: return 'bg-green-100 text-green-800';
      case 2: return 'bg-blue-100 text-blue-800';
      case 3: return 'bg-yellow-100 text-yellow-800';
      case 4: return 'bg-orange-100 text-orange-800';
      case 5: return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-lg p-6 max-w-6xl mx-auto">
      <h2 className="text-2xl font-bold mb-6 text-indigo-700 border-b pb-3">Task Assignment System</h2>
      
      {error && (
        <div className="bg-red-100 text-red-700 p-4 rounded-md mb-6 flex items-center">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor">
            <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
          </svg>
          {error}
        </div>
      )}
      
      {(!employees || employees.length === 0) && (
        <div className="bg-yellow-100 text-yellow-700 p-4 rounded-md mb-6 flex items-center">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor">
            <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
          </svg>
          No employees available. Please add employees before assigning tasks.
        </div>
      )}
      
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div className="bg-gray-50 p-6 rounded-lg">
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-xl font-semibold text-gray-800">Tasks</h3>
              <button
                type="button"
                onClick={addTask}
                className="bg-indigo-100 hover:bg-indigo-200 text-indigo-700 font-medium py-2 px-4 rounded-md transition flex items-center"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M10 5a1 1 0 011 1v3h3a1 1 0 110 2h-3v3a1 1 0 11-2 0v-3H6a1 1 0 110-2h3V6a1 1 0 011-1z" clipRule="evenodd" />
                </svg>
                Add Task
              </button>
            </div>
            
            {tasks.map((task, index) => (
              <div key={task.id} className="bg-white border border-gray-200 rounded-lg p-5 shadow-sm">
                <div className="flex justify-between items-center border-b border-gray-100 pb-3 mb-3">
                  <h4 className="font-semibold text-gray-700">Task {index + 1}</h4>
                  {tasks.length > 1 && (
                    <button
                      type="button"
                      onClick={() => removeTask(index)}
                      className="text-red-500 hover:text-red-700 text-sm font-medium flex items-center"
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" viewBox="0 0 20 20" fill="currentColor">
                        <path fillRule="evenodd" d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z" clipRule="evenodd" />
                      </svg>
                      Remove
                    </button>
                  )}
                </div>
                
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Task Name</label>
                    <input
                      type="text"
                      value={task.name}
                      onChange={(e) => handleTaskChange(index, 'name', e.target.value)}
                      className="block w-full border border-gray-300 rounded-md shadow-sm p-3 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 bg-white text-gray-900"
                      placeholder="E.g., Implement API"
                      required
                    />
                  </div>
                  
                  <div>
                    <div className="flex justify-between mb-1">
                      <label className="block text-sm font-medium text-gray-700">Priority</label>
                      <span className={`text-xs font-medium px-2 py-1 rounded-full ${getPriorityColor(task.priority)}`}>
                        {task.priority === 1 ? 'Low' : 
                         task.priority === 2 ? 'Medium-Low' : 
                         task.priority === 3 ? 'Medium' : 
                         task.priority === 4 ? 'Medium-High' : 'High'}
                      </span>
                    </div>
                    <input
                      type="range"
                      min="1"
                      max="5"
                      value={task.priority}
                      onChange={(e) => handleTaskChange(index, 'priority', Number(e.target.value))}
                      className="block w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-indigo-600"
                    />
                    <div className="flex justify-between text-xs text-gray-500 mt-1">
                      <span>Low</span>
                      <span>Medium</span>
                      <span>High</span>
                    </div>
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Required Skills</label>
                    <input
                      type="text"
                      value={task.requiredSkills.join(', ')}
                      onChange={(e) => handleTaskChange(index, 'requiredSkills', e.target.value)}
                      className="block w-full border border-gray-300 rounded-md shadow-sm p-3 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 bg-white text-gray-900"
                      placeholder="JavaScript, React, Node.js"
                    />
                    <p className="mt-1 text-xs text-gray-500">Separate skills with commas</p>
                  </div>
                </div>
              </div>
            ))}
            
            <button
              type="submit"
              className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-medium py-3 px-4 rounded-md shadow transition flex justify-center items-center"
              disabled={loading || !employees || employees.length === 0}
            >
              {loading ? (
                <>
                  <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Assigning Tasks...
                </>
              ) : (
                <>
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor">
                    <path d="M7 9a2 2 0 012-2h6a2 2 0 012 2v6a2 2 0 01-2 2H9a2 2 0 01-2-2V9z" />
                    <path d="M5 3a2 2 0 00-2 2v6a2 2 0 002 2V5h8a2 2 0 00-2-2H5z" />
                  </svg>
                  Assign Tasks to Employees
                </>
              )}
            </button>
          </form>
        </div>
        
        <div>
          <div className="bg-indigo-50 p-6 rounded-lg mb-6">
            <h3 className="text-xl font-semibold text-indigo-800 mb-4">CSP Algorithm Explanation</h3>
            <div className="text-gray-700">
              <p className="mb-3">This algorithm uses <strong>Constraint Satisfaction Problem (CSP)</strong> principles to optimally assign tasks:</p>
              <ol className="list-decimal pl-6 space-y-2">
                <li>Defines variables (tasks to be assigned)</li>
                <li>Defines domains (eligible employees for each task)</li>
                <li>Applies constraints (skills, workload limits, availability)</li>
                <li>Sorts tasks by priority to handle the most important first</li>
                <li>Ensures balanced workload distribution</li>
              </ol>
            </div>
          </div>
          
          {employees && employees.length > 0 && (
            <div className="bg-white border border-gray-200 rounded-lg p-6 shadow mb-6">
              <h3 className="text-xl font-semibold text-gray-800 mb-4">Available Employees</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {employees.map(employee => (
                  <div key={employee._id} className="flex items-center p-3 border border-gray-100 rounded-md">
                    <div className="w-8 h-8 bg-indigo-100 text-indigo-700 rounded-full flex items-center justify-center font-medium mr-3">
                      {employee.name.substring(0, 1)}
                    </div>
                    <div>
                      <div className="font-medium text-gray-800">{employee.name}</div>
                      {employee.skills && employee.skills.length > 0 && (
                        <div className="text-xs text-gray-500">
                          Skills: {employee.skills.join(', ')}
                        </div>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
          
          {assignments && (
            <div className="bg-white border border-gray-200 rounded-lg p-6 shadow">
              <h3 className="text-xl font-semibold text-gray-800 mb-4">Task Assignments</h3>
              
              <div className="space-y-3">
                {Object.entries(assignments.assignments).map(([taskId, employeeId]) => {
                  const task = tasks.find(t => t.id.toString() === taskId);
                  const employee = employees.find(e => e._id === employeeId);
                  
                  return (
                    <div key={taskId} className="border-l-4 border-indigo-500 pl-4 py-3 bg-gray-50 rounded">
                      <div className="font-medium text-gray-800">{task?.name || 'Task'}</div>
                      <div className="flex justify-between mt-1">
                        <div className="text-sm">
                          <span className={`inline-block px-2 py-1 rounded-full text-xs font-medium ${getPriorityColor(task?.priority)}`}>
                            Priority: {task?.priority}
                          </span>
                          {task?.requiredSkills?.length > 0 && (
                            <span className="ml-2 text-gray-600">
                              Skills: {task.requiredSkills.join(', ')}
                            </span>
                          )}
                        </div>
                        <div className="text-sm font-medium flex items-center">
                          <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1 text-indigo-600" viewBox="0 0 20 20" fill="currentColor">
                            <path fillRule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clipRule="evenodd" />
                          </svg>
                          {employee ? employee.name : 'Unassigned'}
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
              
              <div className="mt-6 pt-4 border-t border-gray-200">
                <h4 className="font-medium text-gray-800 mb-2">Workload Distribution</h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  {Object.entries(assignments.employeeLoad).map(([empId, taskCount]) => {
                    const employee = employees.find(e => e._id === empId);
                    if (!employee) return null;
                    
                    // Calculate percentage of workload
                    const maxTasks = 3; // This should match your constraint
                    const loadPercentage = (taskCount / maxTasks) * 100;
                    
                    return (
                      <div key={empId} className="p-3 border border-gray-100 rounded-md">
                        <div className="flex justify-between items-center mb-1">
                          <span className="font-medium text-gray-800">{employee.name}</span>
                          <span className="text-sm text-gray-600">{taskCount} task(s)</span>
                        </div>
                        <div className="w-full bg-gray-200 rounded-full h-2.5">
                          <div 
                            className="bg-indigo-600 h-2.5 rounded-full" 
                            style={{ width: `${loadPercentage}%` }}
                          ></div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default TaskAssignment;

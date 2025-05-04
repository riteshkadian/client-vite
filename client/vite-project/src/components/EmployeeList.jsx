import { useEffect, useState } from 'react';
import api from '../services/api';
import EmployeeForm from './EmployeeForm';

const dummyEmployees = [
    {
      name: 'Alice Johnson',
      position: 'Software Engineer',
      department: 'Engineering',
      joinDate: '2022-01-15',
      skills: ['JavaScript', 'React', 'Node.js'],
    },
    {
      name: 'Bob Smith',
      position: 'UI/UX Designer',
      department: 'Design',
      joinDate: '2021-08-20',
      skills: ['Figma', 'Sketch', 'Adobe XD'],
    },
    {
      name: 'Carol Martinez',
      position: 'Data Analyst',
      department: 'Analytics',
      joinDate: '2023-03-05',
      skills: ['SQL', 'Python', 'Power BI'],
    },
    {
      name: 'David Lee',
      position: 'DevOps Engineer',
      department: 'Engineering',
      joinDate: '2020-11-10',
      skills: ['AWS', 'Docker', 'Kubernetes'],
    },
    {
      name: 'Ella Patel',
      position: 'Marketing Manager',
      department: 'Marketing',
      joinDate: '2019-06-12',
      skills: ['SEO', 'Google Ads', 'Content Strategy'],
    },
    {
      name: 'Franklin Dsouza',
      position: 'Project Manager',
      department: 'Management',
      joinDate: '2021-01-25',
      skills: ['Agile', 'Scrum', 'JIRA'],
    },
    {
      name: 'Grace Kim',
      position: 'QA Engineer',
      department: 'Quality Assurance',
      joinDate: '2022-07-18',
      skills: ['Selenium', 'Postman', 'Jest'],
    },
    {
      name: 'Henry Thompson',
      position: 'Financial Analyst',
      department: 'Finance',
      joinDate: '2020-02-11',
      skills: ['Excel', 'Financial Modeling', 'Budgeting'],
    },
    {
      name: 'Isla Wang',
      position: 'Human Resources Specialist',
      department: 'HR',
      joinDate: '2023-01-08',
      skills: ['Recruitment', 'Employee Engagement', 'Payroll'],
    },
    {
      name: 'Jack Mehra',
      position: 'Cybersecurity Analyst',
      department: 'IT',
      joinDate: '2022-10-14',
      skills: ['Ethical Hacking', 'Firewalls', 'SIEM'],
    },
    {
      name: 'Kiran Desai',
      position: 'Content Writer',
      department: 'Marketing',
      joinDate: '2021-05-30',
      skills: ['Copywriting', 'Blogging', 'SEO Writing'],
    },
    {
      name: 'Liam Murphy',
      position: 'Business Analyst',
      department: 'Business',
      joinDate: '2019-09-17',
      skills: ['Requirement Gathering', 'UML', 'Documentation'],
    },
    {
      name: 'Maya Kapoor',
      position: 'Customer Support Executive',
      department: 'Support',
      joinDate: '2022-04-04',
      skills: ['CRM', 'Problem Solving', 'Communication'],
    },
    {
      name: 'Nathan Scott',
      position: 'Graphic Designer',
      department: 'Design',
      joinDate: '2020-12-22',
      skills: ['Photoshop', 'Illustrator', 'InDesign'],
    },
    {
      name: 'Olivia Fernandez',
      position: 'Machine Learning Engineer',
      department: 'AI & ML',
      joinDate: '2023-06-01',
      skills: ['Python', 'TensorFlow', 'Scikit-learn'],
    },
  ];
  

function EmployeeList({ employees, setEmployees }) {
  const [showForm, setShowForm] = useState(false);
  const [selectedEmployee, setSelectedEmployee] = useState(null);
  const [showDetails, setShowDetails] = useState(null);

  useEffect(() => {
    const seedDummyEmployees = async () => {
      if (employees.length === 0) {
        try {
          const created = await Promise.all(
            dummyEmployees.map((emp) => api.createEmployee(emp))
          );
          setEmployees(created);
        } catch (error) {
          console.error('Error seeding dummy employees:', error);
        }
      }
    };

    seedDummyEmployees();
  }, [employees, setEmployees]);

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this employee?')) {
      try {
        await api.deleteEmployee(id);
        setEmployees(employees.filter((emp) => emp._id !== id));
      } catch (error) {
        console.error('Error deleting employee:', error);
      }
    }
  };

  const handleEdit = (employee) => {
    setSelectedEmployee(employee);
    setShowForm(true);
  };

  const handleFormSubmit = (updatedEmployees) => {
    setEmployees(updatedEmployees);
    setShowForm(false);
    setSelectedEmployee(null);
  };

  const toggleDetails = (id) => {
    setShowDetails(showDetails === id ? null : id);
  };

  return (
    <div className="bg-gradient-to-br from-gray-50 via-white to-gray-100 p-8 rounded-lg shadow-lg max-w-5xl mx-auto mt-10">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-semibold text-gray-800">Employees</h2>
        <button
          className="bg-teal-500 hover:bg-teal-600 text-white px-4 py-2 rounded-md transition-all"
          onClick={() => {
            setSelectedEmployee(null);
            setShowForm(true);
          }}
        >
          Add Employee
        </button>
      </div>

      {showForm ? (
        <EmployeeForm
          employee={selectedEmployee}
          onSubmit={handleFormSubmit}
          onCancel={() => {
            setShowForm(false);
            setSelectedEmployee(null);
          }}
          employees={employees}
        />
      ) : (
        <div className="overflow-x-auto rounded-lg shadow">
          <table className="min-w-full bg-white divide-y divide-gray-200">
            <thead className="bg-gray-100">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase">Name</th>
                <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase">Position</th>
                <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase">Department</th>
                <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {employees.map((employee) => (
                <tr key={employee._id} className="hover:bg-gray-50 transition-colors">
                  <td className="px-6 py-4 text-gray-800">{employee.name}</td>
                  <td className="px-6 py-4 text-gray-800">{employee.position}</td>
                  <td className="px-6 py-4 text-gray-800">{employee.department}</td>
                  <td className="px-6 py-4 space-x-2">
                    <button
                      className="text-teal-600 hover:underline"
                      onClick={() => toggleDetails(employee._id)}
                    >
                      {showDetails === employee._id ? 'Hide' : 'View'}
                    </button>
                    <button
                      className="text-yellow-600 hover:underline"
                      onClick={() => handleEdit(employee)}
                    >
                      Edit
                    </button>
                    <button
                      className="text-red-600 hover:underline"
                      onClick={() => handleDelete(employee._id)}
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {showDetails && (
        <div className="mt-6 p-4 bg-white border rounded-md shadow-sm text-sm text-gray-700">
          <p><strong>Name:</strong> {employees.find(emp => emp._id === showDetails)?.name}</p>
          <p><strong>Position:</strong> {employees.find(emp => emp._id === showDetails)?.position}</p>
          <p><strong>Department:</strong> {employees.find(emp => emp._id === showDetails)?.department}</p>
          <p><strong>Join Date:</strong> {employees.find(emp => emp._id === showDetails)?.joinDate?.split('T')[0]}</p>
          <p><strong>Skills:</strong> {(employees.find(emp => emp._id === showDetails)?.skills || []).join(', ')}</p>
        </div>
      )}
    </div>
  );
}

export default EmployeeList;

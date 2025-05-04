import { useState } from 'react';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer
} from 'recharts';
import { BarChart2, List } from 'lucide-react';

function PerformanceChart({ evaluations }) {
  const [chartType, setChartType] = useState('department');

  const getDepartmentData = () => {
    const departmentMap = {};

    evaluations.forEach(evaluation => {
      const department = evaluation.employee?.department;
      if (department) {
        if (!departmentMap[department]) {
          departmentMap[department] = {
            department,
            productivity: 0,
            quality: 0,
            teamwork: 0,
            innovation: 0,
            communication: 0,
            count: 0
          };
        }

        departmentMap[department].productivity += evaluation.metrics.productivity;
        departmentMap[department].quality += evaluation.metrics.quality;
        departmentMap[department].teamwork += evaluation.metrics.teamwork;
        departmentMap[department].innovation += evaluation.metrics.innovation;
        departmentMap[department].communication += evaluation.metrics.communication;
        departmentMap[department].count += 1;
      }
    });

    return Object.values(departmentMap).map(dept => ({
      name: dept.department,
      productivity: dept.count ? +(dept.productivity / dept.count).toFixed(1) : 0,
      quality: dept.count ? +(dept.quality / dept.count).toFixed(1) : 0,
      teamwork: dept.count ? +(dept.teamwork / dept.count).toFixed(1) : 0,
      innovation: dept.count ? +(dept.innovation / dept.count).toFixed(1) : 0,
      communication: dept.count ? +(dept.communication / dept.count).toFixed(1) : 0
    }));
  };

  const getMetricData = () => {
    const totalMetrics = {
      productivity: 0,
      quality: 0,
      teamwork: 0,
      innovation: 0,
      communication: 0,
      count: 0
    };

    evaluations.forEach(evaluation => {
      totalMetrics.productivity += evaluation.metrics.productivity;
      totalMetrics.quality += evaluation.metrics.quality;
      totalMetrics.teamwork += evaluation.metrics.teamwork;
      totalMetrics.innovation += evaluation.metrics.innovation;
      totalMetrics.communication += evaluation.metrics.communication;
      totalMetrics.count += 1;
    });

    return [
      { name: 'Productivity', value: totalMetrics.count ? +(totalMetrics.productivity / totalMetrics.count).toFixed(1) : 0 },
      { name: 'Quality', value: totalMetrics.count ? +(totalMetrics.quality / totalMetrics.count).toFixed(1) : 0 },
      { name: 'Teamwork', value: totalMetrics.count ? +(totalMetrics.teamwork / totalMetrics.count).toFixed(1) : 0 },
      { name: 'Innovation', value: totalMetrics.count ? +(totalMetrics.innovation / totalMetrics.count).toFixed(1) : 0 },
      { name: 'Communication', value: totalMetrics.count ? +(totalMetrics.communication / totalMetrics.count).toFixed(1) : 0 }
    ];
  };

  const chartData = chartType === 'department' ? getDepartmentData() : getMetricData();

  return (
    <div className="bg-white p-6 rounded-xl shadow-md">
      <h2 className="text-xl font-semibold mb-4 text-gray-800">Employee Performance</h2>

      {/* Custom Toggle Buttons */}
      <div className="flex gap-3 mb-6">
        <CustomButton
          isActive={chartType === 'department'}
          icon={<List size={16} />}
          label="By Department"
          onClick={() => setChartType('department')}
          colorFrom="from-blue-500"
          colorTo="to-blue-600"
        />
        <CustomButton
          isActive={chartType === 'metric'}
          icon={<BarChart2 size={16} />}
          label="By Metric"
          onClick={() => setChartType('metric')}
          colorFrom="from-green-500"
          colorTo="to-green-600"
        />
      </div>

      {/* Chart Section */}
      <div className="h-72">
        <ResponsiveContainer width="100%" height="100%">
          {chartType === 'department' ? (
            <BarChart data={chartData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" />
              <YAxis domain={[0, 10]} />
              <Tooltip />
              <Legend />
              <Bar dataKey="productivity" fill="#8884d8" />
              <Bar dataKey="quality" fill="#82ca9d" />
              <Bar dataKey="teamwork" fill="#ffc658" />
              <Bar dataKey="innovation" fill="#ff8042" />
              <Bar dataKey="communication" fill="#0088fe" />
            </BarChart>
          ) : (
            <BarChart data={chartData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" />
              <YAxis domain={[0, 10]} />
              <Tooltip />
              <Legend />
              <Bar dataKey="value" fill="#8884d8" />
            </BarChart>
          )}
        </ResponsiveContainer>
      </div>
    </div>
  );
}

// Custom Button Component
const CustomButton = ({ isActive, icon, label, onClick, colorFrom, colorTo }) => {
  return (
    <button
      onClick={onClick}
      className={`flex items-center gap-2 px-5 py-2 text-sm font-medium rounded-full shadow-md transition-all duration-300
        ${
          isActive
            ? `text-white bg-gradient-to-r ${colorFrom} ${colorTo}`
            : ''
        }
      `}
    >
      {icon}
      {label}
    </button>
  );
};

export default PerformanceChart;

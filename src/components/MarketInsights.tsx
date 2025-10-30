import { motion } from 'framer-motion';
import { useTheme } from '@/context/ThemeContext';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  LineElement,
  PointElement,
  ArcElement,
  Title,
  Tooltip,
  Legend,
  Filler
} from 'chart.js';
import { Bar, Line, Doughnut } from 'react-chartjs-2';

// Register Chart.js components
ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  LineElement,
  PointElement,
  ArcElement,
  Title,
  Tooltip,
  Legend,
  Filler
);

const MarketInsights = () => {
  const { isDark } = useTheme();

  // Bar Chart Data - Hiring Trends by Role
  const hiringTrendsData = {
    labels: ['Engineering', 'Product', 'Marketing', 'Sales', 'Design'],
    datasets: [
      {
        label: 'Open Positions',
        data: [12, 8, 5, 7, 4],
        backgroundColor: isDark 
          ? 'rgba(34, 211, 238, 0.8)' 
          : 'rgba(147, 51, 234, 0.8)',
        borderColor: isDark ? '#22d3ee' : '#9333ea',
        borderWidth: 1,
      },
    ],
  };

  // Line Chart Data - Application Trends
  const applicationTrendsData = {
    labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'],
    datasets: [
      {
        label: 'Applications Received',
        data: [65, 78, 90, 81, 96, 105],
        borderColor: isDark ? '#22d3ee' : '#9333ea',
        backgroundColor: isDark 
          ? 'rgba(34, 211, 238, 0.1)' 
          : 'rgba(147, 51, 234, 0.1)',
        tension: 0.4,
        fill: true,
      },
    ],
  };

  // Doughnut Chart Data - Candidate Sources
  const candidateSourcesData = {
    labels: ['LinkedIn', 'Referrals', 'Job Boards', 'Direct Apply', 'Agencies'],
    datasets: [
      {
        data: [35, 25, 20, 15, 5],
        backgroundColor: [
          isDark ? '#22d3ee' : '#9333ea',
          isDark ? '#0ea5e9' : '#7c3aed',
          isDark ? '#06b6d4' : '#a855f7',
          isDark ? '#0891b2' : '#c084fc',
          isDark ? '#0e7490' : '#d8b4fe',
        ],
        borderWidth: 0,
      },
    ],
  };

  const chartOptions = (type = 'bar') => ({
    responsive: true,
    plugins: {
      legend: {
        position: 'top' as const,
        labels: {
          color: isDark ? '#fff' : '#374151',
        },
      },
      title: {
        display: true,
        color: isDark ? '#fff' : '#374151',
      },
    },
    scales: type !== 'doughnut' ? {
      x: {
        ticks: { color: isDark ? '#9ca3af' : '#6b7280' },
        grid: { color: isDark ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.1)' },
      },
      y: {
        ticks: { color: isDark ? '#9ca3af' : '#6b7280' },
        grid: { color: isDark ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.1)' },
      },
    } : undefined,
  });

  const quickStats = [
    { metric: '15%', label: 'Higher Tech Salaries', trend: '↑' },
    { metric: '42%', label: 'Remote Roles', trend: '→' },
    { metric: '3.2 Days', label: 'Avg. Time to Hire', trend: '↓' },
    { metric: '68%', label: 'Candidates Open to Move', trend: '↑' },
  ];

  return (
    <section className="py-20 px-4">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          className="text-center mb-16"
        >
          <h3 className={`text-3xl font-bold mb-4 ${isDark ? 'text-white' : 'text-gray-900'}`}>
            HR Market Intelligence
          </h3>
          <p className={`text-lg max-w-2xl mx-auto ${isDark ? 'text-gray-300' : 'text-gray-600'}`}>
            Data-driven insights to optimize your hiring strategy and stay ahead of market trends
          </p>
        </motion.div>

        {/* Quick Stats */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 mb-16">
          {quickStats.map((stat, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              className={`p-6 rounded-xl ${isDark ? 'bg-gray-800' : 'bg-white shadow-md'}`}
            >
              <div className="flex items-center justify-between">
                <div className="text-2xl font-bold">{stat.metric}</div>
                <div className={`text-lg ${
                  stat.trend === '↑' ? 'text-green-500' : 
                  stat.trend === '↓' ? 'text-red-500' : 'text-yellow-500'
                }`}>
                  {stat.trend}
                </div>
              </div>
              <div className={`text-sm mt-2 ${isDark ? 'text-gray-300' : 'text-gray-600'}`}>
                {stat.label}
              </div>
            </motion.div>
          ))}
        </div>

        {/* Charts Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-12">
          {/* Hiring Trends Bar Chart */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            className={`p-6 rounded-xl ${isDark ? 'bg-gray-800' : 'bg-white shadow-md'}`}
          >
            <h4 className={`font-semibold mb-4 ${isDark ? 'text-white' : 'text-gray-900'}`}>
              Open Positions by Department
            </h4>
            <Bar data={hiringTrendsData} options={chartOptions('bar')} />
          </motion.div>

          {/* Application Trends Line Chart */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            whileInView={{ opacity: 1, x: 0 }}
            className={`p-6 rounded-xl ${isDark ? 'bg-gray-800' : 'bg-white shadow-md'}`}
          >
            <h4 className={`font-semibold mb-4 ${isDark ? 'text-white' : 'text-gray-900'}`}>
              Monthly Applications Trend
            </h4>
            <Line data={applicationTrendsData} options={chartOptions('line')}  />
          </motion.div>
        </div>

        {/* Bottom Row - Doughnut Chart */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          className={`p-6 rounded-xl ${isDark ? 'bg-gray-800' : 'bg-white shadow-md'}`}
        >
          <h4 className={`font-semibold mb-4 text-center ${isDark ? 'text-white' : 'text-gray-900'}`}>
            Candidate Sources Distribution
          </h4>
          <div className="max-w-md mx-auto">
            <Doughnut data={candidateSourcesData} options={chartOptions('doughnut')} />
          </div>
        </motion.div>

        {/* Trending Skills */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          className={`mt-12 p-6 rounded-xl ${isDark ? 'bg-gray-800' : 'bg-gray-50'}`}
        >
          <h4 className={`font-semibold mb-4 text-center ${isDark ? 'text-white' : 'text-gray-900'}`}>
            Most In-Demand Skills
          </h4>
          <div className="flex flex-wrap justify-center gap-3">
            {['React', 'Node.js', 'Cloud AWS', 'AI/ML', 'Cybersecurity', 'Python', 'Data Analysis', 'UI/UX'].map((skill) => (
              <span
                key={skill}
                className={`px-4 py-2 rounded-full text-sm font-medium ${
                  isDark 
                    ? 'bg-cyan-500 text-white hover:bg-cyan-600' 
                    : 'bg-purple-100 text-purple-800 hover:bg-purple-200'
                } transition-colors cursor-pointer`}
              >
                {skill}
              </span>
            ))}
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default MarketInsights;
import React, { useState, useContext, useEffect } from 'react';
import { LanguageContext } from '../contexts/LanguageContext';
import Layout from '../components/layout/Layout';
import { 
  FaUsers, 
  FaMoneyBillWave, 
  FaCalendarCheck, 
  FaExclamationTriangle, 
  FaBell, 
  FaWhatsapp,
  FaFileInvoiceDollar
} from 'react-icons/fa';
import { Line, Doughnut, Bar } from 'react-chartjs-2';
import { Chart as ChartJS, ArcElement, Tooltip, Legend, CategoryScale, LinearScale, PointElement, LineElement, Title, BarElement } from 'chart.js';

// Register ChartJS components
ChartJS.register(
  ArcElement, 
  Tooltip, 
  Legend, 
  CategoryScale, 
  LinearScale, 
  PointElement, 
  LineElement, 
  Title,
  BarElement
);

const Dashboard = () => {
  const { translate, direction, language } = useContext(LanguageContext);
  const [dashboardData, setDashboardData] = useState({
    pendingPayments: 24,
    totalCollection: 45680,
    activeStudents: 328,
    overduePayments: 8,
    completedPayments: 104,
    recentActivity: [
      { id: 1, text: 'Ahmed paid $500 for Term 2 fees', time: 'Today at 10:30 AM' },
      { id: 2, text: 'Maria\'s payment reminder sent via WhatsApp', time: 'Yesterday at 3:15 PM' },
      { id: 3, text: 'New student Fatima enrolled', time: 'Apr 5, 2025' },
      { id: 4, text: 'Monthly financial report generated', time: 'Apr 4, 2025' },
      { id: 5, text: 'System backup completed', time: 'Apr 3, 2025' }
    ]
  });
  
  // Chart data for fee collection
  const collectionLineData = {
    labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'],
    datasets: [
      {
        label: translate('monthly_fee_collection'),
        data: [12500, 19200, 15400, 18100, 16400, 21500],
        borderColor: 'rgb(79, 70, 229)',
        backgroundColor: 'rgba(79, 70, 229, 0.2)',
        tension: 0.4,
        fill: true
      }
    ]
  };
  
  // Chart data for fee status
  const feeStatusDoughnutData = {
    labels: [
      translate('paid'), 
      translate('pending'), 
      translate('overdue'), 
      translate('partial')
    ],
    datasets: [
      {
        data: [65, 20, 8, 7],
        backgroundColor: [
          'rgba(52, 211, 153, 0.8)',
          'rgba(251, 191, 36, 0.8)',
          'rgba(239, 68, 68, 0.8)',
          'rgba(147, 51, 234, 0.8)'
        ],
        borderWidth: 0
      }
    ]
  };

  // Chart data for student enrollment by grade
  const enrollmentBarData = {
    labels: ['Grade 1', 'Grade 2', 'Grade 3', 'Grade 4', 'Grade 5', 'Grade 6'],
    datasets: [
      {
        label: translate('students'),
        data: [42, 56, 48, 62, 35, 50],
        backgroundColor: 'rgba(79, 70, 229, 0.6)',
      }
    ]
  };

  // Options for bar chart
  const barOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'top',
      },
    },
  };

  // Format currency based on language
  const formatCurrency = (amount) => {
    if (language === 'ar') {
      return `${amount} د.إ`;
    } else {
      return `$${amount}`;
    }
  };

  return (
    <Layout>
      <div className="pb-6" dir={direction}>
        <h2 className="text-2xl font-bold mb-5">{translate('dashboard')}</h2>
        
        {/* Key Metrics */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
          <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-100">
            <div className="flex items-center">
              <div className="p-3 rounded-full bg-indigo-100 text-indigo-600 mr-4">
                <FaUsers size={24} />
              </div>
              <div>
                <p className="text-sm text-gray-500 font-medium">{translate('active_students')}</p>
                <p className="text-2xl font-semibold">{dashboardData.activeStudents}</p>
              </div>
            </div>
          </div>
          
          <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-100">
            <div className="flex items-center">
              <div className="p-3 rounded-full bg-green-100 text-green-600 mr-4">
                <FaMoneyBillWave size={24} />
              </div>
              <div>
                <p className="text-sm text-gray-500 font-medium">{translate('total_collection')}</p>
                <p className="text-2xl font-semibold">{formatCurrency(dashboardData.totalCollection)}</p>
              </div>
            </div>
          </div>
          
          <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-100">
            <div className="flex items-center">
              <div className="p-3 rounded-full bg-yellow-100 text-yellow-600 mr-4">
                <FaBell size={24} />
              </div>
              <div>
                <p className="text-sm text-gray-500 font-medium">{translate('pending_payments')}</p>
                <p className="text-2xl font-semibold">{dashboardData.pendingPayments}</p>
              </div>
            </div>
          </div>
          
          <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-100">
            <div className="flex items-center">
              <div className="p-3 rounded-full bg-red-100 text-red-600 mr-4">
                <FaExclamationTriangle size={24} />
              </div>
              <div>
                <p className="text-sm text-gray-500 font-medium">{translate('overdue_payments')}</p>
                <p className="text-2xl font-semibold">{dashboardData.overduePayments}</p>
              </div>
            </div>
          </div>
        </div>
        
        {/* Charts Section */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
          {/* Monthly Fee Collection Trend */}
          <div className="bg-white p-5 rounded-lg shadow-sm border border-gray-100 lg:col-span-2">
            <h3 className="text-lg font-semibold mb-4">{translate('fee_collection_trend')}</h3>
            <div style={{ height: '300px' }}>
              <Line 
                data={collectionLineData} 
                options={{
                  responsive: true,
                  maintainAspectRatio: false,
                  plugins: {
                    legend: {
                      display: false
                    }
                  },
                  scales: {
                    y: {
                      beginAtZero: true,
                      ticks: {
                        callback: function(value) {
                          return formatCurrency(value);
                        }
                      }
                    }
                  }
                }} 
              />
            </div>
          </div>
          
          {/* Fee Status Distribution */}
          <div className="bg-white p-5 rounded-lg shadow-sm border border-gray-100">
            <h3 className="text-lg font-semibold mb-4">{translate('fee_status_distribution')}</h3>
            <div style={{ height: '300px', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
              <Doughnut 
                data={feeStatusDoughnutData}
                options={{
                  responsive: true,
                  maintainAspectRatio: false,
                  plugins: {
                    legend: {
                      position: 'bottom'
                    }
                  },
                  cutout: '70%'
                }}
              />
            </div>
          </div>
        </div>
        
        {/* Student Enrollment & Recent Activity */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Student Enrollment By Grade */}
          <div className="bg-white p-5 rounded-lg shadow-sm border border-gray-100 lg:col-span-2">
            <h3 className="text-lg font-semibold mb-4">{translate('student_enrollment_by_grade')}</h3>
            <div style={{ height: '300px' }}>
              <Bar 
                data={enrollmentBarData}
                options={barOptions}
              />
            </div>
          </div>
          
          {/* Recent Activity */}
          <div className="bg-white p-5 rounded-lg shadow-sm border border-gray-100">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-semibold">{translate('recent_activity')}</h3>
              <button className="text-sm text-indigo-600 hover:text-indigo-800">
                {translate('view_all')}
              </button>
            </div>
            <ul className="divide-y divide-gray-200">
              {dashboardData.recentActivity.map(activity => (
                <li key={activity.id} className="py-3">
                  <p className="text-sm">{activity.text}</p>
                  <p className="text-xs text-gray-500 mt-1">{activity.time}</p>
                </li>
              ))}
            </ul>
          </div>
        </div>
        
        {/* Quick Actions */}
        <div className="mt-6 bg-white p-5 rounded-lg shadow-sm border border-gray-100">
          <h3 className="text-lg font-semibold mb-4">{translate('quick_actions')}</h3>
          <div className="flex flex-wrap gap-4">
            <button className="flex items-center px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 transition-colors">
              <FaFileInvoiceDollar className="mr-2" />
              {translate('generate_invoices')}
            </button>
            <button className="flex items-center px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 transition-colors">
              <FaWhatsapp className="mr-2" />
              {translate('send_payment_reminders')}
            </button>
            <button className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors">
              <FaCalendarCheck className="mr-2" />
              {translate('schedule_reports')}
            </button>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default Dashboard;

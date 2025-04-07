import React, { useState, useContext, useEffect } from 'react';
import { LanguageContext } from '../../contexts/LanguageContext';
import { 
  FaMoneyBillWave, 
  FaChartLine, 
  FaCalendarAlt, 
  FaExclamationTriangle, 
  FaFileInvoiceDollar,
  FaGraduationCap,
  FaUserFriends,
  FaDownload
} from 'react-icons/fa';
import { mockFinancialData } from '../../utils/mockDataHandler';
import {
  BarChart,
  Bar,
  LineChart,
  Line,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer
} from 'recharts';

const FinanceDashboard = () => {
  const { translate, direction, language } = useContext(LanguageContext);
  const [financialData, setFinancialData] = useState(null);
  const [periodFilter, setPeriodFilter] = useState('year');
  const [chartView, setChartView] = useState('bar');
  const isRTL = direction === 'rtl';

  useEffect(() => {
    // In a real app, this would be an API call with the appropriate filters
    setFinancialData(mockFinancialData);
  }, []);

  if (!financialData) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-600"></div>
      </div>
    );
  }

  // Colors for charts
  const COLORS = ['#3b82f6', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6', '#ec4899'];
  const OVERDUE_COLOR = '#ef4444';
  const PENDING_COLOR = '#f59e0b';
  const COLLECTED_COLOR = '#10b981';

  // Format currency
  const formatCurrency = (value) => {
    return new Intl.NumberFormat(language === 'ar' ? 'ar-AE' : 'en-US', {
      style: 'currency',
      currency: 'AED',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(value);
  };

  // Format number
  const formatNumber = (value) => {
    return new Intl.NumberFormat(language === 'ar' ? 'ar-AE' : 'en-US').format(value);
  };

  // Format percentage
  const formatPercentage = (value) => {
    return new Intl.NumberFormat(language === 'ar' ? 'ar-AE' : 'en-US', {
      style: 'percent',
      minimumFractionDigits: 1,
      maximumFractionDigits: 1,
    }).format(value / 100);
  };

  // Custom tooltip for charts
  const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-white p-3 shadow-md rounded-md border">
          <p className="font-medium text-gray-700">{label}</p>
          {payload.map((entry, index) => (
            <p key={index} style={{ color: entry.color }}>
              {entry.name}: {formatCurrency(entry.value)}
            </p>
          ))}
        </div>
      );
    }
    return null;
  };

  // Custom pie chart label
  const renderCustomizedLabel = ({ cx, cy, midAngle, innerRadius, outerRadius, percent, index, name }) => {
    const radius = innerRadius + (outerRadius - innerRadius) * 0.5;
    const x = cx + radius * Math.cos(-midAngle * Math.PI / 180);
    const y = cy + radius * Math.sin(-midAngle * Math.PI / 180);

    return (
      <text 
        x={x} 
        y={y} 
        fill="white" 
        textAnchor={x > cx ? 'start' : 'end'} 
        dominantBaseline="central"
        className="text-xs font-medium"
      >
        {`${(percent * 100).toFixed(0)}%`}
      </text>
    );
  };

  // Export dashboard data as Excel
  const exportDashboardData = () => {
    alert(translate('export_dashboard_data'));
    // In a real app, this would trigger an API call to generate and download an Excel report
  };

  return (
    <div dir={direction} className="bg-white rounded-lg shadow-md p-6">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-semibold text-gray-800">{translate('financial_dashboard')}</h2>
        <div className="flex space-x-2">
          <select
            value={periodFilter}
            onChange={(e) => setPeriodFilter(e.target.value)}
            className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 text-sm"
          >
            <option value="month">{translate('this_month')}</option>
            <option value="quarter">{translate('this_quarter')}</option>
            <option value="year">{translate('this_year')}</option>
            <option value="all">{translate('all_time')}</option>
          </select>
          <button
            onClick={exportDashboardData}
            className="bg-indigo-600 text-white px-3 py-2 rounded-md hover:bg-indigo-700 flex items-center text-sm"
          >
            <FaDownload className="mr-2" />
            {translate('export')}
          </button>
        </div>
      </div>

      {/* Key metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
        <div className="bg-white border rounded-lg shadow-sm p-4 hover:shadow-md transition">
          <div className="flex items-center">
            <div className="p-3 rounded-full bg-green-100 text-green-600 mr-4">
              <FaMoneyBillWave className="text-xl" />
            </div>
            <div>
              <p className="text-sm font-medium text-gray-500">{translate('total_collected')}</p>
              <h3 className="text-xl font-bold text-gray-800">{formatCurrency(financialData.totalCollected)}</h3>
            </div>
          </div>
        </div>

        <div className="bg-white border rounded-lg shadow-sm p-4 hover:shadow-md transition">
          <div className="flex items-center">
            <div className="p-3 rounded-full bg-yellow-100 text-yellow-600 mr-4">
              <FaFileInvoiceDollar className="text-xl" />
            </div>
            <div>
              <p className="text-sm font-medium text-gray-500">{translate('pending_payments')}</p>
              <h3 className="text-xl font-bold text-gray-800">{formatCurrency(financialData.totalPending)}</h3>
            </div>
          </div>
        </div>

        <div className="bg-white border rounded-lg shadow-sm p-4 hover:shadow-md transition">
          <div className="flex items-center">
            <div className="p-3 rounded-full bg-red-100 text-red-600 mr-4">
              <FaExclamationTriangle className="text-xl" />
            </div>
            <div>
              <p className="text-sm font-medium text-gray-500">{translate('overdue_payments')}</p>
              <h3 className="text-xl font-bold text-gray-800">{formatCurrency(financialData.totalOverdue)}</h3>
            </div>
          </div>
        </div>

        <div className="bg-white border rounded-lg shadow-sm p-4 hover:shadow-md transition">
          <div className="flex items-center">
            <div className="p-3 rounded-full bg-indigo-100 text-indigo-600 mr-4">
              <FaChartLine className="text-xl" />
            </div>
            <div>
              <p className="text-sm font-medium text-gray-500">{translate('collection_rate')}</p>
              <h3 className="text-xl font-bold text-gray-800">{financialData.collectionRate}%</h3>
            </div>
          </div>
        </div>
      </div>

      {/* Charts and tables */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
        {/* Monthly Collection Chart */}
        <div className="bg-white border rounded-lg shadow-sm p-4 hover:shadow-md transition">
          <div className="mb-4 flex justify-between items-center">
            <h3 className="text-lg font-semibold text-gray-800">{translate('monthly_collection')}</h3>
            <div className="flex space-x-2">
              <button
                onClick={() => setChartView('bar')}
                className={`px-2 py-1 text-xs rounded ${chartView === 'bar' ? 'bg-indigo-100 text-indigo-600' : 'bg-gray-100 text-gray-600'}`}
              >
                {translate('bar_chart')}
              </button>
              <button
                onClick={() => setChartView('line')}
                className={`px-2 py-1 text-xs rounded ${chartView === 'line' ? 'bg-indigo-100 text-indigo-600' : 'bg-gray-100 text-gray-600'}`}
              >
                {translate('line_chart')}
              </button>
            </div>
          </div>
          
          <div className="h-72">
            <ResponsiveContainer width="100%" height="100%">
              {chartView === 'bar' ? (
                <BarChart
                  data={financialData.monthlyCollection}
                  margin={{ top: 10, right: 30, left: 20, bottom: 40 }}
                >
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis 
                    dataKey="month" 
                    angle={-45} 
                    textAnchor="end" 
                    height={70} 
                    tick={{ fontSize: 12 }}
                  />
                  <YAxis 
                    tickFormatter={(value) => formatCurrency(value).replace('AED', '')}
                  />
                  <Tooltip content={<CustomTooltip />} />
                  <Legend />
                  <Bar 
                    dataKey="collected" 
                    name={translate('collected')} 
                    fill={COLLECTED_COLOR} 
                    stackId="a" 
                  />
                  <Bar 
                    dataKey="pending" 
                    name={translate('pending')} 
                    fill={PENDING_COLOR} 
                    stackId="a" 
                  />
                </BarChart>
              ) : (
                <LineChart
                  data={financialData.monthlyCollection}
                  margin={{ top: 10, right: 30, left: 20, bottom: 40 }}
                >
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis 
                    dataKey="month" 
                    angle={-45} 
                    textAnchor="end" 
                    height={70} 
                    tick={{ fontSize: 12 }}
                  />
                  <YAxis 
                    tickFormatter={(value) => formatCurrency(value).replace('AED', '')}
                  />
                  <Tooltip content={<CustomTooltip />} />
                  <Legend />
                  <Line 
                    type="monotone" 
                    dataKey="collected" 
                    name={translate('collected')} 
                    stroke={COLLECTED_COLOR} 
                    strokeWidth={2} 
                    dot={{ r: 4 }} 
                    activeDot={{ r: 6 }}
                  />
                  <Line 
                    type="monotone" 
                    dataKey="pending" 
                    name={translate('pending')} 
                    stroke={PENDING_COLOR} 
                    strokeWidth={2} 
                    dot={{ r: 4 }} 
                    activeDot={{ r: 6 }}
                  />
                </LineChart>
              )}
            </ResponsiveContainer>
          </div>
        </div>

        {/* Fee Type Breakdown */}
        <div className="bg-white border rounded-lg shadow-sm p-4 hover:shadow-md transition">
          <div className="mb-4">
            <h3 className="text-lg font-semibold text-gray-800">{translate('fee_type_breakdown')}</h3>
          </div>
          
          <div className="h-72 flex justify-center">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={financialData.feeTypeBreakdown}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={renderCustomizedLabel}
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="amount"
                  nameKey="type"
                >
                  {financialData.feeTypeBreakdown.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip formatter={(value) => formatCurrency(value)} />
                <Legend />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
        {/* Recent Transactions */}
        <div className="bg-white border rounded-lg shadow-sm p-4 hover:shadow-md transition">
          <div className="mb-4">
            <h3 className="text-lg font-semibold text-gray-800">{translate('recent_transactions')}</h3>
          </div>
          
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    {translate('student')}
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    {translate('type')}
                  </th>
                  <th className="px-4 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                    {translate('amount')}
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    {translate('date')}
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    {translate('status')}
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {financialData.recentTransactions.map((transaction) => (
                  <tr key={transaction.id} className="hover:bg-gray-50">
                    <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-900">
                      {transaction.student}
                    </td>
                    <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-500">
                      {transaction.type}
                    </td>
                    <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-900 text-right">
                      {formatCurrency(transaction.amount)}
                    </td>
                    <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-500">
                      {transaction.date}
                    </td>
                    <td className="px-4 py-3 whitespace-nowrap">
                      <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                        transaction.status === 'Paid' 
                          ? 'bg-green-100 text-green-800' 
                          : transaction.status === 'Pending' 
                            ? 'bg-yellow-100 text-yellow-800' 
                            : 'bg-red-100 text-red-800'
                      }`}>
                        {transaction.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Grade-wise Collection */}
        <div className="bg-white border rounded-lg shadow-sm p-4 hover:shadow-md transition">
          <div className="mb-4">
            <h3 className="text-lg font-semibold text-gray-800">{translate('grade_wise_collection')}</h3>
          </div>
          
          <div className="h-72">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart
                data={financialData.gradeCollection}
                layout="vertical"
                margin={{ top: 10, right: 30, left: 60, bottom: 10 }}
              >
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis 
                  type="number" 
                  tickFormatter={(value) => formatCurrency(value).replace('AED', '')}
                />
                <YAxis 
                  type="category" 
                  dataKey="grade" 
                  tick={{ fontSize: 11 }}
                  width={80}
                />
                <Tooltip content={<CustomTooltip />} />
                <Legend />
                <Bar 
                  dataKey="collected" 
                  name={translate('collected')} 
                  fill={COLLECTED_COLOR} 
                  stackId="a" 
                />
                <Bar 
                  dataKey="pending" 
                  name={translate('pending')} 
                  fill={PENDING_COLOR} 
                  stackId="a" 
                />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* Additional statistics */}
      <div className="bg-white border rounded-lg shadow-sm p-4 hover:shadow-md transition">
        <div className="mb-4">
          <h3 className="text-lg font-semibold text-gray-800">{translate('key_statistics')}</h3>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <div className="border rounded-lg p-4 bg-gray-50">
            <div className="flex items-center">
              <div className="p-2 rounded-full bg-indigo-100 text-indigo-600 mr-3">
                <FaFileInvoiceDollar />
              </div>
              <div>
                <p className="text-xs font-medium text-gray-500 mb-1">{translate('average_fee_collection')}</p>
                <h4 className="text-base font-bold text-gray-800">{formatCurrency(22291)}</h4>
              </div>
            </div>
          </div>
          
          <div className="border rounded-lg p-4 bg-gray-50">
            <div className="flex items-center">
              <div className="p-2 rounded-full bg-indigo-100 text-indigo-600 mr-3">
                <FaCalendarAlt />
              </div>
              <div>
                <p className="text-xs font-medium text-gray-500 mb-1">{translate('collection_frequency')}</p>
                <h4 className="text-base font-bold text-gray-800">{translate('monthly')}</h4>
              </div>
            </div>
          </div>
          
          <div className="border rounded-lg p-4 bg-gray-50">
            <div className="flex items-center">
              <div className="p-2 rounded-full bg-indigo-100 text-indigo-600 mr-3">
                <FaGraduationCap />
              </div>
              <div>
                <p className="text-xs font-medium text-gray-500 mb-1">{translate('top_performing_grade')}</p>
                <h4 className="text-base font-bold text-gray-800">{translate('grade')} 12</h4>
              </div>
            </div>
          </div>
          
          <div className="border rounded-lg p-4 bg-gray-50">
            <div className="flex items-center">
              <div className="p-2 rounded-full bg-indigo-100 text-indigo-600 mr-3">
                <FaUserFriends />
              </div>
              <div>
                <p className="text-xs font-medium text-gray-500 mb-1">{translate('payment_completion_rate')}</p>
                <h4 className="text-base font-bold text-gray-800">94.3%</h4>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default FinanceDashboard;

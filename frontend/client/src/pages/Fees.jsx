import React, { useState, useContext } from 'react';
import Layout from '../components/layout/Layout';
import { LanguageContext } from '../contexts/LanguageContext';
import { message } from 'antd';
import { FaMoneyBillWave, FaChartPie, FaCalendarAlt, FaBell } from 'react-icons/fa';
import mockDataHandler from '../utils/mockDataHandler';
import { API_URL } from '../config';
import FinanceDashboard from '../components/finance/FinanceDashboard';
import InstallmentPlan from '../components/finance/InstallmentPlan';
import FeeNotice from '../components/finance/FeeNotice';

const Fees = () => {
  const { translate, direction } = useContext(LanguageContext);
  const [activeTab, setActiveTab] = useState('fees'); // 'fees', 'dashboard', 'installment', 'notice'

  // Mock fee structures - in a real app this would come from an API
  const [feeStructures] = useState([
    { id: 1, name: 'Tuition Fee', frequency: 'Monthly', amount: 500, applicableTo: 'All Students' },
    { id: 2, name: 'Library Fee', frequency: 'Quarterly', amount: 150, applicableTo: 'All Students' },
    { id: 3, name: 'Transport Fee', frequency: 'Monthly', amount: 300, applicableTo: 'Transport Users' },
    { id: 4, name: 'Sports Fee', frequency: 'Annual', amount: 200, applicableTo: 'All Students' },
  ]);

  // Recent transactions - in a real app this would come from an API
  const [recentTransactions] = useState([
    { id: 1, studentName: 'Ahmed Hassan', feeType: 'Tuition Fee', amount: 500, date: '2025-04-05', status: 'Paid' },
    { id: 2, studentName: 'Fatima Ali', feeType: 'Transport Fee', amount: 300, date: '2025-04-04', status: 'Paid' },
    { id: 3, studentName: 'Mohammed Khan', feeType: 'Tuition Fee', amount: 500, date: '2025-04-03', status: 'Pending' },
    { id: 4, studentName: 'Sara Ibrahim', feeType: 'Library Fee', amount: 150, date: '2025-04-02', status: 'Paid' },
  ]);

  // State for payment collection
  const [selectedStudent, setSelectedStudent] = useState(null);
  const [selectedFee, setSelectedFee] = useState(null);
  const [paymentAmount, setPaymentAmount] = useState('');
  const [paymentDate, setPaymentDate] = useState('');
  const [paymentMethod, setPaymentMethod] = useState('cash');
  const [showPaymentModal, setShowPaymentModal] = useState(false);
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [loading, setLoading] = useState(false);

  // Payment methods
  const paymentMethods = [
    { id: 'cash', name: translate('cash') },
    { id: 'bank_transfer', name: translate('bank_transfer') },
    { id: 'credit_card', name: translate('credit_card') }
  ];

  // Export functionality
  const [exportFormat, setExportFormat] = useState('csv');
  const [exportLoading, setExportLoading] = useState(false);
  const [exportError, setExportError] = useState('');

  const handleExport = async () => {
    try {
      setExportLoading(true);
      setExportError('');
      
      // Get students data from context or API
      const students = await fetch(`${API_URL}/api/students`).then(res => res.json());
      
      // Get fee data for each student
      const studentsWithFees = await Promise.all(students.map(async student => {
        const fees = await fetch(`${API_URL}/api/students/${student._id}/fees`).then(res => res.json());
        return { ...student, fees };
      }));
      
      // Prepare data for export
      const exportData = studentsWithFees.map(student => ({
        studentName: student.name,
        grade: student.grade,
        section: student.section,
        admissionNumber: student.admissionNumber,
        fees: student.fees.map(fee => ({
          feeType: fee.feeType,
          amount: fee.amount,
          dueDate: fee.dueDate,
          status: fee.status
        }))
      }));
      
      // Use mockDataHandler for export
      await mockDataHandler.exportToExcel(exportData);
      
      message.success(translate('export_successful'));
    } catch (error) {
      console.error('Export error:', error);
      setExportError(error.message || translate('failed_to_export'));
      message.error(translate('failed_to_export'));
    } finally {
      setExportLoading(false);
    }
  };

  // Handle payment collection
  const handleCollectPayment = async () => {
    try {
      setLoading(true);
      
      // Validate input
      if (!paymentAmount || !paymentDate) {
        throw new Error(translate('please_fill_all_fields'));
      }
      
      // In a real app, this would make an API call
      // For now, we'll just show a success message
      const paymentData = {
        student: selectedStudent,
        feeType: selectedFee,
        amount: paymentAmount,
        date: paymentDate,
        method: paymentMethod,
        status: 'Paid'
      };
      
      // Update recent transactions
      const newTransaction = {
        id: Date.now(),
        studentName: selectedStudent,
        feeType: selectedFee,
        amount: paymentAmount,
        date: paymentDate,
        status: 'Paid'
      };
      
      // In a real app, we would update the state and persist to backend
      console.log('Payment collected:', paymentData);
      
      // Show success modal
      setShowPaymentModal(false);
      setShowSuccessModal(true);
      setTimeout(() => setShowSuccessModal(false), 3000);
      
    } catch (error) {
      message.error(error.message);
    } finally {
      setLoading(false);
    }
  };

  // Handle reminder sending
  const handleSendReminder = async (student, feeType) => {
    try {
      setLoading(true);
      
      // In a real app, this would send an email/SMS
      console.log('Sending reminder to:', student, 'for', feeType);
      message.success(translate('reminder_sent_successfully'));
      
    } catch (error) {
      message.error(error.message);
    } finally {
      setLoading(false);
    }
  };

  // Tab navigation handler
  const handleTabChange = (tab) => {
    setActiveTab(tab);
  };

  const renderContent = () => {
    switch (activeTab) {
      case 'dashboard':
        return <FinanceDashboard />;
      case 'installment':
        return <InstallmentPlan />;
      case 'notice':
        return <FeeNotice />;
      default:
        return (
          <>
            <div className="flex justify-between mb-6">
              <h2 className="text-2xl font-bold">{translate('fee_management')}</h2>
              <div className="flex space-x-4">
                <button 
                  className="bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded flex items-center"
                >
                  <FaMoneyBillWave className="mr-2" />
                  {translate('collect_payment')}
                </button>
                <button 
                  className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded flex items-center"
                >
                  <FaCalendarAlt className="mr-2" />
                  {translate('create_fee_structure')}
                </button>
              </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
              {/* Fee Structures */}
              <div className="bg-white shadow overflow-hidden sm:rounded-lg">
                <div className="px-4 py-5 sm:px-6 bg-gray-50">
                  <h3 className="text-lg leading-6 font-medium text-gray-900">{translate('fee_structures')}</h3>
                </div>
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">{translate('name')}</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">{translate('frequency')}</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">{translate('amount')}</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">{translate('applicable_to')}</th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {feeStructures.map((fee) => (
                      <tr key={fee.id}>
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{fee.name}</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{fee.frequency}</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">${fee.amount}</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{fee.applicableTo}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {/* Recent Transactions */}
              <div className="bg-white shadow overflow-hidden sm:rounded-lg">
                <div className="px-4 py-5 sm:px-6 bg-gray-50">
                  <h3 className="text-lg leading-6 font-medium text-gray-900">{translate('recent_transactions')}</h3>
                </div>
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">{translate('student')}</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">{translate('fee_type')}</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">{translate('amount')}</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">{translate('date')}</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">{translate('status')}</th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {recentTransactions.map((transaction) => (
                      <tr key={transaction.id}>
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{transaction.studentName}</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{transaction.feeType}</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">${transaction.amount}</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{transaction.date}</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm">
                          <span className={`px-2 py-1 rounded text-xs font-medium ${
                            transaction.status === 'Paid' 
                              ? 'bg-green-100 text-green-800' 
                              : 'bg-yellow-100 text-yellow-800'
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

            {/* Outstanding Dues */}
            <div className="bg-white shadow overflow-hidden sm:rounded-lg mt-6">
              <div className="px-4 py-5 sm:px-6 bg-gray-50 flex justify-between">
                <h3 className="text-lg leading-6 font-medium text-gray-900">{translate('outstanding_dues')}</h3>
                <button className="text-sm text-blue-600 hover:text-blue-800 flex items-center">
                  <FaBell className="mr-1" />
                  {translate('send_bulk_reminders')}
                </button>
              </div>
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">{translate('student')}</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">{translate('fee_type')}</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">{translate('due_date')}</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">{translate('amount')}</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">{translate('actions')}</th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  <tr>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">Mohammed Khan</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">Tuition Fee</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">2025-04-10</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">$500</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                      <div className="flex space-x-2">
                        <button
                          onClick={() => {
                            setSelectedStudent('Mohammed Khan');
                            setSelectedFee('Tuition Fee');
                            setPaymentAmount(500);
                            setShowPaymentModal(true);
                          }}
                          className="text-indigo-600 hover:text-indigo-900"
                          disabled={loading}
                        >
                          {translate('collect')}
                        </button>
                        <button
                          onClick={() => handleSendReminder('Mohammed Khan', 'Tuition Fee')}
                          className="text-green-600 hover:text-green-900"
                          disabled={loading}
                        >
                          {translate('send_reminder')}
                        </button>
                      </div>
                    </td>
                  </tr>
                  <tr>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">Layla Mahmoud</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">Transport Fee</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">2025-04-15</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">$300</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                      <div className="flex space-x-2">
                        <button
                          onClick={() => {
                            setSelectedStudent('Layla Mahmoud');
                            setSelectedFee('Transport Fee');
                            setPaymentAmount(300);
                            setShowPaymentModal(true);
                          }}
                          className="text-indigo-600 hover:text-indigo-900"
                          disabled={loading}
                        >
                          {translate('collect')}
                        </button>
                        <button
                          onClick={() => handleSendReminder('Layla Mahmoud', 'Transport Fee')}
                          className="text-green-600 hover:text-green-900"
                          disabled={loading}
                        >
                          {translate('send_reminder')}
                        </button>
                      </div>
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </>
        );
    }
  };

  // Payment modal
  const PaymentModal = () => (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-lg p-6 max-w-md w-full">
        <h3 className="text-xl font-bold mb-4">{translate('collect_payment')}</h3>
        
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700">
              {translate('student')}
            </label>
            <input
              type="text"
              value={selectedStudent}
              readOnly
              className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm"
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700">
              {translate('fee_type')}
            </label>
            <input
              type="text"
              value={selectedFee}
              readOnly
              className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm"
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700">
              {translate('amount')}
            </label>
            <input
              type="number"
              value={paymentAmount}
              onChange={(e) => setPaymentAmount(e.target.value)}
              className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm"
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700">
              {translate('date')}
            </label>
            <input
              type="date"
              value={paymentDate}
              onChange={(e) => setPaymentDate(e.target.value)}
              className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm"
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700">
              {translate('payment_method')}
            </label>
            <select
              value={paymentMethod}
              onChange={(e) => setPaymentMethod(e.target.value)}
              className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm"
            >
              {paymentMethods.map((method) => (
                <option key={method.id} value={method.id}>
                  {method.name}
                </option>
              ))}
            </select>
          </div>
        </div>
        
        <div className="mt-6 flex justify-end space-x-3">
          <button
            onClick={() => setShowPaymentModal(false)}
            className="px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50"
          >
            {translate('cancel')}
          </button>
          <button
            onClick={handleCollectPayment}
            disabled={loading}
            className="px-4 py-2 bg-indigo-600 border border-transparent rounded-md text-sm font-medium text-white hover:bg-indigo-700"
          >
            {loading ? translate('processing') : translate('collect')}
          </button>
        </div>
      </div>
    </div>
  );

  // Success modal
  const SuccessModal = () => (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-lg p-6">
        <div className="text-center">
          <svg className="mx-auto h-12 w-12 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
          </svg>
          <h3 className="mt-3 text-lg font-medium text-green-900">
            {translate('payment_collected_successfully')}
          </h3>
        </div>
      </div>
    </div>
  );

  return (
    <Layout>
      <div dir={direction}>
        <h1 className="text-3xl font-bold mb-6">{translate('fees')}</h1>
        
        {/* Enhanced Tab Navigation */}
        <div className="mb-6 border-b border-gray-200">
          <nav className="-mb-px flex" aria-label="Tabs">
            <button
              className={`${
                activeTab === 'fees'
                  ? 'border-indigo-500 text-indigo-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              } whitespace-nowrap py-4 px-4 border-b-2 font-medium text-sm flex items-center transition-colors`}
              onClick={() => handleTabChange('fees')}
            >
              <FaMoneyBillWave className={`mr-2 ${activeTab === 'fees' ? 'text-indigo-600' : 'text-gray-400'}`} />
              {translate('fee_management')}
            </button>
            <button
              className={`${
                activeTab === 'dashboard'
                  ? 'border-indigo-500 text-indigo-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              } whitespace-nowrap py-4 px-4 border-b-2 font-medium text-sm flex items-center transition-colors`}
              onClick={() => handleTabChange('dashboard')}
            >
              <FaChartPie className={`mr-2 ${activeTab === 'dashboard' ? 'text-indigo-600' : 'text-gray-400'}`} />
              {translate('financial_dashboard')}
            </button>
            <button
              className={`${
                activeTab === 'installment'
                  ? 'border-indigo-500 text-indigo-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              } whitespace-nowrap py-4 px-4 border-b-2 font-medium text-sm flex items-center transition-colors`}
              onClick={() => handleTabChange('installment')}
            >
              <FaCalendarAlt className={`mr-2 ${activeTab === 'installment' ? 'text-indigo-600' : 'text-gray-400'}`} />
              {translate('installment_plans')}
            </button>
            <button
              className={`${
                activeTab === 'notice'
                  ? 'border-indigo-500 text-indigo-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              } whitespace-nowrap py-4 px-4 border-b-2 font-medium text-sm flex items-center transition-colors`}
              onClick={() => handleTabChange('notice')}
            >
              <FaBell className={`mr-2 ${activeTab === 'notice' ? 'text-indigo-600' : 'text-gray-400'}`} />
              {translate('fee_notices')}
            </button>
          </nav>
        </div>
        
        {/* Tab Content */}
        <div className="mb-6">
          {renderContent()}
        </div>
        
        {/* Export functionality */}
        <div className="py-6" dir={direction}>
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex justify-between items-center mb-6">
              <h1 className="text-2xl font-semibold text-gray-900">
                {translate('fees')}
              </h1>
              <div className="flex space-x-3">
                <button
                  onClick={() => setActiveTab('dashboard')}
                  className={`px-4 py-2 rounded-md ${
                    activeTab === 'dashboard' 
                      ? 'bg-indigo-600 text-white' 
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
                >
                  {translate('dashboard')}
                </button>
                <button
                  onClick={() => setActiveTab('installment')}
                  className={`px-4 py-2 rounded-md ${
                    activeTab === 'installment' 
                      ? 'bg-indigo-600 text-white' 
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
                >
                  {translate('installment_plans')}
                </button>
                <button
                  onClick={() => setActiveTab('notice')}
                  className={`px-4 py-2 rounded-md ${
                    activeTab === 'notice' 
                      ? 'bg-indigo-600 text-white' 
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
                >
                  {translate('fee_notices')}
                </button>
                <button
                  onClick={() => setShowPaymentModal(true)}
                  className="px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700"
                >
                  {translate('collect_payment')}
                </button>
                <div className="relative">
                  <select
                    value={exportFormat}
                    onChange={(e) => setExportFormat(e.target.value)}
                    className="px-4 py-2 border border-gray-300 rounded-md"
                  >
                    <option value="csv">CSV</option>
                    <option value="excel">Excel</option>
                    <option value="pdf">PDF</option>
                  </select>
                  <button
                    onClick={handleExport}
                    disabled={exportLoading}
                    className="ml-2 px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700"
                  >
                    {exportLoading ? translate('exporting') : translate('export')}
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
        
        {/* Payment and Success Modals */}
        {showPaymentModal && <PaymentModal />}
        {showSuccessModal && <SuccessModal />}
      </div>
    </Layout>
  );
};

export default Fees;

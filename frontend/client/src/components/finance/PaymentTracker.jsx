import React, { useState, useContext, useEffect } from 'react';
import { LanguageContext } from '../../contexts/LanguageContext';
import { FaSearch, FaFilePdf, FaWhatsapp, FaEnvelope, FaCalendarAlt } from 'react-icons/fa';
import { mockPayments } from '../../utils/mockDataHandler';

const PaymentTracker = () => {
  const { translate, direction } = useContext(LanguageContext);
  const [payments, setPayments] = useState([]);
  const [filteredPayments, setFilteredPayments] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');
  const [selectedPayment, setSelectedPayment] = useState(null);
  const [showDetailModal, setShowDetailModal] = useState(false);

  useEffect(() => {
    // In a real app, this would be an API call
    const fetchPayments = async () => {
      try {
        // Mock data for demonstration
        setPayments(mockPayments);
        setFilteredPayments(mockPayments);
      } catch (error) {
        console.error('Error fetching payments:', error);
      }
    };

    fetchPayments();
  }, []);

  useEffect(() => {
    let result = payments;
    
    // Filter by search term
    if (searchTerm) {
      result = result.filter(
        payment => 
          payment.studentName.toLowerCase().includes(searchTerm.toLowerCase()) ||
          payment.paymentId.toString().includes(searchTerm) ||
          payment.studentId.toString().includes(searchTerm)
      );
    }
    
    // Filter by status
    if (filterStatus !== 'all') {
      result = result.filter(payment => payment.status === filterStatus);
    }
    
    setFilteredPayments(result);
  }, [searchTerm, filterStatus, payments]);

  const handleRowClick = (payment) => {
    setSelectedPayment(payment);
    setShowDetailModal(true);
  };

  const handleSendReminder = (payment, method) => {
    // Prevent row click when clicking on action buttons
    event.stopPropagation();
    
    // In a real app, this would trigger an API call to send the reminder
    alert(`${translate('reminder_sent_via')} ${method === 'whatsapp' ? 'WhatsApp' : 'Email'} ${translate('to')} ${payment.studentName}`);
  };

  const getStatusClass = (status) => {
    switch (status) {
      case 'paid':
        return 'bg-green-100 text-green-800';
      case 'pending':
        return 'bg-yellow-100 text-yellow-800';
      case 'overdue':
        return 'bg-red-100 text-red-800';
      case 'partial':
        return 'bg-blue-100 text-blue-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  // Calculate days overdue or remaining
  const getDaysStatus = (payment) => {
    const today = new Date();
    const dueDate = new Date(payment.dueDate);
    const diffTime = dueDate - today;
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    
    if (payment.status === 'paid') {
      return translate('paid_on_date', { date: new Date(payment.paidDate).toLocaleDateString() });
    } else if (diffDays < 0) {
      return translate('overdue_by_days', { days: Math.abs(diffDays) });
    } else {
      return translate('due_in_days', { days: diffDays });
    }
  };

  return (
    <div dir={direction} className="bg-white rounded-lg shadow-md p-6">
      <h2 className="text-2xl font-semibold text-gray-800 mb-6">{translate('payment_tracker')}</h2>
      
      {/* Search and filter controls */}
      <div className="flex flex-col md:flex-row justify-between items-center mb-6 space-y-4 md:space-y-0">
        <div className="relative w-full md:w-1/3">
          <input
            type="text"
            placeholder={translate('search_payments')}
            className="pl-10 pr-4 py-2 border border-gray-300 rounded-md w-full focus:outline-none focus:ring-2 focus:ring-indigo-500"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
          <FaSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
        </div>
        
        <div className="flex items-center space-x-4">
          <label className="text-gray-700">{translate('status')}:</label>
          <select
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value)}
            className="border border-gray-300 rounded-md px-4 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500"
          >
            <option value="all">{translate('all_statuses')}</option>
            <option value="paid">{translate('paid')}</option>
            <option value="pending">{translate('pending')}</option>
            <option value="overdue">{translate('overdue')}</option>
            <option value="partial">{translate('partial')}</option>
          </select>
        </div>
      </div>
      
      {/* Payments table */}
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                {translate('id')}
              </th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                {translate('student')}
              </th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                {translate('amount')}
              </th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                {translate('due_date')}
              </th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                {translate('status')}
              </th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                {translate('actions')}
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {filteredPayments.length > 0 ? (
              filteredPayments.map((payment) => (
                <tr 
                  key={payment.paymentId} 
                  className="hover:bg-gray-50 cursor-pointer"
                  onClick={() => handleRowClick(payment)}
                >
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                    {payment.paymentId}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    <div className="font-medium">{payment.studentName}</div>
                    <div className="text-xs">ID: {payment.studentId}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    <div className="font-semibold">{payment.currency} {payment.amount.toFixed(2)}</div>
                    {payment.status === 'partial' && (
                      <div className="text-xs text-gray-500">
                        {translate('paid')}: {payment.currency} {payment.paidAmount.toFixed(2)}
                      </div>
                    )}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    <div className="flex items-center">
                      <FaCalendarAlt className="mr-2 text-gray-400" />
                      <div>
                        <div>{new Date(payment.dueDate).toLocaleDateString()}</div>
                        <div className="text-xs font-medium">
                          {getDaysStatus(payment)}
                        </div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`px-3 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${getStatusClass(payment.status)}`}>
                      {translate(payment.status)}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    <div className="flex space-x-2">
                      <button 
                        className="text-indigo-600 hover:text-indigo-900" 
                        title={translate('download_receipt')}
                        onClick={(e) => {
                          e.stopPropagation();
                          alert(translate('downloading_receipt'));
                        }}
                      >
                        <FaFilePdf />
                      </button>
                      
                      {(payment.status === 'pending' || payment.status === 'overdue' || payment.status === 'partial') && (
                        <>
                          <button 
                            className="text-green-600 hover:text-green-900" 
                            title={translate('whatsapp_reminder')}
                            onClick={(e) => handleSendReminder(payment, 'whatsapp')}
                          >
                            <FaWhatsapp />
                          </button>
                          
                          <button 
                            className="text-blue-600 hover:text-blue-900" 
                            title={translate('email_reminder')}
                            onClick={(e) => handleSendReminder(payment, 'email')}
                          >
                            <FaEnvelope />
                          </button>
                        </>
                      )}
                    </div>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="6" className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 text-center">
                  {translate('no_payments_found')}
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
      
      {/* Payment detail modal */}
      {showDetailModal && selectedPayment && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
          <div className="relative top-20 mx-auto p-5 border w-11/12 md:w-3/4 lg:w-1/2 shadow-lg rounded-md bg-white">
            <div className="flex justify-between items-center border-b pb-4 mb-4">
              <h3 className="text-xl font-semibold text-gray-900">
                {translate('payment_details')}
              </h3>
              <button 
                onClick={() => setShowDetailModal(false)}
                className="text-gray-400 hover:text-gray-500"
              >
                &times;
              </button>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
              <div>
                <h4 className="text-sm font-medium text-gray-500">{translate('payment_id')}</h4>
                <p className="text-base">{selectedPayment.paymentId}</p>
              </div>
              
              <div>
                <h4 className="text-sm font-medium text-gray-500">{translate('fee_type')}</h4>
                <p className="text-base">{selectedPayment.feeType}</p>
              </div>
              
              <div>
                <h4 className="text-sm font-medium text-gray-500">{translate('student_name')}</h4>
                <p className="text-base">{selectedPayment.studentName}</p>
              </div>
              
              <div>
                <h4 className="text-sm font-medium text-gray-500">{translate('student_id')}</h4>
                <p className="text-base">{selectedPayment.studentId}</p>
              </div>
              
              <div>
                <h4 className="text-sm font-medium text-gray-500">{translate('amount')}</h4>
                <p className="text-base font-semibold">
                  {selectedPayment.currency} {selectedPayment.amount.toFixed(2)}
                </p>
              </div>
              
              <div>
                <h4 className="text-sm font-medium text-gray-500">{translate('status')}</h4>
                <p className="text-base">
                  <span className={`px-3 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${getStatusClass(selectedPayment.status)}`}>
                    {translate(selectedPayment.status)}
                  </span>
                </p>
              </div>
              
              <div>
                <h4 className="text-sm font-medium text-gray-500">{translate('due_date')}</h4>
                <p className="text-base">
                  {new Date(selectedPayment.dueDate).toLocaleDateString()}
                </p>
              </div>
              
              {selectedPayment.paidDate && (
                <div>
                  <h4 className="text-sm font-medium text-gray-500">{translate('paid_date')}</h4>
                  <p className="text-base">
                    {new Date(selectedPayment.paidDate).toLocaleDateString()}
                  </p>
                </div>
              )}
            </div>
            
            {selectedPayment.status === 'partial' && (
              <div className="mb-4 p-4 bg-gray-50 rounded-md">
                <h4 className="font-medium text-gray-700 mb-2">{translate('payment_history')}</h4>
                <div className="space-y-2">
                  {selectedPayment.paymentHistory && selectedPayment.paymentHistory.map((payment, index) => (
                    <div key={index} className="flex justify-between items-center text-sm">
                      <span>{new Date(payment.date).toLocaleDateString()}</span>
                      <span className="font-medium">{selectedPayment.currency} {payment.amount.toFixed(2)}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}
            
            <div className="border-t pt-4 flex justify-end space-x-3">
              {(selectedPayment.status === 'pending' || selectedPayment.status === 'overdue' || selectedPayment.status === 'partial') && (
                <button
                  onClick={() => {
                    alert(translate('payment_recorded'));
                    setShowDetailModal(false);
                  }}
                  className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700"
                >
                  {translate('record_payment')}
                </button>
              )}
              
              <button
                onClick={() => setShowDetailModal(false)}
                className="px-4 py-2 bg-gray-200 text-gray-800 rounded-md hover:bg-gray-300"
              >
                {translate('close')}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default PaymentTracker;

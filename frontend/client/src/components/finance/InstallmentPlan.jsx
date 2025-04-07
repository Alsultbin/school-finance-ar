import React, { useState, useContext, useEffect } from 'react';
import { LanguageContext } from '../../contexts/LanguageContext';
import { FaPlus, FaEdit, FaTrash, FaCalendarAlt, FaUser, FaMoneyBillWave } from 'react-icons/fa';
import { mockInstallmentPlans } from '../../utils/mockDataHandler';

const InstallmentPlan = () => {
  const { translate, direction } = useContext(LanguageContext);
  const [plans, setPlans] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [currentPlan, setCurrentPlan] = useState(null);
  const [formData, setFormData] = useState({
    studentId: '',
    studentName: '',
    feeType: '',
    totalAmount: '',
    currency: 'USD',
    numberOfInstallments: 3,
    startDate: '',
    notes: '',
  });
  const [installments, setInstallments] = useState([]);

  useEffect(() => {
    // In a real app, this would be an API call
    setPlans(mockInstallmentPlans);
  }, []);

  useEffect(() => {
    if (formData.totalAmount && formData.numberOfInstallments && formData.startDate) {
      generateInstallmentSchedule();
    }
  }, [formData.totalAmount, formData.numberOfInstallments, formData.startDate]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const generateInstallmentSchedule = () => {
    const total = parseFloat(formData.totalAmount);
    const count = parseInt(formData.numberOfInstallments);
    const startDate = new Date(formData.startDate);
    
    if (isNaN(total) || isNaN(count) || isNaN(startDate.getTime())) {
      return;
    }
    
    const installmentAmount = total / count;
    const newInstallments = [];
    
    for (let i = 0; i < count; i++) {
      const dueDate = new Date(startDate);
      dueDate.setMonth(startDate.getMonth() + i);
      
      newInstallments.push({
        installmentNumber: i + 1,
        amount: installmentAmount,
        dueDate: dueDate.toISOString().split('T')[0],
        status: 'pending'
      });
    }
    
    setInstallments(newInstallments);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    const newPlan = {
      id: currentPlan ? currentPlan.id : Date.now(),
      ...formData,
      installments: installments,
      createdDate: new Date().toISOString(),
      status: 'active'
    };
    
    if (currentPlan) {
      // Update existing plan
      setPlans(plans.map(plan => plan.id === currentPlan.id ? newPlan : plan));
    } else {
      // Add new plan
      setPlans([...plans, newPlan]);
    }
    
    resetForm();
    setShowModal(false);
  };

  const resetForm = () => {
    setFormData({
      studentId: '',
      studentName: '',
      feeType: '',
      totalAmount: '',
      currency: 'USD',
      numberOfInstallments: 3,
      startDate: '',
      notes: '',
    });
    setInstallments([]);
    setCurrentPlan(null);
  };

  const editPlan = (plan) => {
    setCurrentPlan(plan);
    setFormData({
      studentId: plan.studentId,
      studentName: plan.studentName,
      feeType: plan.feeType,
      totalAmount: plan.totalAmount,
      currency: plan.currency,
      numberOfInstallments: plan.installments.length,
      startDate: plan.installments[0].dueDate,
      notes: plan.notes || '',
    });
    setInstallments(plan.installments);
    setShowModal(true);
  };

  const deletePlan = (id) => {
    if (window.confirm(translate('confirm_delete_plan'))) {
      setPlans(plans.filter(plan => plan.id !== id));
    }
  };

  return (
    <div dir={direction} className="bg-white rounded-lg shadow-md p-6">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-semibold text-gray-800">{translate('installment_plans')}</h2>
        <button
          onClick={() => {
            resetForm();
            setShowModal(true);
          }}
          className="bg-indigo-600 text-white px-4 py-2 rounded-md hover:bg-indigo-700 flex items-center"
        >
          <FaPlus className="mr-2" />
          {translate('new_installment_plan')}
        </button>
      </div>
      
      {plans.length === 0 ? (
        <div className="text-center py-8 text-gray-500">
          {translate('no_installment_plans')}
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {plans.map(plan => (
            <div key={plan.id} className="border rounded-lg overflow-hidden hover:shadow-lg transition">
              <div className="bg-indigo-50 p-4 border-b">
                <div className="flex justify-between items-start">
                  <div>
                    <h3 className="font-semibold text-indigo-800 text-lg">{plan.feeType}</h3>
                    <div className="flex items-center text-gray-600 mt-1">
                      <FaUser className="mr-2" />
                      <span>{plan.studentName}</span>
                    </div>
                  </div>
                  <div className="text-xl font-bold text-indigo-600">
                    {plan.currency} {parseFloat(plan.totalAmount).toFixed(2)}
                  </div>
                </div>
              </div>
              
              <div className="p-4">
                <div className="text-sm font-medium text-gray-500 mb-2">
                  {translate('installments')}
                </div>
                
                <div className="space-y-3 mb-4">
                  {plan.installments.map(installment => (
                    <div key={installment.installmentNumber} className="flex justify-between items-center text-sm">
                      <div className="flex items-center">
                        <FaCalendarAlt className="mr-2 text-gray-400" />
                        <span>
                          {installment.installmentNumber}. {new Date(installment.dueDate).toLocaleDateString()}
                        </span>
                      </div>
                      <div className="flex items-center">
                        <span className={`inline-block w-3 h-3 rounded-full mr-2 ${
                          installment.status === 'paid' ? 'bg-green-500' : 
                          installment.status === 'pending' ? 'bg-yellow-500' : 'bg-red-500'
                        }`}></span>
                        <span>{plan.currency} {installment.amount.toFixed(2)}</span>
                      </div>
                    </div>
                  ))}
                </div>
                
                <div className="border-t pt-3 flex justify-end space-x-2">
                  <button
                    onClick={() => editPlan(plan)}
                    className="text-indigo-600 hover:text-indigo-800"
                    title={translate('edit_plan')}
                  >
                    <FaEdit />
                  </button>
                  <button
                    onClick={() => deletePlan(plan.id)}
                    className="text-red-600 hover:text-red-800"
                    title={translate('delete_plan')}
                  >
                    <FaTrash />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
      
      {/* Add/Edit Installation Plan Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
          <div className="relative top-20 mx-auto p-5 border w-11/12 md:w-3/4 lg:w-1/2 shadow-lg rounded-md bg-white">
            <div className="flex justify-between items-center border-b pb-4 mb-4">
              <h3 className="text-xl font-semibold text-gray-900">
                {currentPlan ? translate('edit_installment_plan') : translate('new_installment_plan')}
              </h3>
              <button 
                onClick={() => setShowModal(false)}
                className="text-gray-400 hover:text-gray-500 text-2xl font-bold"
              >
                &times;
              </button>
            </div>
            
            <form onSubmit={handleSubmit}>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    {translate('student_id')}
                  </label>
                  <input
                    type="text"
                    name="studentId"
                    value={formData.studentId}
                    onChange={handleChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                    required
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    {translate('student_name')}
                  </label>
                  <input
                    type="text"
                    name="studentName"
                    value={formData.studentName}
                    onChange={handleChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                    required
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    {translate('fee_type')}
                  </label>
                  <select
                    name="feeType"
                    value={formData.feeType}
                    onChange={handleChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                    required
                  >
                    <option value="">{translate('select_fee_type')}</option>
                    <option value="Tuition Fee">{translate('tuition_fee')}</option>
                    <option value="Bus Fee">{translate('bus_fee')}</option>
                    <option value="Uniform Fee">{translate('uniform_fee')}</option>
                    <option value="Books Fee">{translate('books_fee')}</option>
                    <option value="Activity Fee">{translate('activity_fee')}</option>
                  </select>
                </div>
                
                <div className="flex space-x-2">
                  <div className="w-2/3">
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      {translate('total_amount')}
                    </label>
                    <input
                      type="number"
                      name="totalAmount"
                      value={formData.totalAmount}
                      onChange={handleChange}
                      min="0"
                      step="0.01"
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                      required
                    />
                  </div>
                  
                  <div className="w-1/3">
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      {translate('currency')}
                    </label>
                    <select
                      name="currency"
                      value={formData.currency}
                      onChange={handleChange}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                      required
                    >
                      <option value="USD">USD</option>
                      <option value="EUR">EUR</option>
                      <option value="AED">AED</option>
                      <option value="SAR">SAR</option>
                      <option value="EGP">EGP</option>
                    </select>
                  </div>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    {translate('number_of_installments')}
                  </label>
                  <input
                    type="number"
                    name="numberOfInstallments"
                    value={formData.numberOfInstallments}
                    onChange={handleChange}
                    min="1"
                    max="12"
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                    required
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    {translate('start_date')}
                  </label>
                  <input
                    type="date"
                    name="startDate"
                    value={formData.startDate}
                    onChange={handleChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                    required
                  />
                </div>
                
                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    {translate('notes')}
                  </label>
                  <textarea
                    name="notes"
                    value={formData.notes}
                    onChange={handleChange}
                    rows="2"
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                  ></textarea>
                </div>
              </div>
              
              {/* Installment Schedule Preview */}
              {installments.length > 0 && (
                <div className="mb-4">
                  <h4 className="font-medium text-gray-700 mb-2">
                    {translate('installment_schedule')}
                  </h4>
                  <div className="bg-gray-50 p-3 rounded-md max-h-48 overflow-y-auto">
                    <table className="min-w-full">
                      <thead>
                        <tr>
                          <th className="text-xs font-medium text-gray-500 uppercase tracking-wider text-left pr-4">
                            {translate('installment')}
                          </th>
                          <th className="text-xs font-medium text-gray-500 uppercase tracking-wider text-left pr-4">
                            {translate('due_date')}
                          </th>
                          <th className="text-xs font-medium text-gray-500 uppercase tracking-wider text-right">
                            {translate('amount')}
                          </th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-gray-200">
                        {installments.map(installment => (
                          <tr key={installment.installmentNumber}>
                            <td className="py-2 pr-4">
                              {installment.installmentNumber}
                            </td>
                            <td className="py-2 pr-4">
                              {new Date(installment.dueDate).toLocaleDateString()}
                            </td>
                            <td className="py-2 text-right">
                              {formData.currency} {installment.amount.toFixed(2)}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              )}
              
              <div className="flex justify-end space-x-3 mt-6">
                <button
                  type="button"
                  onClick={() => setShowModal(false)}
                  className="px-4 py-2 bg-gray-200 text-gray-800 rounded-md hover:bg-gray-300"
                >
                  {translate('cancel')}
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700"
                >
                  {translate('save')}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default InstallmentPlan;

import React, { useState } from 'react';
import Layout from '../components/layout/Layout';

const Fees = () => {
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

  return (
    <Layout>
      <div className="flex justify-between mb-6">
        <h2 className="text-2xl font-bold">Fee Management</h2>
        <div className="flex space-x-4">
          <button 
            className="bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded"
          >
            Collect Payment
          </button>
          <button 
            className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
          >
            Create Fee Structure
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
        {/* Fee Structures */}
        <div className="bg-white shadow overflow-hidden sm:rounded-lg">
          <div className="px-4 py-5 sm:px-6 bg-gray-50">
            <h3 className="text-lg leading-6 font-medium text-gray-900">Fee Structures</h3>
          </div>
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Name</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Frequency</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Amount</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Applicable To</th>
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
            <h3 className="text-lg leading-6 font-medium text-gray-900">Recent Transactions</h3>
          </div>
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Student</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Fee Type</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Amount</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
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
          <h3 className="text-lg leading-6 font-medium text-gray-900">Outstanding Dues</h3>
          <button className="text-sm text-blue-600 hover:text-blue-800">Send Bulk Reminders</button>
        </div>
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Student</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Fee Type</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Due Date</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Amount</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            <tr>
              <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">Mohammed Khan</td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">Tuition Fee</td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">2025-04-10</td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">$500</td>
              <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                <button className="text-indigo-600 hover:text-indigo-900 mr-3">
                  Collect
                </button>
                <button className="text-green-600 hover:text-green-900">
                  Send Reminder
                </button>
              </td>
            </tr>
            <tr>
              <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">Layla Mahmoud</td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">Transport Fee</td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">2025-04-15</td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">$300</td>
              <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                <button className="text-indigo-600 hover:text-indigo-900 mr-3">
                  Collect
                </button>
                <button className="text-green-600 hover:text-green-900">
                  Send Reminder
                </button>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </Layout>
  );
};

export default Fees;

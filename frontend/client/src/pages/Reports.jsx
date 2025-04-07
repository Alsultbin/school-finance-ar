import React, { useState } from 'react';
import Layout from '../components/layout/Layout';

const Reports = () => {
  const [activeTab, setActiveTab] = useState('fee');
  
  return (
    <Layout>
      <div className="flex justify-between mb-6">
        <h2 className="text-2xl font-bold">Reports & Analytics</h2>
        <div className="flex space-x-4">
          <button className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded">
            Export to Excel
          </button>
          <button className="bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded">
            Export to PDF
          </button>
        </div>
      </div>
      
      <div className="bg-white shadow rounded-lg overflow-hidden">
        <div className="border-b border-gray-200">
          <nav className="flex -mb-px">
            <button
              className={`py-4 px-6 text-center border-b-2 font-medium text-sm ${
                activeTab === 'fee'
                  ? 'border-indigo-500 text-indigo-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
              onClick={() => setActiveTab('fee')}
            >
              Fee Collection Reports
            </button>
            <button
              className={`py-4 px-6 text-center border-b-2 font-medium text-sm ${
                activeTab === 'outstanding'
                  ? 'border-indigo-500 text-indigo-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
              onClick={() => setActiveTab('outstanding')}
            >
              Outstanding Dues
            </button>
            <button
              className={`py-4 px-6 text-center border-b-2 font-medium text-sm ${
                activeTab === 'salary'
                  ? 'border-indigo-500 text-indigo-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
              onClick={() => setActiveTab('salary')}
            >
              Staff Salary Reports
            </button>
            <button
              className={`py-4 px-6 text-center border-b-2 font-medium text-sm ${
                activeTab === 'custom'
                  ? 'border-indigo-500 text-indigo-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
              onClick={() => setActiveTab('custom')}
            >
              Custom Reports
            </button>
          </nav>
        </div>
        
        <div className="p-6">
          {activeTab === 'fee' && (
            <div>
              <div className="flex mb-4 space-x-4">
                <div className="flex-1">
                  <label className="block text-sm font-medium text-gray-700 mb-1">From Date</label>
                  <input 
                    type="date" 
                    className="shadow-sm focus:ring-indigo-500 focus:border-indigo-500 block w-full sm:text-sm border-gray-300 rounded-md"
                  />
                </div>
                <div className="flex-1">
                  <label className="block text-sm font-medium text-gray-700 mb-1">To Date</label>
                  <input 
                    type="date" 
                    className="shadow-sm focus:ring-indigo-500 focus:border-indigo-500 block w-full sm:text-sm border-gray-300 rounded-md"
                  />
                </div>
                <div className="flex-1">
                  <label className="block text-sm font-medium text-gray-700 mb-1">Fee Type</label>
                  <select 
                    className="shadow-sm focus:ring-indigo-500 focus:border-indigo-500 block w-full sm:text-sm border-gray-300 rounded-md"
                  >
                    <option value="">All Types</option>
                    <option value="tuition">Tuition Fee</option>
                    <option value="transport">Transport Fee</option>
                    <option value="library">Library Fee</option>
                    <option value="sports">Sports Fee</option>
                  </select>
                </div>
                <div className="flex items-end">
                  <button className="bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-2 px-4 rounded">
                    Generate Report
                  </button>
                </div>
              </div>
              
              <div className="bg-white shadow overflow-hidden border-b border-gray-200 sm:rounded-lg mt-4">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Date
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Student
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Fee Type
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Amount
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Payment Method
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Receipt #
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    <tr>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">2025-04-05</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">Ahmed Hassan</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">Tuition Fee</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">$500</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">Cash</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">RC-001234</td>
                    </tr>
                    <tr>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">2025-04-04</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">Fatima Ali</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">Transport Fee</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">$300</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">Bank Transfer</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">RC-001233</td>
                    </tr>
                    <tr>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">2025-04-02</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">Sara Ibrahim</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">Library Fee</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">$150</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">Cash</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">RC-001232</td>
                    </tr>
                  </tbody>
                </table>
              </div>
              
              <div className="mt-5 bg-gray-50 p-4 rounded-lg">
                <h4 className="text-lg font-medium text-gray-900 mb-2">Summary</h4>
                <div className="grid grid-cols-4 gap-4">
                  <div className="bg-white p-3 rounded shadow">
                    <p className="text-sm text-gray-500">Total Collections</p>
                    <p className="text-lg font-semibold">$950</p>
                  </div>
                  <div className="bg-white p-3 rounded shadow">
                    <p className="text-sm text-gray-500">Tuition Fee</p>
                    <p className="text-lg font-semibold">$500</p>
                  </div>
                  <div className="bg-white p-3 rounded shadow">
                    <p className="text-sm text-gray-500">Transport Fee</p>
                    <p className="text-lg font-semibold">$300</p>
                  </div>
                  <div className="bg-white p-3 rounded shadow">
                    <p className="text-sm text-gray-500">Library Fee</p>
                    <p className="text-lg font-semibold">$150</p>
                  </div>
                </div>
              </div>
            </div>
          )}
          
          {activeTab === 'outstanding' && (
            <div>
              <p className="text-gray-500 mb-4">Generate reports on outstanding dues by class, student, or fee type.</p>
              {/* Content for Outstanding Dues tab */}
              <div className="bg-yellow-50 border-l-4 border-yellow-400 p-4 mb-4">
                <div className="flex">
                  <div className="flex-shrink-0">
                    <svg className="h-5 w-5 text-yellow-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                      <path fillRule="evenodd" d="M8.485 3.495c.673-1.167 2.357-1.167 3.03 0l6.28 10.875c.673 1.167-.17 2.625-1.516 2.625H3.72c-1.347 0-2.189-1.458-1.515-2.625L8.485 3.495zM10 6a.75.75 0 01.75.75v3.5a.75.75 0 01-1.5 0v-3.5A.75.75 0 0110 6zm0 9a1 1 0 100-2 1 1 0 000 2z" clipRule="evenodd" />
                    </svg>
                  </div>
                  <div className="ml-3">
                    <p className="text-sm text-yellow-700">
                      There are 15 students with outstanding fees totaling $7,250
                    </p>
                  </div>
                </div>
              </div>
              
              <div className="flex mb-4 space-x-4">
                <div className="flex-1">
                  <label className="block text-sm font-medium text-gray-700 mb-1">Class</label>
                  <select 
                    className="shadow-sm focus:ring-indigo-500 focus:border-indigo-500 block w-full sm:text-sm border-gray-300 rounded-md"
                  >
                    <option value="">All Classes</option>
                    <option value="1">Class 1</option>
                    <option value="2">Class 2</option>
                    <option value="3">Class 3</option>
                  </select>
                </div>
                <div className="flex-1">
                  <label className="block text-sm font-medium text-gray-700 mb-1">Fee Type</label>
                  <select 
                    className="shadow-sm focus:ring-indigo-500 focus:border-indigo-500 block w-full sm:text-sm border-gray-300 rounded-md"
                  >
                    <option value="">All Types</option>
                    <option value="tuition">Tuition Fee</option>
                    <option value="transport">Transport Fee</option>
                    <option value="library">Library Fee</option>
                  </select>
                </div>
                <div className="flex-1">
                  <label className="block text-sm font-medium text-gray-700 mb-1">Due Before</label>
                  <input 
                    type="date" 
                    className="shadow-sm focus:ring-indigo-500 focus:border-indigo-500 block w-full sm:text-sm border-gray-300 rounded-md"
                  />
                </div>
                <div className="flex items-end">
                  <button className="bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-2 px-4 rounded">
                    Generate Report
                  </button>
                </div>
              </div>
            </div>
          )}
          
          {activeTab === 'salary' && (
            <div>
              <p className="text-gray-500 mb-4">Generate reports on staff salary disbursements.</p>
              {/* Content for Staff Salary tab */}
              <div className="flex mb-4 space-x-4">
                <div className="flex-1">
                  <label className="block text-sm font-medium text-gray-700 mb-1">Month</label>
                  <select 
                    className="shadow-sm focus:ring-indigo-500 focus:border-indigo-500 block w-full sm:text-sm border-gray-300 rounded-md"
                  >
                    <option value="4">April</option>
                    <option value="3">March</option>
                    <option value="2">February</option>
                    <option value="1">January</option>
                  </select>
                </div>
                <div className="flex-1">
                  <label className="block text-sm font-medium text-gray-700 mb-1">Year</label>
                  <select 
                    className="shadow-sm focus:ring-indigo-500 focus:border-indigo-500 block w-full sm:text-sm border-gray-300 rounded-md"
                  >
                    <option value="2025">2025</option>
                    <option value="2024">2024</option>
                  </select>
                </div>
                <div className="flex-1">
                  <label className="block text-sm font-medium text-gray-700 mb-1">Department</label>
                  <select 
                    className="shadow-sm focus:ring-indigo-500 focus:border-indigo-500 block w-full sm:text-sm border-gray-300 rounded-md"
                  >
                    <option value="">All Departments</option>
                    <option value="education">Education</option>
                    <option value="admin">Administration</option>
                    <option value="support">Support Staff</option>
                  </select>
                </div>
                <div className="flex items-end">
                  <button className="bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-2 px-4 rounded">
                    Generate Report
                  </button>
                </div>
              </div>
            </div>
          )}
          
          {activeTab === 'custom' && (
            <div>
              <p className="text-gray-500 mb-4">Build custom reports by combining different parameters and data points.</p>
              {/* Content for Custom Reports tab */}
              <div className="bg-indigo-50 border-l-4 border-indigo-400 p-4 mb-4">
                <div className="flex">
                  <div className="flex-shrink-0">
                    <svg className="h-5 w-5 text-indigo-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
                    </svg>
                  </div>
                  <div className="ml-3">
                    <p className="text-sm text-indigo-700">
                      Use the custom report builder to create detailed reports with multiple parameters
                    </p>
                  </div>
                </div>
              </div>
              
              <div className="bg-white shadow overflow-hidden sm:rounded-lg">
                <div className="px-4 py-5 sm:p-6">
                  <h3 className="text-lg leading-6 font-medium text-gray-900">Custom Report Builder</h3>
                  <div className="mt-2 max-w-xl text-sm text-gray-500">
                    <p>Select the parameters and data points to include in your custom report</p>
                  </div>
                  <form className="mt-5 sm:flex sm:items-end">
                    <div className="w-full sm:max-w-xs mr-3">
                      <label htmlFor="report-type" className="block text-sm font-medium text-gray-700">
                        Report Type
                      </label>
                      <select
                        id="report-type"
                        name="report-type"
                        className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm rounded-md"
                      >
                        <option>Financial Summary</option>
                        <option>Student Fee Analysis</option>
                        <option>Class-wise Collection</option>
                        <option>Payment Method Analysis</option>
                      </select>
                    </div>
                    <button
                      type="submit"
                      className="mt-3 w-full inline-flex items-center justify-center px-4 py-2 border border-transparent shadow-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 sm:mt-0 sm:ml-3 sm:w-auto sm:text-sm"
                    >
                      Build Report
                    </button>
                  </form>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </Layout>
  );
};

export default Reports;

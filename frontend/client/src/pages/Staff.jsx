import React, { useState } from 'react';
import Layout from '../components/layout/Layout';

const Staff = () => {
  // Mock data for staff - in a real app this would come from an API
  const [staffList] = useState([
    { id: 1, name: 'Ahmad Ali', position: 'Science Teacher', department: 'Education', salary: 2500, joinDate: '01/03/2022' },
    { id: 2, name: 'Sara Mahmoud', position: 'Math Teacher', department: 'Education', salary: 2300, joinDate: '15/08/2021' },
    { id: 3, name: 'Mohammed Khalid', position: 'Administrator', department: 'Admin', salary: 1800, joinDate: '10/05/2023' },
    { id: 4, name: 'Layla Ibrahim', position: 'Receptionist', department: 'Admin', salary: 1500, joinDate: '22/01/2024' },
  ]);

  const [showModal, setShowModal] = useState(false);
  const [selectedStaff, setSelectedStaff] = useState(null);

  return (
    <Layout>
      <div className="flex justify-between mb-6">
        <h2 className="text-2xl font-bold">Staff Management</h2>
        <button 
          className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
        >
          Add New Staff
        </button>
      </div>

      <div className="bg-white shadow overflow-hidden sm:rounded-lg">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Name
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Position
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Department
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Salary
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Join Date
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {staffList.map((staff) => (
              <tr key={staff.id}>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm font-medium text-gray-900">{staff.name}</div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm text-gray-500">{staff.position}</div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm text-gray-500">{staff.department}</div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm text-gray-500">${staff.salary}</div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm text-gray-500">{staff.joinDate}</div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                  <button
                    onClick={() => {
                      setSelectedStaff(staff);
                      setShowModal(true);
                    }}
                    className="text-indigo-600 hover:text-indigo-900 mr-4"
                  >
                    View Details
                  </button>
                  <button
                    className="text-green-600 hover:text-green-900 mr-4"
                  >
                    Edit
                  </button>
                  <button
                    className="text-red-600 hover:text-red-900"
                  >
                    Generate Payslip
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {showModal && selectedStaff && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
          <div className="relative top-20 mx-auto p-5 border w-96 shadow-lg rounded-md bg-white">
            <div className="mt-3 text-center">
              <h3 className="text-lg leading-6 font-medium text-gray-900">
                Staff Details
              </h3>
              <div className="mt-2 px-7 py-3">
                <div className="text-left">
                  <p className="mb-2"><span className="font-semibold">Name:</span> {selectedStaff.name}</p>
                  <p className="mb-2"><span className="font-semibold">Position:</span> {selectedStaff.position}</p>
                  <p className="mb-2"><span className="font-semibold">Department:</span> {selectedStaff.department}</p>
                  <p className="mb-2"><span className="font-semibold">Salary:</span> ${selectedStaff.salary}</p>
                  <p className="mb-2"><span className="font-semibold">Join Date:</span> {selectedStaff.joinDate}</p>
                </div>
              </div>
              <div className="items-center px-4 py-3">
                <button
                  onClick={() => setShowModal(false)}
                  className="px-4 py-2 bg-gray-500 text-white text-base font-medium rounded-md shadow-sm hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-gray-300"
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </Layout>
  );
};

export default Staff;

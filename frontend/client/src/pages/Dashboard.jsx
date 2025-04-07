import React from 'react';
import Layout from '../components/layout/Layout';

const Dashboard = () => {
  return (
    <Layout>
      <div className="bg-white shadow overflow-hidden sm:rounded-lg p-6">
        <h2 className="text-2xl font-bold mb-4">Dashboard</h2>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
          <div className="bg-blue-100 p-4 rounded-lg shadow">
            <h3 className="text-lg font-semibold text-blue-800">Pending Payments</h3>
            <p className="text-3xl font-bold">12</p>
          </div>
          
          <div className="bg-green-100 p-4 rounded-lg shadow">
            <h3 className="text-lg font-semibold text-green-800">Total Collection</h3>
            <p className="text-3xl font-bold">$15,420</p>
          </div>
          
          <div className="bg-purple-100 p-4 rounded-lg shadow">
            <h3 className="text-lg font-semibold text-purple-800">Active Students</h3>
            <p className="text-3xl font-bold">256</p>
          </div>
        </div>
        
        <div className="bg-white shadow rounded-lg p-4">
          <h3 className="text-lg font-semibold mb-4">Recent Activity</h3>
          <ul className="divide-y divide-gray-200">
            <li className="py-3">
              <p className="text-sm">Ahmed paid $500 for Term 2 fees</p>
              <p className="text-xs text-gray-500">Today at 10:30 AM</p>
            </li>
            <li className="py-3">
              <p className="text-sm">Maria's payment reminder sent</p>
              <p className="text-xs text-gray-500">Yesterday at 3:15 PM</p>
            </li>
            <li className="py-3">
              <p className="text-sm">New student Fatima enrolled</p>
              <p className="text-xs text-gray-500">Apr 5, 2025</p>
            </li>
          </ul>
        </div>
      </div>
    </Layout>
  );
};

export default Dashboard;

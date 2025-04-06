import React, { useState } from 'react';
import { toast } from 'react-toastify';

const BulkMessaging = () => {
  const [messageType, setMessageType] = useState('sms');
  const [message, setMessage] = useState('');
  const [recipients, setRecipients] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSend = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const recipientList = recipients.split('\n').filter(r => r.trim());
      
      const response = await fetch('/api/send-bulk-messages', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          recipients: recipientList,
          message,
          type: messageType
        }),
      });

      const data = await response.json();
      
      if (data.success) {
        toast.success(`Successfully sent ${data.results.length} messages`);
        setMessage('');
        setRecipients('');
      } else {
        toast.error('Failed to send messages: ' + data.error);
      }
    } catch (error) {
      toast.error('Error sending messages: ' + error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto p-6">
      <h2 className="text-2xl font-bold mb-6">Bulk Messaging</h2>
      
      <form onSubmit={handleSend} className="space-y-6">
        <div>
          <label className="block text-sm font-medium text-gray-700">Message Type</label>
          <select
            value={messageType}
            onChange={(e) => setMessageType(e.target.value)}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
          >
            <option value="sms">SMS</option>
            <option value="whatsapp">WhatsApp</option>
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">Message</label>
          <textarea
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            rows={4}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
            placeholder="Enter your message here..."
            required
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">
            Recipients (one per line)
          </label>
          <textarea
            value={recipients}
            onChange={(e) => setRecipients(e.target.value)}
            rows={6}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
            placeholder="Enter phone numbers, one per line..."
            required
          />
        </div>

        <button
          type="submit"
          disabled={loading}
          className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
        >
          {loading ? 'Sending...' : 'Send Messages'}
        </button>
      </form>
    </div>
  );
};

export default BulkMessaging; 
import React, { useState, useContext } from 'react';
import { LanguageContext } from '../../contexts/LanguageContext';

const BulkActions = ({ selectedStudents, onSuccess }) => {
  const { translate } = useContext(LanguageContext);
  const [showModal, setShowModal] = useState(false);
  const [modalType, setModalType] = useState('');
  const [message, setMessage] = useState('');
  const [sending, setSending] = useState(false);
  const [apiResponse, setApiResponse] = useState(null);

  const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5001';

  const handleBulkAction = (type) => {
    setModalType(type);
    setMessage('');
    setShowModal(true);
  };

  const sendBulkMessages = async () => {
    if (!message.trim()) return;
    
    setSending(true);
    setApiResponse(null);
    
    const recipients = selectedStudents.map(student => student.phone);
    
    try {
      const response = await fetch(`${API_URL}/api/notifications/send-bulk`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          type: modalType === 'whatsapp' ? 'whatsapp' : 'sms',
          recipients,
          message
        })
      });
      
      const data = await response.json();
      
      if (response.ok) {
        setApiResponse({
          success: true,
          message: `${translate('message_sent_to')} ${data.sent} ${translate('recipients')}`
        });
        setTimeout(() => {
          setShowModal(false);
          if (onSuccess) onSuccess();
        }, 2000);
      } else {
        throw new Error(data.message || 'Failed to send messages');
      }
    } catch (error) {
      setApiResponse({
        success: false,
        message: error.message
      });
    } finally {
      setSending(false);
    }
  };

  const cancelAction = () => {
    setShowModal(false);
    setMessage('');
    setApiResponse(null);
  };

  return (
    <>
      <div className="flex space-x-2">
        <button
          onClick={() => handleBulkAction('whatsapp')}
          className="bg-green-500 hover:bg-green-600 text-white px-3 py-1 rounded text-sm"
          disabled={selectedStudents.length === 0}
        >
          {translate('bulk_send_whatsapp')}
        </button>
        <button
          onClick={() => handleBulkAction('sms')}
          className="bg-blue-500 hover:bg-blue-600 text-white px-3 py-1 rounded text-sm"
          disabled={selectedStudents.length === 0}
        >
          {translate('bulk_send_sms')}
        </button>
      </div>

      {showModal && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
          <div className="relative top-20 mx-auto p-5 border w-96 shadow-lg rounded-md bg-white">
            <div className="mt-3">
              <h3 className="text-lg font-medium text-gray-900 mb-4 text-center">
                {modalType === 'whatsapp' ? translate('bulk_send_whatsapp') : translate('bulk_send_sms')}
              </h3>
              
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  {translate('message_template')}
                </label>
                <textarea
                  className="shadow-sm focus:ring-indigo-500 focus:border-indigo-500 block w-full sm:text-sm border-gray-300 rounded-md"
                  rows={5}
                  placeholder={translate('enter_message')}
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                />
                <p className="mt-1 text-xs text-gray-500">
                  {translate('sending_to')} {selectedStudents.length} {translate('recipients')}
                </p>
              </div>
              
              {apiResponse && (
                <div className={`p-2 mb-3 rounded ${apiResponse.success ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
                  {apiResponse.message}
                </div>
              )}
              
              <div className="flex justify-end space-x-3">
                <button
                  onClick={cancelAction}
                  className="bg-gray-200 text-gray-800 px-4 py-2 rounded text-sm"
                >
                  {translate('cancel')}
                </button>
                <button
                  onClick={sendBulkMessages}
                  className={`${
                    modalType === 'whatsapp' ? 'bg-green-500 hover:bg-green-600' : 'bg-blue-500 hover:bg-blue-600'
                  } text-white px-4 py-2 rounded text-sm`}
                  disabled={sending || !message.trim()}
                >
                  {sending ? translate('sending') : translate('send')}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default BulkActions;

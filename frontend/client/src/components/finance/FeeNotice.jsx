import React, { useState, useContext, useEffect } from 'react';
import { LanguageContext } from '../../contexts/LanguageContext';
import { FaWhatsapp, FaEnvelope, FaPrint, FaFileDownload, FaCopy, FaBell } from 'react-icons/fa';
import { mockStudents } from '../../utils/mockDataHandler';
import jsPDF from 'jspdf';
import { message, Modal } from 'antd';

const FeeNotice = () => {
  const { translate, direction } = useContext(LanguageContext);
  const [students, setStudents] = useState([]);
  const [selectedStudents, setSelectedStudents] = useState([]);
  const [selectAll, setSelectAll] = useState(false);
  const [filterGrade, setFilterGrade] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [noticeType, setNoticeType] = useState('payment_reminder');
  const [customMessage, setCustomMessage] = useState('');
  const [messagePreview, setMessagePreview] = useState('');
  const [loading, setLoading] = useState(false);

  const noticeTemplates = {
    payment_reminder: translate('payment_reminder_template'),
    fee_due: translate('fee_due_template'),
    overdue_payment: translate('overdue_payment_template'),
    payment_received: translate('payment_received_template'),
    custom: ''
  };

  useEffect(() => {
    // In a real app, this would be an API call
    setStudents(mockStudents);
  }, []);

  useEffect(() => {
    // Select/deselect all students
    if (selectAll) {
      const filteredStudents = filterStudents();
      setSelectedStudents(filteredStudents.map(student => student.id));
    } else {
      setSelectedStudents([]);
    }
  }, [selectAll]);

  useEffect(() => {
    // Generate message preview
    if (noticeType === 'custom') {
      setMessagePreview(customMessage);
    } else {
      setMessagePreview(noticeTemplates[noticeType]);
    }
  }, [noticeType, customMessage]);

  const filterStudents = () => {
    return students.filter(student => {
      const matchesGrade = filterGrade === 'all' || student.grade === filterGrade;
      const matchesSearch = searchTerm === '' || 
        student.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
        student.id.toString().includes(searchTerm);
      
      return matchesGrade && matchesSearch;
    });
  };

  const handleStudentSelect = (studentId) => {
    setSelectedStudents(prevSelected => {
      if (prevSelected.includes(studentId)) {
        return prevSelected.filter(id => id !== studentId);
      } else {
        return [...prevSelected, studentId];
      }
    });
  };

  const handleNoticeTypeChange = (e) => {
    const type = e.target.value;
    setNoticeType(type);
    
    if (type === 'custom') {
      setCustomMessage('');
    }
  };

  const sendNotices = async (method) => {
    if (selectedStudents.length === 0) {
      message.error(translate('select_students_first'));
      return;
    }
    
    try {
      setLoading(true);
      const selected = filteredStudents.filter(student => 
        selectedStudents.includes(student.id)
      );
      
      if (method === 'whatsapp') {
        selected.forEach(student => {
          const message = messagePreview
            .replace('{name}', student.name)
            .replace('{grade}', student.grade);
          
          window.open(
            `https://wa.me/${student.parentPhone}?text=${encodeURIComponent(message)}`,
            '_blank'
          );
        });
      } else if (method === 'email') {
        selected.forEach(student => {
          const message = messagePreview
            .replace('{name}', student.name)
            .replace('{grade}', student.grade);
          
          window.location.href = `mailto:${student.parentEmail}?subject=${encodeURIComponent(translate('fee_notice'))}&body=${encodeURIComponent(message)}`;
        });
      }
      
      message.success(`${translate('sending')} ${selected.length} ${translate('notices_via')} ${method}`);
    } catch (error) {
      message.error(translate('error_sending_notices'));
    } finally {
      setLoading(false);
    }
  };

  const downloadNotices = async () => {
    if (selectedStudents.length === 0) {
      message.error(translate('select_students_first'));
      return;
    }
    
    try {
      setLoading(true);
      const selected = filteredStudents.filter(student => 
        selectedStudents.includes(student.id)
      );
      
      // Create PDF
      const doc = new jsPDF();
      selected.forEach((student, index) => {
        doc.autoTable({
          head: [[translate('student'), translate('grade'), translate('notice')]],
          body: [[
            student.name,
            student.grade,
            messagePreview
              .replace('{name}', student.name)
              .replace('{grade}', student.grade)
          ]],
          startY: doc.lastAutoTable.finalY + 10
        });
      });
      
      doc.save('fee-notices.pdf');
      message.success(translate('notices_downloaded'));
    } catch (error) {
      message.error(translate('error_downloading_notices'));
    } finally {
      setLoading(false);
    }
  };

  const printNotices = () => {
    if (selectedStudents.length === 0) {
      message.error(translate('select_students_first'));
      return;
    }
    
    try {
      const selected = filteredStudents.filter(student => 
        selectedStudents.includes(student.id)
      );
      
      const printWindow = window.open('', '_blank');
      printWindow.document.write(`
        <html>
          <head>
            <title>${translate('fee_notices')}</title>
            <style>
              @media print {
                body { font-family: Arial, sans-serif; }
                .student-notice { page-break-after: always; }
              }
            </style>
          </head>
          <body>
            ${selected.map(student => `
              <div class="student-notice">
                <h2>${translate('fee_notice')}</h2>
                <p><strong>${translate('student')}: </strong>${student.name}</p>
                <p><strong>${translate('grade')}: </strong>${student.grade}</p>
                <p>${messagePreview
                  .replace('{name}', student.name)
                  .replace('{grade}', student.grade)
                }</p>
              </div>
            `).join('')}
          </body>
        </html>
      `);
      
      printWindow.document.close();
      printWindow.print();
      message.success(translate('printing_notices'));
    } catch (error) {
      message.error(translate('error_printing_notices'));
    }
  };

  const copyMessageToClipboard = () => {
    navigator.clipboard.writeText(messagePreview)
      .then(() => {
        message.success(translate('message_copied'));
      })
      .catch(err => {
        console.error('Failed to copy text: ', err);
      });
  };

  const filteredStudents = filterStudents();

  return (
    <div dir={direction} className="bg-white rounded-lg shadow-md p-6">
      <h2 className="text-2xl font-semibold text-gray-800 mb-6">{translate('fee_notices')}</h2>
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left column - Student selection */}
        <div className="lg:col-span-2 border rounded-lg p-4">
          <h3 className="text-lg font-medium text-gray-700 mb-4">{translate('select_recipients')}</h3>
          
          <div className="flex flex-col sm:flex-row justify-between mb-4 space-y-2 sm:space-y-0">
            <div className="relative">
              <input
                type="text"
                placeholder={translate('search_students')}
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="px-3 py-2 border border-gray-300 rounded-md w-full sm:w-64 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
              />
              <span className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M8 4a4 4 0 100 8 4 4 0 000-8zM2 8a6 6 0 1110.89 3.476l4.817 4.817a1 1 0 01-1.414 1.414l-4.816-4.816A6 6 0 012 8z" clipRule="evenodd" />
                </svg>
              </span>
            </div>
            
            <div className="flex items-center space-x-2">
              <label className="text-sm text-gray-600">{translate('grade')}:</label>
              <select
                value={filterGrade}
                onChange={(e) => setFilterGrade(e.target.value)}
                className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
              >
                <option value="all">{translate('all_grades')}</option>
                <option value="1">{translate('grade')} 1</option>
                <option value="2">{translate('grade')} 2</option>
                <option value="3">{translate('grade')} 3</option>
                <option value="4">{translate('grade')} 4</option>
                <option value="5">{translate('grade')} 5</option>
                <option value="6">{translate('grade')} 6</option>
                <option value="7">{translate('grade')} 7</option>
                <option value="8">{translate('grade')} 8</option>
                <option value="9">{translate('grade')} 9</option>
                <option value="10">{translate('grade')} 10</option>
                <option value="11">{translate('grade')} 11</option>
                <option value="12">{translate('grade')} 12</option>
              </select>
            </div>
          </div>
          
          <div className="mb-4 flex items-center">
            <input
              type="checkbox"
              id="selectAll"
              checked={selectAll}
              onChange={() => setSelectAll(!selectAll)}
              className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
            />
            <label htmlFor="selectAll" className="ml-2 block text-sm text-gray-900">
              {translate('select_all')} ({filteredStudents.length})
            </label>
            <span className="ml-auto text-sm text-gray-500">
              {selectedStudents.length} {translate('selected')}
            </span>
          </div>
          
          <div className="overflow-y-auto max-h-96 border rounded-md">
            {filteredStudents.length > 0 ? (
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th scope="col" className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      {translate('select')}
                    </th>
                    <th scope="col" className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      {translate('student')}
                    </th>
                    <th scope="col" className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      {translate('grade')}
                    </th>
                    <th scope="col" className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      {translate('contact')}
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {filteredStudents.map(student => (
                    <tr key={student.id} className="hover:bg-gray-50">
                      <td className="px-4 py-2 whitespace-nowrap">
                        <input
                          type="checkbox"
                          checked={selectedStudents.includes(student.id)}
                          onChange={() => handleStudentSelect(student.id)}
                          className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
                        />
                      </td>
                      <td className="px-4 py-2 whitespace-nowrap">
                        <div className="flex items-center">
                          <div className="ml-2">
                            <div className="text-sm font-medium text-gray-900">{student.name}</div>
                            <div className="text-xs text-gray-500">ID: {student.id}</div>
                          </div>
                        </div>
                      </td>
                      <td className="px-4 py-2 whitespace-nowrap">
                        <div className="text-sm text-gray-900">{translate('grade')} {student.grade}</div>
                        <div className="text-xs text-gray-500">{student.section}</div>
                      </td>
                      <td className="px-4 py-2 whitespace-nowrap text-sm text-gray-500">
                        {student.parentPhone && (
                          <div>
                            <FaWhatsapp className="inline text-green-500 mr-1" />
                            {student.parentPhone}
                          </div>
                        )}
                        {student.parentEmail && (
                          <div>
                            <FaEnvelope className="inline text-blue-500 mr-1" />
                            {student.parentEmail}
                          </div>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            ) : (
              <div className="text-center py-6 text-gray-500">
                {translate('no_students_found')}
              </div>
            )}
          </div>
        </div>
        
        {/* Right column - Message configuration */}
        <div className="border rounded-lg p-4">
          <h3 className="text-lg font-medium text-gray-700 mb-4">{translate('notice_message')}</h3>
          
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                {translate('notice_type')}
              </label>
              <select
                value={noticeType}
                onChange={handleNoticeTypeChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
              >
                <option value="payment_reminder">{translate('payment_reminder')}</option>
                <option value="fee_due">{translate('fee_due')}</option>
                <option value="overdue_payment">{translate('overdue_payment')}</option>
                <option value="payment_received">{translate('payment_received')}</option>
                <option value="custom">{translate('custom_message')}</option>
              </select>
            </div>
            
            {noticeType === 'custom' && (
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  {translate('custom_message')}
                </label>
                <textarea
                  value={customMessage}
                  onChange={(e) => setCustomMessage(e.target.value)}
                  rows="5"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                  placeholder={translate('enter_custom_message')}
                ></textarea>
              </div>
            )}
            
            <div>
              <div className="flex justify-between items-center mb-1">
                <label className="block text-sm font-medium text-gray-700">
                  {translate('preview')}
                </label>
                <button
                  onClick={copyMessageToClipboard}
                  className="text-indigo-600 hover:text-indigo-800 text-sm flex items-center"
                >
                  <FaCopy className="mr-1" />
                  {translate('copy')}
                </button>
              </div>
              <div className="bg-gray-50 p-3 rounded-md border text-sm text-gray-700 h-32 overflow-y-auto">
                {messagePreview}
              </div>
            </div>
            
            <div className="pt-4 border-t">
              <h4 className="text-sm font-medium text-gray-700 mb-3">{translate('send_via')}</h4>
              <div className="flex space-x-2">
                <button
                  onClick={() => sendNotices('whatsapp')}
                  className="flex-1 bg-green-600 hover:bg-green-700 text-white py-2 px-4 rounded-md flex justify-center items-center"
                  disabled={selectedStudents.length === 0 || loading}
                >
                  <FaWhatsapp className="mr-2" />
                  WhatsApp
                </button>
                <button
                  onClick={() => sendNotices('email')}
                  className="flex-1 bg-blue-600 hover:bg-blue-700 text-white py-2 px-4 rounded-md flex justify-center items-center"
                  disabled={selectedStudents.length === 0 || loading}
                >
                  <FaEnvelope className="mr-2" />
                  {translate('email')}
                </button>
              </div>
            </div>
            
            <div className="flex space-x-2 pt-2">
              <button
                onClick={printNotices}
                className="flex-1 border border-gray-300 hover:bg-gray-50 text-gray-700 py-2 px-4 rounded-md flex justify-center items-center"
                disabled={selectedStudents.length === 0 || loading}
              >
                <FaPrint className="mr-2" />
                {translate('print')}
              </button>
              <button
                onClick={downloadNotices}
                className="flex-1 border border-gray-300 hover:bg-gray-50 text-gray-700 py-2 px-4 rounded-md flex justify-center items-center"
                disabled={selectedStudents.length === 0 || loading}
              >
                <FaFileDownload className="mr-2" />
                {translate('download')}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default FeeNotice;

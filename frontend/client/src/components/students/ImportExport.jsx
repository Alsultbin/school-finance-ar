import React, { useState, useContext } from 'react';
import { LanguageContext } from '../../contexts/LanguageContext';

const ImportExport = ({ onImportSuccess }) => {
  const { translate } = useContext(LanguageContext);
  const [file, setFile] = useState(null);
  const [exportFormat, setExportFormat] = useState('csv');
  const [loading, setLoading] = useState(false);
  const [notification, setNotification] = useState({ type: '', message: '' });

  const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5001';

  const handleFileChange = (e) => {
    setFile(e.target.files[0]);
  };

  const handleImport = async () => {
    if (!file) return;

    const formData = new FormData();
    formData.append('file', file);

    setLoading(true);
    setNotification({ type: '', message: '' });

    try {
      const response = await fetch(`${API_URL}/api/import/students`, {
        method: 'POST',
        body: formData
      });

      if (response.ok) {
        const data = await response.json();
        setNotification({
          type: 'success',
          message: `${translate('successfully_imported')} ${data.count} ${translate('students')}`
        });
        if (onImportSuccess) onImportSuccess();
        setFile(null);
        // Reset the file input
        document.getElementById('fileInput').value = '';
      } else {
        throw new Error('Import failed');
      }
    } catch (error) {
      setNotification({
        type: 'error',
        message: translate('failed_to_import')
      });
    } finally {
      setLoading(false);
    }
  };

  const handleExport = async () => {
    setLoading(true);
    setNotification({ type: '', message: '' });

    try {
      const response = await fetch(`${API_URL}/api/export/students?format=${exportFormat}`);
      
      if (response.ok) {
        // Convert the response to a blob
        const blob = await response.blob();
        // Create a URL for the blob
        const url = window.URL.createObjectURL(blob);
        // Create a temporary anchor element
        const a = document.createElement('a');
        a.href = url;
        a.download = `students_export.${exportFormat}`;
        document.body.appendChild(a);
        a.click();
        window.URL.revokeObjectURL(url);
        document.body.removeChild(a);
        
        setNotification({
          type: 'success',
          message: translate('export_successful')
        });
      } else {
        throw new Error('Export failed');
      }
    } catch (error) {
      setNotification({
        type: 'error',
        message: translate('failed_to_export')
      });
    } finally {
      setLoading(false);
    }
  };

  const downloadTemplate = () => {
    window.open(`${API_URL}/api/templates/students-import.csv`, '_blank');
  };

  return (
    <div className="flex flex-col md:flex-row md:space-x-6 space-y-4 md:space-y-0">
      <div className="border p-4 rounded-md bg-white shadow-sm flex-1">
        <h3 className="text-lg font-medium mb-3">{translate('import_students')}</h3>
        
        {notification.message && (
          <div className={`mb-3 p-2 rounded text-sm ${notification.type === 'error' ? 'bg-red-100 text-red-700' : 'bg-green-100 text-green-700'}`}>
            {notification.message}
          </div>
        )}
        
        <div className="mb-3">
          <label className="block text-sm font-medium text-gray-700 mb-1">
            {translate('select_file')} (CSV)
          </label>
          <input
            id="fileInput"
            type="file"
            accept=".csv"
            onChange={handleFileChange}
            className="block w-full text-sm text-gray-500
                      file:mr-4 file:py-2 file:px-4
                      file:rounded file:border-0
                      file:text-sm file:font-semibold
                      file:bg-indigo-50 file:text-indigo-700
                      hover:file:bg-indigo-100"
          />
        </div>
        
        <div className="flex space-x-2 mt-4">
          <button
            type="button"
            onClick={downloadTemplate}
            className="inline-flex items-center px-3 py-2 border border-gray-300 shadow-sm text-sm leading-4 font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
          >
            {translate('download_template')}
          </button>
          <button
            type="button"
            onClick={handleImport}
            disabled={!file || loading}
            className={`inline-flex items-center px-3 py-2 border border-transparent text-sm leading-4 font-medium rounded-md text-white ${!file || loading ? 'bg-indigo-300' : 'bg-indigo-600 hover:bg-indigo-700'} focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500`}
          >
            {loading ? translate('importing') : translate('import')}
          </button>
        </div>
      </div>

      <div className="border p-4 rounded-md bg-white shadow-sm flex-1">
        <h3 className="text-lg font-medium mb-3">{translate('export_students')}</h3>
        
        <div className="mb-3">
          <label className="block text-sm font-medium text-gray-700 mb-1">
            {translate('export_format')}
          </label>
          <select
            value={exportFormat}
            onChange={(e) => setExportFormat(e.target.value)}
            className="block w-full pl-3 pr-10 py-2 text-sm border-gray-300 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm rounded-md"
          >
            <option value="csv">CSV</option>
            <option value="xlsx">Excel</option>
            <option value="pdf">PDF</option>
          </select>
        </div>
        
        <button
          type="button"
          onClick={handleExport}
          disabled={loading}
          className={`inline-flex items-center px-3 py-2 border border-transparent text-sm leading-4 font-medium rounded-md text-white ${loading ? 'bg-indigo-300' : 'bg-indigo-600 hover:bg-indigo-700'} focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500`}
        >
          {loading ? translate('exporting') : translate('export')}
        </button>
      </div>
    </div>
  );
};

export default ImportExport;

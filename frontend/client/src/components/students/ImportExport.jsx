import React, { useState } from 'react';
import { Button, Modal, message, Upload, notification } from 'antd';
import { DownloadOutlined, UploadOutlined } from '@ant-design/icons';
import { mockDataHandler } from '../../utils/mockDataHandler';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';

const ImportExport = ({ onImportSuccess }) => {
  const { t } = useTranslation();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [file, setFile] = useState(null);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleImport = async () => {
    try {
      setLoading(true);
      
      if (!file) {
        throw new Error(t('please_select_file'));
      }

      const fileExtension = file.name.split('.').pop().toLowerCase();
      
      let result;
      if (fileExtension === 'csv') {
        result = await mockDataHandler.parseCSVImport(file);
      } else if (fileExtension === 'xlsx' || fileExtension === 'xls') {
        result = await mockDataHandler.parseExcelImport(file);
      } else {
        throw new Error(t('invalid_file_format'));
      }

      if (!result.success) {
        throw new Error(result.message);
      }

      if (result.count === 0) {
        throw new Error(t('no_students_found'));
      }

      onImportSuccess(result);
      notification.success({
        message: t('success'),
        description: `${result.count} ${t('students_imported_successfully')}`,
        duration: 3
      });
      
      setFile(null);
      setIsModalOpen(false);
    } catch (error) {
      console.error('Import error:', error);
      notification.error({
        message: t('error'),
        description: error.message || t('failed_to_import_students'),
        duration: 3
      });
    } finally {
      setLoading(false);
    }
  };

  const handleExport = async (type) => {
    try {
      setLoading(true);
      
      if (type === 'csv') {
        await mockDataHandler.exportToCSV();
      } else if (type === 'excel') {
        await mockDataHandler.exportToExcel();
      } else if (type === 'pdf') {
        await mockDataHandler.exportToPDF();
      }

      notification.success({
        message: t('success'),
        description: t('export_completed_successfully'),
        duration: 3
      });
    } catch (error) {
      console.error('Export error:', error);
      notification.error({
        message: t('error'),
        description: error.message || t('failed_to_export'),
        duration: 3
      });
    } finally {
      setLoading(false);
    }
  };

  const handleDownloadTemplate = () => {
    mockDataHandler.getImportTemplate();
  };

  return (
    <div className="import-export-container">
      <Button 
        type="primary" 
        icon={<UploadOutlined />} 
        onClick={() => setIsModalOpen(true)}
      >
        {t('import_students')}
      </Button>

      <Modal
        title={t('import_students')}
        open={isModalOpen}
        onCancel={() => setIsModalOpen(false)}
        footer={null}
      >
        <div className="import-modal-content">
          <p>{t('select_file_to_import')}</p>
          <Upload
            beforeUpload={(file) => {
              setFile(file);
              return false;
            }}
            showUploadList={false}
          >
            <Button icon={<UploadOutlined />}>
              {t('choose_file')}
            </Button>
          </Upload>
          <Button 
            type="primary" 
            onClick={handleImport} 
            loading={loading}
            disabled={!file}
            style={{ marginTop: '16px' }}
          >
            {t('import')}
          </Button>
          <Button 
            type="default" 
            onClick={handleDownloadTemplate}
            style={{ marginTop: '16px' }}
          >
            {t('download_template')}
          </Button>
        </div>
      </Modal>

      <div className="export-buttons">
        <Button 
          type="primary" 
          icon={<DownloadOutlined />} 
          onClick={() => handleExport('csv')}
        >
          {t('export_csv')}
        </Button>
        <Button 
          type="primary" 
          icon={<DownloadOutlined />} 
          onClick={() => handleExport('excel')}
        >
          {t('export_excel')}
        </Button>
        <Button 
          type="primary" 
          icon={<DownloadOutlined />} 
          onClick={() => handleExport('pdf')}
        >
          {t('export_pdf')}
        </Button>
      </div>
    </div>
  );
};

export default ImportExport;

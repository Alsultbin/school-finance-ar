// Mock data handler for import/export functionality
import { saveAs } from 'file-saver';
import * as XLSX from 'xlsx';
import { jsPDF } from 'jspdf';
import 'jspdf-autotable';

// Sample student data
const sampleStudents = [
  { 
    _id: '1', 
    name: 'Ahmed Ali', 
    grade: '10', 
    section: 'A', 
    admissionNumber: 'A001', 
    gender: 'Male', 
    parent: 'Mohammed Ali', 
    contact: '+971 50 123 4567', 
    fees: 'Paid',
    email: 'mohammed.ali@example.com',
    address: 'Dubai, UAE'
  },
  { 
    _id: '2', 
    name: 'Fatima Hassan', 
    grade: '9', 
    section: 'B', 
    admissionNumber: 'B002', 
    gender: 'Female', 
    parent: 'Hassan Khan', 
    contact: '+971 55 234 5678', 
    fees: 'Pending',
    email: 'hassan.khan@example.com',
    address: 'Abu Dhabi, UAE'
  }
];

// Flexible column mapping for imports
const defaultColumns = {
  name: ['name', 'student name', 'student_name'],
  grade: ['grade', 'class', 'student_grade'],
  section: ['section', 'student_section'],
  admissionNumber: ['admission number', 'student_id', 'id', 'admission_number'],
  gender: ['gender', 'sex'],
  parent: ['parent', 'parent_name', 'guardian'],
  contact: ['contact', 'phone', 'parent_phone', 'contact_number'],
  email: ['email', 'parent_email'],
  address: ['address', 'parent_address'],
  fees: ['fees', 'fee_status', 'payment_status']
};

// Export functions
const exportToCSV = (students = sampleStudents) => {
  const headers = ['ID', 'Name', 'Grade', 'Section', 'Admission Number', 'Gender', 'Parent Name', 'Contact', 'Email', 'Address', 'Fees Status'];
  const csvRows = [headers.join(',')];
  
  students.forEach(student => {
    const values = headers.map(header => student[header.toLowerCase().replace(' ', '_')] || '');
    csvRows.push(values.join(','));
  });
  
  const csvString = csvRows.join('\n');
  const blob = new Blob([csvString], { type: 'text/csv;charset=utf-8' });
  saveAs(blob, 'students_export.csv');
  return { success: true, message: 'Export successful' };
};

const exportToExcel = (students = sampleStudents) => {
  const worksheet = XLSX.utils.json_to_sheet(students);
  const workbook = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(workbook, worksheet, 'Students');
  XLSX.writeFile(workbook, 'students_export.xlsx');
  return { success: true, message: 'Export successful' };
};

const exportToPDF = (students = sampleStudents) => {
  const doc = new jsPDF();
  doc.autoTable({
    head: [['ID', 'Name', 'Grade', 'Section', 'Admission Number', 'Gender', 'Parent Name', 'Contact', 'Email', 'Address', 'Fees Status']],
    body: students.map(student => [
      student._id,
      student.name,
      student.grade,
      student.section,
      student.admissionNumber,
      student.gender,
      student.parent,
      student.contact,
      student.email,
      student.address,
      student.fees
    ])
  });
  doc.save('students_export.pdf');
  return { success: true, message: 'Export successful' };
};

const getImportTemplate = () => {
  const headers = ['Name', 'Grade', 'Section', 'Admission Number', 'Gender', 'Parent Name', 'Contact Number', 'Email', 'Address', 'Fees Status'];
  const csvRows = [headers.join(',')];
  const csvString = csvRows.join('\n');
  const blob = new Blob([csvString], { type: 'text/csv;charset=utf-8' });
  saveAs(blob, 'students_import_template.csv');
  return { success: true, message: 'Template downloaded' };
};

const parseCSVImport = (file) => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = (event) => {
      const content = event.target.result;
      const rows = content.split('\n');
      const headers = rows[0].split(',').map(h => h.trim().toLowerCase());
      
      // Map headers to our standard format
      const headerMap = {};
      headers.forEach(header => {
        Object.entries(defaultColumns).forEach(([key, aliases]) => {
          if (aliases.some(alias => alias.toLowerCase() === header)) {
            headerMap[header] = key;
          }
        });
      });
      
      // Process student data
      const students = rows.slice(1).map(row => {
        const values = row.split(',').map(v => v.trim());
        const student = {};
        
        values.forEach((value, index) => {
          const header = headers[index];
          const mappedKey = headerMap[header];
          if (mappedKey && value) {
            student[mappedKey] = value;
          }
        });

        // Add defaults if missing
        student._id = (Date.now() + Math.random()).toString();
        student.fees = student.fees || 'Pending';
        
        return student;
      }).filter(student => student.name); // Only keep students with names
      
      resolve({
        success: true,
        count: students.length,
        data: students,
        message: `Successfully imported ${students.length} students`
      });
    };
    
    reader.onerror = (error) => {
      reject({
        success: false,
        message: 'Error reading file: ' + error.message
      });
    };
    
    reader.readAsText(file);
  });
};

const parseExcelImport = (file) => {
  return new Promise((resolve, reject) => {
    XLSX.readFile(file, { type: 'binary' }, (err, workbook) => {
      if (err) {
        return reject({
          success: false,
          message: 'Error reading Excel file: ' + err.message
        });
      }
      
      const worksheet = workbook.Sheets[workbook.SheetNames[0]];
      const data = XLSX.utils.sheet_to_json(worksheet);
      
      // Map headers to our standard format
      const headerMap = {};
      Object.keys(data[0]).forEach(header => {
        Object.entries(defaultColumns).forEach(([key, aliases]) => {
          if (aliases.some(alias => alias.toLowerCase() === header.toLowerCase())) {
            headerMap[header] = key;
          }
        });
      });
      
      // Process student data
      const students = data.map(row => {
        const student = {};
        Object.entries(row).forEach(([key, value]) => {
          const mappedKey = headerMap[key];
          if (mappedKey && value) {
            student[mappedKey] = value;
          }
        });

        // Add defaults if missing
        student._id = (Date.now() + Math.random()).toString();
        student.fees = student.fees || 'Pending';
        
        return student;
      }).filter(student => student.name); // Only keep students with names
      
      resolve({
        success: true,
        count: students.length,
        data: students,
        message: `Successfully imported ${students.length} students`
      });
    });
  });
};

// Export all functions
export {
  exportToCSV,
  exportToExcel,
  exportToPDF,
  getImportTemplate,
  parseCSVImport,
  parseExcelImport
};

// Default export for backward compatibility
const mockDataHandler = {
  exportToCSV,
  exportToExcel,
  exportToPDF,
  getImportTemplate,
  parseCSVImport,
  parseExcelImport
};

export default mockDataHandler;

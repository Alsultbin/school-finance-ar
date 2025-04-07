// Mock data handler for import/export functionality
import { saveAs } from 'file-saver';
import * as XLSX from 'xlsx';
import { jsPDF } from 'jspdf';
import 'jspdf-autotable';

// Sample student data
const sampleStudents = [
  { id: 1, name: 'Ahmed Ali', grade: '10th', section: 'A', admissionNumber: 'A001', gender: 'Male', parent: 'Mohammed Ali', contact: '+971 50 123 4567', fees: 'Paid' },
  { id: 2, name: 'Fatima Hassan', grade: '9th', section: 'B', admissionNumber: 'B002', gender: 'Female', parent: 'Hassan Khan', contact: '+971 55 234 5678', fees: 'Pending' },
  { id: 3, name: 'Omar Farooq', grade: '11th', section: 'A', admissionNumber: 'C003', gender: 'Male', parent: 'Farooq Ahmed', contact: '+971 52 345 6789', fees: 'Paid' },
  { id: 4, name: 'Aisha Rahman', grade: '10th', section: 'C', admissionNumber: 'D004', gender: 'Female', parent: 'Rahman Shah', contact: '+971 54 456 7890', fees: 'Partial' },
  { id: 5, name: 'Yousuf Khan', grade: '8th', section: 'B', admissionNumber: 'E005', gender: 'Male', parent: 'Khan Abdul', contact: '+971 56 567 8901', fees: 'Paid' },
];

// Parse CSV file
export const parseCSVImport = (file) => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    
    reader.onload = (event) => {
      try {
        const content = event.target.result;
        const lines = content.split('\\n');
        const headers = lines[0].split(',').map(header => header.trim());
        
        const students = [];
        
        for (let i = 1; i < lines.length; i++) {
          if (lines[i].trim() === '') continue;
          
          const values = lines[i].split(',').map(value => value.trim());
          const student = {};
          
          headers.forEach((header, index) => {
            student[header.toLowerCase()] = values[index];
          });
          
          students.push(student);
        }
        
        resolve({ success: true, data: students, count: students.length });
      } catch (error) {
        reject({ success: false, error: 'Failed to parse CSV file' });
      }
    };
    
    reader.onerror = () => {
      reject({ success: false, error: 'Failed to read file' });
    };
    
    reader.readAsText(file);
  });
};

// Parse Excel file
export const parseExcelImport = (file) => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    
    reader.onload = (event) => {
      try {
        const data = new Uint8Array(event.target.result);
        const workbook = XLSX.read(data, { type: 'array' });
        const firstSheetName = workbook.SheetNames[0];
        const worksheet = workbook.Sheets[firstSheetName];
        const students = XLSX.utils.sheet_to_json(worksheet);
        
        resolve({ success: true, data: students, count: students.length });
      } catch (error) {
        reject({ success: false, error: 'Failed to parse Excel file' });
      }
    };
    
    reader.onerror = () => {
      reject({ success: false, error: 'Failed to read file' });
    };
    
    reader.readAsArrayBuffer(file);
  });
};

// Export students to CSV
export const exportToCSV = (students = sampleStudents) => {
  const headers = ['Name', 'Grade', 'Section', 'Admission Number', 'Gender', 'Parent', 'Contact', 'Fees'];
  const csvRows = [];
  
  // Add headers
  csvRows.push(headers.join(','));
  
  // Add data rows
  students.forEach(student => {
    const values = [
      student.name,
      student.grade,
      student.section,
      student.admissionNumber,
      student.gender,
      student.parent,
      student.contact,
      student.fees
    ];
    csvRows.push(values.join(','));
  });
  
  const csvString = csvRows.join('\\n');
  const blob = new Blob([csvString], { type: 'text/csv;charset=utf-8' });
  saveAs(blob, 'students_export.csv');
  
  return Promise.resolve({ success: true });
};

// Export students to Excel
export const exportToExcel = (students = sampleStudents) => {
  const worksheet = XLSX.utils.json_to_sheet(students);
  const workbook = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(workbook, worksheet, 'Students');
  
  const excelBuffer = XLSX.write(workbook, { bookType: 'xlsx', type: 'array' });
  const blob = new Blob([excelBuffer], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
  saveAs(blob, 'students_export.xlsx');
  
  return Promise.resolve({ success: true });
};

// Export students to PDF
export const exportToPDF = (students = sampleStudents) => {
  const doc = new jsPDF();
  
  doc.setFontSize(18);
  doc.text('Student Data', 14, 22);
  
  const tableColumn = ['Name', 'Grade', 'Section', 'Admission #', 'Gender', 'Parent', 'Contact', 'Fees'];
  const tableRows = [];
  
  students.forEach(student => {
    const studentData = [
      student.name,
      student.grade,
      student.section,
      student.admissionNumber,
      student.gender,
      student.parent,
      student.contact,
      student.fees
    ];
    tableRows.push(studentData);
  });
  
  doc.autoTable({
    head: [tableColumn],
    body: tableRows,
    startY: 30,
    theme: 'grid',
    styles: {
      fontSize: 8,
      cellPadding: 2,
      overflow: 'linebreak'
    },
    headStyles: {
      fillColor: [63, 81, 181],
      textColor: 255,
      fontSize: 9,
      fontStyle: 'bold'
    }
  });
  
  doc.save('students_export.pdf');
  
  return Promise.resolve({ success: true });
};

// Get template data
export const getImportTemplate = () => {
  const headers = ['Name', 'Grade', 'Section', 'Admission Number', 'Gender', 'Parent Name', 'Contact Number', 'Email', 'Address', 'Fees Status'];
  const csvRows = [headers.join(',')];
  const csvString = csvRows.join('\\n');
  const blob = new Blob([csvString], { type: 'text/csv;charset=utf-8' });
  saveAs(blob, 'students_import_template.csv');
};

// Export based on format
export const exportStudents = (format, students = sampleStudents) => {
  switch (format) {
    case 'csv':
      return exportToCSV(students);
    case 'xlsx':
      return exportToExcel(students);
    case 'pdf':
      return exportToPDF(students);
    default:
      return Promise.reject({ success: false, error: 'Unsupported format' });
  }
};

// Import students from file
export const importStudents = (file) => {
  const fileType = file.name.split('.').pop().toLowerCase();
  
  switch (fileType) {
    case 'csv':
      return parseCSVImport(file);
    case 'xlsx':
    case 'xls':
      return parseExcelImport(file);
    default:
      return Promise.reject({ success: false, error: 'Unsupported file format' });
  }
};

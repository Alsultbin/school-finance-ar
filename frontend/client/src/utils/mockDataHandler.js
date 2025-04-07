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

// Mock students for use in the fee notices and other components
export const mockStudents = [
  { id: 1, name: 'Ahmed Ali', grade: '10', section: 'A', parentPhone: '+971 50 123 4567', parentEmail: 'mohammed.ali@example.com' },
  { id: 2, name: 'Fatima Hassan', grade: '9', section: 'B', parentPhone: '+971 55 234 5678', parentEmail: 'hassan.khan@example.com' },
  { id: 3, name: 'Omar Farooq', grade: '11', section: 'A', parentPhone: '+971 52 345 6789', parentEmail: 'farooq.ahmed@example.com' },
  { id: 4, name: 'Aisha Rahman', grade: '10', section: 'C', parentPhone: '+971 54 456 7890', parentEmail: 'rahman.shah@example.com' },
  { id: 5, name: 'Yousuf Khan', grade: '8', section: 'B', parentPhone: '+971 56 567 8901', parentEmail: 'khan.abdul@example.com' },
  { id: 6, name: 'Sara Mohammad', grade: '7', section: 'A', parentPhone: '+971 58 678 9012', parentEmail: 'mohammad.ali@example.com' },
  { id: 7, name: 'Hamza Kareem', grade: '12', section: 'B', parentPhone: '+971 50 789 0123', parentEmail: 'kareem.ahmed@example.com' },
  { id: 8, name: 'Layla Saeed', grade: '11', section: 'C', parentPhone: '+971 55 890 1234', parentEmail: 'saeed.ibrahim@example.com' },
  { id: 9, name: 'Mustafa Hakim', grade: '9', section: 'A', parentPhone: '+971 52 901 2345', parentEmail: 'hakim.mustafa@example.com' },
  { id: 10, name: 'Noura Qasim', grade: '10', section: 'B', parentPhone: '+971 54 012 3456', parentEmail: 'qasim.ahmed@example.com' },
  { id: 11, name: 'Tariq Anwar', grade: '8', section: 'C', parentPhone: '+971 56 123 4567', parentEmail: 'anwar.tariq@example.com' },
  { id: 12, name: 'Zainab Khalid', grade: '7', section: 'A', parentPhone: '+971 58 234 5678', parentEmail: 'khalid.zain@example.com' }
];

// Mock installment plans
export const mockInstallmentPlans = [
  {
    id: 1,
    studentId: '001',
    studentName: 'Ahmed Ali',
    feeType: 'Tuition Fee',
    totalAmount: '12000',
    currency: 'AED',
    createdDate: '2023-09-01T10:00:00Z',
    status: 'active',
    notes: 'First installment due on registration',
    installments: [
      { installmentNumber: 1, amount: 4000, dueDate: '2023-09-01', status: 'paid' },
      { installmentNumber: 2, amount: 4000, dueDate: '2023-12-01', status: 'pending' },
      { installmentNumber: 3, amount: 4000, dueDate: '2024-03-01', status: 'pending' }
    ]
  },
  {
    id: 2,
    studentId: '002',
    studentName: 'Fatima Hassan',
    feeType: 'Bus Fee',
    totalAmount: '4500',
    currency: 'AED',
    createdDate: '2023-08-15T14:30:00Z',
    status: 'active',
    notes: 'Bus route: Downtown',
    installments: [
      { installmentNumber: 1, amount: 1500, dueDate: '2023-09-01', status: 'paid' },
      { installmentNumber: 2, amount: 1500, dueDate: '2023-12-01', status: 'paid' },
      { installmentNumber: 3, amount: 1500, dueDate: '2024-03-01', status: 'pending' }
    ]
  },
  {
    id: 3,
    studentId: '003',
    studentName: 'Omar Farooq',
    feeType: 'Activity Fee',
    totalAmount: '2000',
    currency: 'AED',
    createdDate: '2023-09-05T09:15:00Z',
    status: 'active',
    notes: 'Football and chess club activities',
    installments: [
      { installmentNumber: 1, amount: 1000, dueDate: '2023-09-10', status: 'paid' },
      { installmentNumber: 2, amount: 1000, dueDate: '2024-01-10', status: 'pending' }
    ]
  },
  {
    id: 4,
    studentId: '004',
    studentName: 'Aisha Rahman',
    feeType: 'Tuition Fee',
    totalAmount: '15000',
    currency: 'AED',
    createdDate: '2023-08-20T11:45:00Z',
    status: 'active',
    notes: 'Scholarship recipient - 10% discount applied',
    installments: [
      { installmentNumber: 1, amount: 5000, dueDate: '2023-09-01', status: 'paid' },
      { installmentNumber: 2, amount: 5000, dueDate: '2023-12-01', status: 'paid' },
      { installmentNumber: 3, amount: 5000, dueDate: '2024-03-01', status: 'pending' }
    ]
  }
];

// Mock financial data for dashboard
export const mockFinancialData = {
  totalCollected: 267500,
  totalPending: 124300,
  totalOverdue: 45200,
  collectionRate: 78.5,
  
  // Monthly collection data for charts
  monthlyCollection: [
    { month: 'Jan', collected: 24500, pending: 3500 },
    { month: 'Feb', collected: 22800, pending: 4200 },
    { month: 'Mar', collected: 25600, pending: 3100 },
    { month: 'Apr', collected: 23400, pending: 5600 },
    { month: 'May', collected: 18700, pending: 8900 },
    { month: 'Jun', collected: 19500, pending: 7500 },
    { month: 'Jul', collected: 12300, pending: 15800 },
    { month: 'Aug', collected: 28600, pending: 9700 },
    { month: 'Sep', collected: 31400, pending: 6200 },
    { month: 'Oct', collected: 29800, pending: 7900 },
    { month: 'Nov', collected: 26700, pending: 12400 },
    { month: 'Dec', collected: 24200, pending: 15200 }
  ],
  
  // Fee type breakdown
  feeTypeBreakdown: [
    { type: 'Tuition', amount: 198000, percentage: 65 },
    { type: 'Transportation', amount: 45600, percentage: 15 },
    { type: 'Books & Supplies', amount: 30400, percentage: 10 },
    { type: 'Activities', amount: 15200, percentage: 5 },
    { type: 'Uniform', amount: 9100, percentage: 3 },
    { type: 'Others', amount: 6100, percentage: 2 }
  ],
  
  // Recent transactions
  recentTransactions: [
    { id: 1, student: 'Ahmed Ali', amount: 4000, type: 'Tuition Fee', date: '2023-10-15', status: 'Paid' },
    { id: 2, student: 'Fatima Hassan', amount: 1500, type: 'Bus Fee', date: '2023-10-14', status: 'Paid' },
    { id: 3, student: 'Omar Farooq', amount: 1000, type: 'Activity Fee', date: '2023-10-12', status: 'Paid' },
    { id: 4, student: 'Aisha Rahman', amount: 5000, type: 'Tuition Fee', date: '2023-10-10', status: 'Paid' },
    { id: 5, student: 'Yousuf Khan', amount: 2500, type: 'Books Fee', date: '2023-10-08', status: 'Paid' },
    { id: 6, student: 'Sara Mohammad', amount: 3500, type: 'Tuition Fee', date: '2023-10-05', status: 'Overdue' }
  ],
  
  // Grade-wise fee collection
  gradeCollection: [
    { grade: 'Grade 1', collected: 18500, pending: 4500 },
    { grade: 'Grade 2', collected: 17800, pending: 5200 },
    { grade: 'Grade 3', collected: 19200, pending: 3800 },
    { grade: 'Grade 4', collected: 22500, pending: 6500 },
    { grade: 'Grade 5', collected: 21800, pending: 7200 },
    { grade: 'Grade 6', collected: 23400, pending: 5600 },
    { grade: 'Grade 7', collected: 24800, pending: 4200 },
    { grade: 'Grade 8', collected: 26500, pending: 3500 },
    { grade: 'Grade 9', collected: 28200, pending: 2800 },
    { grade: 'Grade 10', collected: 30800, pending: 4200 },
    { grade: 'Grade 11', collected: 32500, pending: 5500 },
    { grade: 'Grade 12', collected: 33600, pending: 6400 }
  ]
};

// Parse CSV file
const parseCSVImport = (file) => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = (event) => {
      const content = event.target.result;
      const rows = content.split('\n');
      const headers = rows[0].split(',');
      const students = rows.slice(1).map(row => {
        const values = row.split(',');
        return headers.reduce((acc, header, index) => {
          acc[header.trim()] = values[index]?.trim() || '';
          return acc;
        }, {});
      }).filter(student => student.name);
      
      resolve({
        count: students.length,
        data: students
      });
    };
    reader.onerror = (error) => reject({ error: 'Error reading file' });
    reader.readAsText(file);
  });
};

// Parse Excel file
const parseExcelImport = (file) => {
  return new Promise((resolve, reject) => {
    XLSX.readFile(file, { type: 'binary' }, (err, workbook) => {
      if (err) return reject({ error: 'Error reading Excel file' });
      
      const worksheet = workbook.Sheets[workbook.SheetNames[0]];
      const data = XLSX.utils.sheet_to_json(worksheet);
      
      resolve({
        count: data.length,
        data: data
      });
    });
  });
};

// Import students
const importStudents = async (file) => {
  try {
    if (!file) {
      throw new Error('No file selected');
    }

    const fileType = file.name.split('.').pop().toLowerCase();
    
    if (fileType === 'csv') {
      return await parseCSVImport(file);
    } else if (['xlsx', 'xls'].includes(fileType)) {
      return await parseExcelImport(file);
    } else {
      throw new Error('Unsupported file format');
    }
  } catch (error) {
    throw error;
  }
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
  
  const csvString = csvRows.join('\n');
  const blob = new Blob([csvString], { type: 'text/csv;charset=utf-8' });
  saveAs(blob, 'students_export.csv');
  
  return Promise.resolve({ success: true });
};

// Export students to Excel
export const exportToExcel = (students = sampleStudents) => {
  const ws = XLSX.utils.json_to_sheet(students);
  const wb = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(wb, ws, "Students");
  XLSX.writeFile(wb, "students-data.xlsx");
};

// Export students to PDF
export const exportToPDF = (students = sampleStudents) => {
  const doc = new jsPDF();
  const headers = [['ID', 'Name', 'Grade', 'Section', 'Admission #', 'Gender', 'Parent', 'Contact', 'Fees']];
  const data = students.map(student => [
    student.id,
    student.name,
    student.grade,
    student.section,
    student.admissionNumber,
    student.gender,
    student.parent,
    student.contact,
    student.fees
  ]);
  
  doc.autoTable({
    head: headers,
    body: data,
    startY: 20,
    headStyles: { fillColor: [0, 128, 255], textColor: 255 },
    styles: { fontSize: 9 }
  });
  
  doc.save('students-data.pdf');
};

// Get template data
export const getImportTemplate = () => {
  const headers = ['Name', 'Grade', 'Section', 'Admission Number', 'Gender', 'Parent Name', 'Contact Number', 'Email', 'Address', 'Fees Status'];
  const csvRows = [headers.join(',')];
  const csvString = csvRows.join('\n');
  const blob = new Blob([csvString], { type: 'text/csv;charset=utf-8' });
  saveAs(blob, 'students_import_template.csv');
};

// Export students
export const exportStudents = (format, students = sampleStudents) => {
  try {
    if (format === 'excel') {
      exportToExcel(students);
      return { success: true, count: students.length };
    } else if (format === 'pdf') {
      exportToPDF(students);
      return { success: true, count: students.length };
    } else {
      return { success: false, error: 'Unsupported export format' };
    }
  } catch (error) {
    return { success: false, error: error.message || 'Error exporting students' };
  }
};

// Export all functions
export {
  parseCSVImport,
  parseExcelImport,
  exportToCSV,
  exportToExcel,
  exportToPDF,
  getImportTemplate,
  importStudents,
  exportStudents
};

// Default export for backward compatibility
const mockDataHandler = {
  parseCSVImport,
  parseExcelImport,
  exportToCSV,
  exportToExcel,
  exportToPDF,
  getImportTemplate,
  importStudents,
  exportStudents
};

export default mockDataHandler;

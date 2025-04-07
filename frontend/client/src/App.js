import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './contexts/AuthContext';
import { LanguageProvider } from './contexts/LanguageContext';
import { TranslationProvider } from './contexts/TranslationContext';
import Login from './pages/Login';
import Signup from './pages/Signup';
import Dashboard from './pages/Dashboard';
import Students from './pages/Students';
import Staff from './pages/Staff';
import Fees from './pages/Fees';
import Reports from './pages/Reports';
import Settings from './pages/Settings';
import PrivateRoute from './components/auth/PrivateRoute';
import Navbar from './components/layout/Navbar';
import Footer from './components/layout/Footer';

function App() {
  return (
    <AuthProvider>
      <LanguageProvider>
        <TranslationProvider>
          <Router>
            <div className="min-h-screen flex flex-col">
              <Navbar />
              
              <main className="flex-grow">
                <Routes>
                  <Route path="/login" element={<Login />} />
                  <Route path="/signup" element={<Signup />} />
                  
                  <Route
                    path="/"
                    element={
                      <PrivateRoute>
                        <Dashboard />
                      </PrivateRoute>
                    }
                  />
                  
                  <Route
                    path="/students"
                    element={
                      <PrivateRoute>
                        <Students />
                      </PrivateRoute>
                    }
                  />
                  
                  <Route
                    path="/staff"
                    element={
                      <PrivateRoute>
                        <Staff />
                      </PrivateRoute>
                    }
                  />
                  
                  <Route
                    path="/fees"
                    element={
                      <PrivateRoute>
                        <Fees />
                      </PrivateRoute>
                    }
                  />
                  
                  <Route
                    path="/reports"
                    element={
                      <PrivateRoute>
                        <Reports />
                      </PrivateRoute>
                    }
                  />
                  
                  <Route
                    path="/settings"
                    element={
                      <PrivateRoute>
                        <Settings />
                      </PrivateRoute>
                    }
                  />
                </Routes>
              </main>
              
              <Footer />
            </div>
          </Router>
        </TranslationProvider>
      </LanguageProvider>
    </AuthProvider>
  );
}

export default App;

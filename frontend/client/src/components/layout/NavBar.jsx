import React, { useContext } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { LanguageContext } from '../../contexts/LanguageContext';
import LanguageSwitcher from '../common/LanguageSwitcher';

const NavBar = () => {
  const location = useLocation();
  const { translate, direction } = useContext(LanguageContext);
  
  // Navigation items
  const navItems = [
    { name: translate('dashboard'), path: '/' },
    { name: translate('students'), path: '/students' },
    { name: translate('staff'), path: '/staff' },
    { name: translate('fees'), path: '/fees' },
    { name: translate('reports'), path: '/reports' },
    { name: translate('settings'), path: '/settings' },
  ];

  return (
    <nav className="bg-white shadow-lg" dir={direction}>
      <div className="max-w-7xl mx-auto px-4">
        <div className="flex justify-between h-16">
          <div className="flex">
            <div className="flex-shrink-0 flex items-center">
              <h1 className="text-xl font-bold">{translate('school_finance_system')}</h1>
            </div>
            <div className="hidden md:ml-6 md:flex md:space-x-8">
              {navItems.map((item) => (
                <Link
                  key={item.path}
                  to={item.path}
                  className={`inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium ${
                    location.pathname === item.path
                      ? 'border-indigo-500 text-gray-900'
                      : 'border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700'
                  }`}
                >
                  {item.name}
                </Link>
              ))}
            </div>
          </div>
          <div className="flex items-center">
            <LanguageSwitcher />
          </div>
        </div>
      </div>
    </nav>
  );
};

export default NavBar;

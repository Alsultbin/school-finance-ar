import React, { useContext, useState } from 'react';
import { Link } from 'react-router-dom';
import { LanguageContext } from '../../contexts/LanguageContext';
import { useAuth } from '../../contexts/AuthContext';
import { FaBars, FaTimes, FaUser, FaGlobe, FaSignOutAlt, FaCog } from 'react-icons/fa';

const NavBar = ({ toggleMobileSidebar }) => {
  const { language, changeLanguage, translate, direction } = useContext(LanguageContext);
  const { currentUser, logout } = useAuth();
  const [showProfileMenu, setShowProfileMenu] = useState(false);
  const [showLanguageMenu, setShowLanguageMenu] = useState(false);

  const handleLogout = () => {
    logout();
  };

  const toggleProfileMenu = () => {
    setShowProfileMenu(!showProfileMenu);
    if (showLanguageMenu) setShowLanguageMenu(false);
  };

  const toggleLanguageMenu = () => {
    setShowLanguageMenu(!showLanguageMenu);
    if (showProfileMenu) setShowProfileMenu(false);
  };

  return (
    <nav className="bg-gradient-to-r from-indigo-700 to-purple-700 shadow-md" dir={direction}>
      <div className="max-w-full mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex items-center">
            <button
              onClick={toggleMobileSidebar}
              className="p-2 rounded-md text-white hover:bg-indigo-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
            >
              <FaBars className="h-6 w-6" aria-hidden="true" />
              <span className="sr-only">{translate('open_menu')}</span>
            </button>
            <div className="flex-shrink-0 flex items-center ms-4">
              <span className="text-white text-xl font-bold">{translate('school_finance_system')}</span>
            </div>
          </div>

          <div className="flex items-center">
            {/* Language Selector */}
            <div className="relative ml-3">
              <div>
                <button
                  onClick={toggleLanguageMenu}
                  className="p-2 rounded-md text-white hover:bg-indigo-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 flex items-center"
                >
                  <FaGlobe className="h-5 w-5" />
                  <span className="ml-1">{language.toUpperCase()}</span>
                </button>
              </div>
              {showLanguageMenu && (
                <div className="origin-top-right absolute right-0 mt-2 w-48 rounded-md shadow-lg py-1 bg-white ring-1 ring-black ring-opacity-5 z-50">
                  <button
                    onClick={() => {
                      changeLanguage('en');
                      setShowLanguageMenu(false);
                    }}
                    className={`block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 w-full text-left ${
                      language === 'en' ? 'bg-gray-100' : ''
                    }`}
                  >
                    English
                  </button>
                  <button
                    onClick={() => {
                      changeLanguage('ar');
                      setShowLanguageMenu(false);
                    }}
                    className={`block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 w-full text-left ${
                      language === 'ar' ? 'bg-gray-100' : ''
                    }`}
                  >
                    العربية
                  </button>
                </div>
              )}
            </div>

            {/* Profile dropdown */}
            <div className="relative ml-3">
              <div>
                <button
                  onClick={toggleProfileMenu}
                  className="p-2 rounded-full text-white hover:bg-indigo-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 flex items-center"
                >
                  <FaUser className="h-5 w-5" />
                  {currentUser && (
                    <span className="ml-2 hidden md:inline">{currentUser.name}</span>
                  )}
                </button>
              </div>
              {showProfileMenu && (
                <div className="origin-top-right absolute right-0 mt-2 w-48 rounded-md shadow-lg py-1 bg-white ring-1 ring-black ring-opacity-5 z-50">
                  <Link
                    to="/settings"
                    className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                    onClick={() => setShowProfileMenu(false)}
                  >
                    <FaCog className="inline mr-2" />
                    {translate('settings')}
                  </Link>
                  <button
                    onClick={handleLogout}
                    className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 hover:text-red-600"
                  >
                    <FaSignOutAlt className="inline mr-2" />
                    {translate('logout')}
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default NavBar;

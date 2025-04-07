import React, { createContext, useState, useEffect } from 'react';
import arTranslations from '../translations/ar';
import enTranslations from '../translations/en';
import frTranslations from '../translations/fr';
import urTranslations from '../translations/ur';

export const LanguageContext = createContext();

const translations = {
  ar: arTranslations,
  en: enTranslations,
  fr: frTranslations,
  ur: urTranslations
};

export const LanguageProvider = ({ children }) => {
  // Get from localStorage or default to Arabic
  const [language, setLanguage] = useState(localStorage.getItem('language') || 'ar');
  const [direction, setDirection] = useState('rtl');

  const translate = (key) => {
    if (!translations[language] || !translations[language][key]) {
      // Fallback to English if translation is missing
      return translations.en[key] || key;
    }
    return translations[language][key];
  };

  useEffect(() => {
    localStorage.setItem('language', language);
    // Set direction based on language
    setDirection(language === 'ar' || language === 'ur' ? 'rtl' : 'ltr');
    // Set HTML dir attribute
    document.documentElement.dir = language === 'ar' || language === 'ur' ? 'rtl' : 'ltr';
    // Set HTML lang attribute
    document.documentElement.lang = language;
  }, [language]);

  return (
    <LanguageContext.Provider value={{ language, setLanguage, translate, direction }}>
      {children}
    </LanguageContext.Provider>
  );
};

export default LanguageProvider;

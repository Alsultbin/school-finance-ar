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

const defaultLanguage = 'ar'; // Default to Arabic

export const LanguageProvider = ({ children }) => {
  const [language, setLanguage] = useState(() => {
    // Get from localStorage or fallback to default
    const savedLang = localStorage.getItem('language');
    return savedLang && translations[savedLang] ? savedLang : defaultLanguage;
  });

  const [direction, setDirection] = useState(() => {
    // Set initial direction based on default language
    return defaultLanguage === 'ar' || defaultLanguage === 'ur' ? 'rtl' : 'ltr';
  });

  const translate = (key) => {
    try {
      if (!translations[language]) {
        console.error(`Translation for language ${language} not found`);
        return key;
      }
      
      const translation = translations[language][key];
      if (!translation) {
        console.warn(`Translation key ${key} not found in ${language}, falling back to English`);
        return translations.en[key] || key;
      }
      return translation;
    } catch (error) {
      console.error(`Error in translation: ${error.message}`);
      return key;
    }
  };

  useEffect(() => {
    try {
      // Update localStorage
      localStorage.setItem('language', language);
      
      // Update document direction
      const newDirection = language === 'ar' || language === 'ur' ? 'rtl' : 'ltr';
      setDirection(newDirection);
      document.documentElement.dir = newDirection;
      
      // Update document language
      document.documentElement.lang = language;
      
      // Update HTML elements with dir attribute
      document.querySelectorAll('[data-dir]').forEach(el => {
        el.dir = newDirection;
      });
      
      // Update all text content
      const elements = document.querySelectorAll('[data-translate]');
      elements.forEach(el => {
        const key = el.getAttribute('data-translate');
        if (key) {
          el.textContent = translate(key);
        }
      });
    } catch (error) {
      console.error('Error updating language:', error);
    }
  }, [language]);

  return (
    <LanguageContext.Provider value={{ 
      language, 
      setLanguage, 
      translate, 
      direction,
      languages: Object.keys(translations)
    }}>
      {children}
    </LanguageContext.Provider>
  );
};

export default LanguageProvider;

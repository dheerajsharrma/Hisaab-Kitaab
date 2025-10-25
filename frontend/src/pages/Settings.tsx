import React, { useState } from 'react';
import { motion } from 'framer-motion';
import {
  Moon,
  Sun,
  Bell,
  Database,
  Download,
  Trash2,
  Settings as SettingsIcon,
  Palette,
  Globe,
  ChevronDown
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';
import toast from 'react-hot-toast';
import CustomSelect from '../components/ui/CustomSelect';

const Settings: React.FC = () => {
  const { user, logout } = useAuth();
  const { darkMode, toggleDarkMode } = useTheme();
  const [languageDropdownOpen, setLanguageDropdownOpen] = useState(false);

  // Settings state
  const [settings, setSettings] = useState({
    notifications: true,
    emailNotifications: true,
    darkMode: darkMode,
    autoSave: true,
    dataSync: true,
    language: 'en',
    currency: 'USD',
    dateFormat: 'MM/DD/YYYY'
  });


  // Handle settings change
  const handleSettingChange = (key: string, value: any) => {
    setSettings(prev => ({ ...prev, [key]: value }));
    
    // Handle special cases
    if (key === 'darkMode' && value !== darkMode) {
      toggleDarkMode();
    }
    
    toast.success(`${key.charAt(0).toUpperCase() + key.slice(1)} updated`);
  };

  // Export data
  const handleExportData = () => {
    const data = {
      user: user,
      settings: settings,
      exportDate: new Date().toISOString()
    };
    
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'hisaab-kitaab-data.json';
    a.click();
    URL.revokeObjectURL(url);
    
    toast.success('Data exported successfully!');
  };

  // Clear data
  const handleClearData = () => {
    if (window.confirm('Are you sure you want to clear all data? This cannot be undone.')) {
      localStorage.clear();
      toast.success('All data cleared');
      logout();
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-dark-900 pb-8">
      <div className="max-w-4xl mx-auto p-4 sm:p-6 space-y-6">
        {/* Header */}
        <div className="flex items-center space-x-3 mb-6">
          <div className="p-3 gradient-teal-green text-white rounded-xl">
            <SettingsIcon className="w-6 h-6" />
          </div>
          <div>
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Settings</h1>
            <p className="text-gray-600 dark:text-gray-400">Manage your app preferences</p>
          </div>
        </div>

      {/* App Preferences */}
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="bg-white dark:bg-dark-800 rounded-xl shadow-sm p-6"
      >
        <h2 className="text-xl font-semibold text-gray-900 dark:text-white flex items-center mb-6">
          <Palette className="w-5 h-5 mr-2" />
          Appearance & Preferences
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Dark Mode Toggle */}
          <div className="flex items-center justify-between p-4 border border-gray-200 dark:border-gray-600 rounded-lg">
            <div className="flex items-center space-x-3">
              {darkMode ? <Moon className="w-5 h-5" /> : <Sun className="w-5 h-5" />}
              <div>
                <p className="font-medium text-gray-900 dark:text-white">Dark Mode</p>
                <p className="text-sm text-gray-600 dark:text-gray-400">Toggle dark theme</p>
              </div>
            </div>
            <button
              onClick={() => handleSettingChange('darkMode', !darkMode)}
              className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                darkMode ? 'bg-primary-600' : 'bg-gray-200'
              }`}
            >
              <span
                className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                  darkMode ? 'translate-x-6' : 'translate-x-1'
                }`}
              />
            </button>
          </div>

          {/* Notifications */}
          <div className="flex items-center justify-between p-4 border border-gray-200 dark:border-gray-600 rounded-lg">
            <div className="flex items-center space-x-3">
              <Bell className="w-5 h-5" />
              <div>
                <p className="font-medium text-gray-900 dark:text-white">Notifications</p>
                <p className="text-sm text-gray-600 dark:text-gray-400">Enable notifications</p>
              </div>
            </div>
            <button
              onClick={() => handleSettingChange('notifications', !settings.notifications)}
              className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                settings.notifications ? 'bg-primary-600' : 'bg-gray-200'
              }`}
            >
              <span
                className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                  settings.notifications ? 'translate-x-6' : 'translate-x-1'
                }`}
              />
            </button>
          </div>

          {/* Auto Save */}
          <div className="flex items-center justify-between p-4 border border-gray-200 dark:border-gray-600 rounded-lg">
            <div className="flex items-center space-x-3">
              <Database className="w-5 h-5" />
              <div>
                <p className="font-medium text-gray-900 dark:text-white">Auto Save</p>
                <p className="text-sm text-gray-600 dark:text-gray-400">Automatically save changes</p>
              </div>
            </div>
            <button
              onClick={() => handleSettingChange('autoSave', !settings.autoSave)}
              className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                settings.autoSave ? 'bg-primary-600' : 'bg-gray-200'
              }`}
            >
              <span
                className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                  settings.autoSave ? 'translate-x-6' : 'translate-x-1'
                }`}
              />
            </button>
          </div>

          {/* Language */}
          <div className="p-4 border border-gray-200 dark:border-gray-600 rounded-lg">
            <div className="flex items-center space-x-3 mb-3">
              <Globe className="w-5 h-5" />
              <div>
                <p className="font-medium text-gray-900 dark:text-white">Language</p>
                <p className="text-sm text-gray-600 dark:text-gray-400">Select your language</p>
              </div>
            </div>
            <div className="relative">
              <button
                onClick={() => setLanguageDropdownOpen(!languageDropdownOpen)}
                className="w-full flex items-center justify-between px-4 py-2.5 bg-white dark:bg-dark-800 border-2 border-gray-200 dark:border-gray-600 rounded-lg hover:border-primary-500 dark:hover:border-primary-500 transition-all duration-200"
              >
                <span className="flex items-center gap-2 font-medium text-sm text-gray-900 dark:text-white">
                  {settings.language === 'en' ? '🇺🇸 English' :
                   settings.language === 'es' ? '🇪🇸 Spanish' :
                   settings.language === 'fr' ? '🇫🇷 French' : '🇩🇪 German'}
                </span>
                <ChevronDown className={`w-3.5 h-3.5 text-gray-500 transition-transform duration-200 ${
                  languageDropdownOpen ? 'rotate-180' : ''
                }`} />
              </button>

              {languageDropdownOpen && (
                <>
                  <div 
                    className="fixed inset-0 z-10" 
                    onClick={() => setLanguageDropdownOpen(false)}
                  />
                  <motion.div
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    className="absolute left-0 right-0 mt-1.5 bg-white dark:bg-dark-800 rounded-lg shadow-xl border border-gray-200 dark:border-gray-600 overflow-hidden z-20"
                  >
                    {[
                      { value: 'en', label: 'English', icon: '🇺🇸' },
                      { value: 'es', label: 'Spanish', icon: '🇪🇸' },
                      { value: 'fr', label: 'French', icon: '🇫🇷' },
                      { value: 'de', label: 'German', icon: '🇩🇪' }
                    ].map((option) => (
                      <button
                        key={option.value}
                        onClick={() => {
                          handleSettingChange('language', option.value);
                          setLanguageDropdownOpen(false);
                        }}
                        className={`w-full px-3 py-2 text-left flex items-center space-x-2 transition-all duration-150 text-sm ${
                          settings.language === option.value
                            ? 'bg-primary-50 dark:bg-primary-900/20 text-primary-600 dark:text-primary-400 font-semibold'
                            : 'text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-dark-700'
                        }`}
                      >
                        <span className="text-base">{option.icon}</span>
                        <span>{option.label}</span>
                        {settings.language === option.value && (
                          <span className="ml-auto text-primary-600 dark:text-primary-400 text-sm">✓</span>
                        )}
                      </button>
                    ))}
                  </motion.div>
                </>
              )}
            </div>
          </div>
        </div>
      </motion.div>


      {/* Data Management */}
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
        className="bg-white dark:bg-dark-800 rounded-xl shadow-sm p-6"
      >
        <h2 className="text-xl font-semibold text-gray-900 dark:text-white flex items-center mb-6">
          <Database className="w-5 h-5 mr-2" />
          Data Management
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <button
            onClick={handleExportData}
            className="flex items-center justify-center space-x-2 p-4 border border-gray-200 dark:border-gray-600 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
          >
            <Download className="w-5 h-5 text-primary-600" />
            <span className="font-medium">Export Data</span>
          </button>

          <button
            onClick={handleClearData}
            className="flex items-center justify-center space-x-2 p-4 border border-red-200 dark:border-red-800 rounded-lg hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors text-red-600 dark:text-red-400"
          >
            <Trash2 className="w-5 h-5" />
            <span className="font-medium">Clear All Data</span>
          </button>
        </div>
      </motion.div>
      </div>
    </div>
  );
};

export default Settings;
import React, { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  LayoutDashboard,
  Receipt,
  Settings,
  LogOut,
  Moon,
  Sun,
  Menu,
  X,
  DollarSign,
  User
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';

interface LayoutProps {
  children: React.ReactNode;
}

const Layout: React.FC<LayoutProps> = ({ children }) => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const { user, logout } = useAuth();
  const { darkMode, toggleDarkMode } = useTheme();
  const location = useLocation();
  const navigate = useNavigate();

  const navigation = [
    { name: 'Dashboard', href: '/dashboard', icon: LayoutDashboard },
    { name: 'Transactions', href: '/transactions', icon: Receipt },
    { name: 'Settings', href: '/settings', icon: Settings },
    { name: 'Profile', href: '/profile', icon: User },
  ];

  const bottomNavigation = [
    { name: 'Dashboard', href: '/dashboard', icon: LayoutDashboard },
    { name: 'Transactions', href: '/transactions', icon: Receipt },
    { name: 'Settings', href: '/settings', icon: Settings },
    { name: 'Profile', href: '/profile', icon: User },
  ];

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-dark-900 flex">
      {/* Mobile sidebar backdrop */}
      {sidebarOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-40 bg-black bg-opacity-50 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Sidebar - Desktop only */}
      <div className="hidden lg:flex lg:flex-col lg:fixed lg:inset-y-0 lg:w-64 bg-white dark:bg-dark-800 shadow-lg z-40">
        <div className="flex items-center h-16 px-6 border-b border-gray-200 dark:border-dark-600 flex-shrink-0">
          <div className="flex items-center space-x-3">
            <div className="p-2 gradient-teal-green text-white rounded-xl">
              <DollarSign className="w-6 h-6" />
            </div>
            <span className="text-xl font-bold text-gray-900 dark:text-white">
              Hisaab Kitaab
            </span>
          </div>
        </div>

        <nav className="flex-1 overflow-y-auto mt-6 px-3">
          {navigation.map((item) => {
            const Icon = item.icon;
            const isActive = location.pathname === item.href;
            return (
              <Link
                key={item.name}
                to={item.href}
                className={`group flex items-center px-3 py-3 text-sm font-medium rounded-lg mb-1 transition-colors duration-200 ${
                  isActive
                    ? 'bg-primary-100 dark:bg-primary-900/20 text-primary-700 dark:text-primary-400'
                    : 'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-dark-700'
                }`}
                onClick={() => setSidebarOpen(false)}
              >
                <Icon className="mr-3 w-5 h-5" />
                {item.name}
              </Link>
            );
          })}
        </nav>

        {/* User section */}
        <div className="flex-shrink-0 p-4 border-t border-gray-200 dark:border-dark-600">
          <div className="flex items-center justify-between mb-3">
            <Link 
              to="/profile"
              className="flex items-center space-x-3 flex-1 p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-dark-700 transition-colors"
              onClick={() => setSidebarOpen(false)}
            >
              {user?.avatar ? (
                <img
                  src={user.avatar}
                  alt="Profile"
                  className="w-8 h-8 rounded-full object-cover"
                />
              ) : (
                <div className="w-8 h-8 bg-primary-600 rounded-full flex items-center justify-center text-white text-sm font-medium">
                  {user?.name.charAt(0).toUpperCase()}
                </div>
              )}
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-gray-900 dark:text-white truncate">
                  {user?.name}
                </p>
                <p className="text-xs text-gray-500 dark:text-gray-400 truncate">
                  {user?.email}
                </p>
              </div>
            </Link>
          </div>
          
          <div className="flex items-center justify-between">
            <button
              onClick={toggleDarkMode}
              className="p-2 rounded-lg text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200 hover:bg-gray-100 dark:hover:bg-dark-700 transition-colors"
            >
              {darkMode ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
            </button>
            
            <button
              onClick={handleLogout}
              className="flex items-center space-x-2 px-3 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-dark-700 rounded-lg transition-colors"
            >
              <LogOut className="w-4 h-4" />
              <span>Logout</span>
            </button>
          </div>
        </div>
      </div>

      {/* Main content */}
      <div className="flex-1 lg:ml-64">
        {/* Top bar - Mobile/Tablet only */}
        <div className="bg-white dark:bg-dark-800 shadow-sm border-b border-gray-200 dark:border-dark-600 lg:hidden sticky top-0 z-30">
          <div className="flex items-center justify-between h-16 px-4">
            <div className="flex items-center space-x-3">
              <div className="p-2 gradient-teal-green text-white rounded-xl">
                <DollarSign className="w-5 h-5" />
              </div>
              <span className="text-lg font-bold text-gray-900 dark:text-white">
                Hisaab Kitaab
              </span>
            </div>
            <div className="flex items-center gap-2">
              <button
                onClick={toggleDarkMode}
                className="p-2 rounded-lg text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
              >
                {darkMode ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
              </button>
            </div>
          </div>
        </div>

        {/* Page content */}
        <main className="flex-1 pb-24 lg:pb-0">
          {children}
        </main>

        {/* Floating Bottom Navigation - Mobile/Tablet only */}
        <motion.div
          initial={{ y: 100, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.3 }}
          className="lg:hidden fixed bottom-6 left-4 right-4 z-50"
        >
          <div className="gradient-teal-green rounded-full shadow-2xl shadow-success-500/30 backdrop-blur-lg">
            <div className="flex items-center justify-around px-6 py-4">
              {bottomNavigation.map((item) => {
                const Icon = item.icon;
                const isActive = location.pathname === item.href;
                return (
                  <Link
                    key={item.name}
                    to={item.href}
                    className={`flex flex-col items-center gap-1 transition-all duration-200 ${
                      isActive 
                        ? 'text-white scale-110' 
                        : 'text-white/60 hover:text-white/90'
                    }`}
                  >
                    <Icon className={`w-6 h-6 ${
                      isActive ? 'drop-shadow-lg' : ''
                    }`} />
                    <span className={`text-xs font-medium ${
                      isActive ? 'font-semibold' : ''
                    }`}>
                      {item.name}
                    </span>
                  </Link>
                );
              })}
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default Layout;
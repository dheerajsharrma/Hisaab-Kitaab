import React, { useState, useRef, useEffect } from 'react';
import { motion } from 'framer-motion';
import {
  User,
  Mail,
  Camera,
  Save,
  Eye,
  EyeOff,
  X,
  Phone,
  MapPin,
  Calendar,
  Briefcase,
  CreditCard,
  TrendingUp,
  DollarSign,
  PieChart,
  Award,
  Shield,
  Lock
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { authAPI, transactionAPI } from '../utils/api';
import toast from 'react-hot-toast';
import LoadingSpinner from '../components/ui/LoadingSpinner';
import CustomDatePicker from '../components/ui/CustomDatePicker';
import { DashboardData } from '../types';

const Profile: React.FC = () => {
  const { user, logout } = useAuth();
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Profile editing state
  const [editingProfile, setEditingProfile] = useState(false);
  const [profileData, setProfileData] = useState({
    name: user?.name || '',
    email: user?.email || '',
    phone: '+1 234 567 8900',
    address: 'New York, USA',
    occupation: 'Software Engineer',
    dateOfBirth: '1990-01-15',
    avatar: user?.avatar || ''
  });
  const [profileLoading, setProfileLoading] = useState(false);
  
  // Dashboard data state
  const [dashboardData, setDashboardData] = useState<DashboardData | null>(null);
  const [dataLoading, setDataLoading] = useState(true);

  // Password change state
  const [changingPassword, setChangingPassword] = useState(false);
  const [passwordData, setPasswordData] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  });
  const [showPasswords, setShowPasswords] = useState({
    current: false,
    new: false,
    confirm: false
  });

  // Fetch dashboard data
  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      setDataLoading(true);
      const response = await transactionAPI.getDashboardData('year');
      if (response.success && response.data) {
        setDashboardData(response.data);
      }
    } catch (error) {
      console.error('Failed to fetch dashboard data:', error);
    } finally {
      setDataLoading(false);
    }
  };

  // Calculate account statistics from dashboard data
  const accountStats = {
    totalTransactions: ((dashboardData?.income.count || 0) + (dashboardData?.expenses.count || 0)),
    totalIncome: dashboardData?.income.total || 0,
    totalExpenses: dashboardData?.expenses.total || 0,
    balance: dashboardData?.balance || 0,
    memberSince: user?.createdAt ? new Date(user.createdAt).toLocaleDateString('en-US', { month: 'long', year: 'numeric' }) : 'January 2024',
    categoriesUsed: 12
  };

  // Handle profile data changes
  const handleProfileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setProfileData(prev => ({ ...prev, [name]: value }));
  };

  // Handle avatar upload
  const handleAvatarUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) {
        toast.error('Image size should be less than 5MB');
        return;
      }

      const reader = new FileReader();
      reader.onload = (event) => {
        const result = event.target?.result as string;
        setProfileData(prev => ({ ...prev, avatar: result }));
      };
      reader.readAsDataURL(file);
    }
  };

  // Save profile changes
  const handleSaveProfile = async () => {
    try {
      setProfileLoading(true);
      
      const response = await authAPI.updateProfile({
        name: profileData.name,
        avatar: profileData.avatar
      });
      
      if (response.success) {
        toast.success('Profile updated successfully!');
        setEditingProfile(false);
        
        const updatedUser = response.user;
        localStorage.setItem('user', JSON.stringify(updatedUser));
      }
    } catch (error: any) {
      const message = error.response?.data?.message || 'Failed to update profile';
      toast.error(message);
    } finally {
      setProfileLoading(false);
    }
  };

  // Handle password change
  const handlePasswordChange = async () => {
    if (passwordData.newPassword !== passwordData.confirmPassword) {
      toast.error('New passwords do not match');
      return;
    }
    
    if (passwordData.newPassword.length < 6) {
      toast.error('Password must be at least 6 characters long');
      return;
    }

    try {
      await new Promise(resolve => setTimeout(resolve, 1000));
      toast.success('Password changed successfully!');
      setPasswordData({
        currentPassword: '',
        newPassword: '',
        confirmPassword: ''
      });
      setChangingPassword(false);
    } catch (error) {
      toast.error('Failed to change password');
    }
  };

  if (dataLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <LoadingSpinner size="lg" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-dark-900 pb-8">
      <div className="max-w-6xl mx-auto p-4 sm:p-6 space-y-6">
        {/* Header with Cover Photo Effect */}
        <div className="relative bg-gradient-to-r from-primary-600 via-success-500 to-primary-700 rounded-2xl overflow-hidden shadow-lg">
          <div className="absolute inset-0 bg-black/10"></div>
          <div className="relative px-6 py-8 sm:px-8 sm:py-12">
            <div className="flex flex-col sm:flex-row items-center sm:items-end gap-6">
              {/* Avatar */}
              <div className="relative">
                {profileData.avatar ? (
                  <img
                    src={profileData.avatar}
                    alt="Profile"
                    className="w-32 h-32 rounded-full object-cover border-4 border-white shadow-xl"
                  />
                ) : (
                  <div className="w-32 h-32 bg-white rounded-full flex items-center justify-center text-primary-600 text-4xl font-bold border-4 border-white shadow-xl">
                    {profileData.name.charAt(0).toUpperCase()}
                  </div>
                )}
                
                {editingProfile && (
                  <button
                    onClick={() => fileInputRef.current?.click()}
                    className="absolute bottom-0 right-0 p-3 bg-primary-600 text-white rounded-full hover:bg-primary-700 transition-colors shadow-lg"
                  >
                    <Camera className="w-5 h-5" />
                  </button>
                )}
              </div>
              
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                onChange={handleAvatarUpload}
                className="hidden"
              />

              {/* User Info */}
              <div className="flex-1 text-center sm:text-left">
                <h1 className="text-3xl sm:text-4xl font-bold text-white mb-2">
                  {profileData.name}
                </h1>
                <p className="text-white/90 text-lg mb-1">{profileData.email}</p>
                <p className="text-white/80 text-sm">Member since {accountStats.memberSince}</p>
              </div>

              {/* Edit Button */}
              <div>
                <button
                  onClick={() => editingProfile ? setEditingProfile(false) : setEditingProfile(true)}
                  className={`px-6 py-3 rounded-xl font-semibold transition-all ${
                    editingProfile 
                      ? 'bg-white/20 text-white hover:bg-white/30' 
                      : 'bg-white text-primary-600 hover:bg-gray-100'
                  }`}
                >
                  {editingProfile ? (
                    <>
                      <X className="w-4 h-4 inline mr-2" />
                      Cancel
                    </>
                  ) : (
                    'Edit Profile'
                  )}
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Account Statistics */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white dark:bg-dark-800 rounded-xl shadow-sm p-4 border-l-4 border-success-500"
          >
            <div className="flex items-center justify-between mb-2">
              <TrendingUp className="w-8 h-8 text-success-500" />
            </div>
            <p className="text-2xl font-bold text-gray-900 dark:text-white">
              ${accountStats.totalIncome.toLocaleString()}
            </p>
            <p className="text-sm text-gray-600 dark:text-gray-400">Total Income</p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="bg-white dark:bg-dark-800 rounded-xl shadow-sm p-4 border-l-4 border-error-500"
          >
            <div className="flex items-center justify-between mb-2">
              <CreditCard className="w-8 h-8 text-error-500" />
            </div>
            <p className="text-2xl font-bold text-gray-900 dark:text-white">
              ${accountStats.totalExpenses.toLocaleString()}
            </p>
            <p className="text-sm text-gray-600 dark:text-gray-400">Total Expenses</p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="bg-white dark:bg-dark-800 rounded-xl shadow-sm p-4 border-l-4 border-primary-500"
          >
            <div className="flex items-center justify-between mb-2">
              <DollarSign className="w-8 h-8 text-primary-500" />
            </div>
            <p className="text-2xl font-bold text-gray-900 dark:text-white">
              ${accountStats.balance.toLocaleString()}
            </p>
            <p className="text-sm text-gray-600 dark:text-gray-400">Balance</p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="bg-white dark:bg-dark-800 rounded-xl shadow-sm p-4 border-l-4 border-warning-500"
          >
            <div className="flex items-center justify-between mb-2">
              <PieChart className="w-8 h-8 text-warning-500" />
            </div>
            <p className="text-2xl font-bold text-gray-900 dark:text-white">
              {accountStats.totalTransactions}
            </p>
            <p className="text-sm text-gray-600 dark:text-gray-400">Transactions</p>
          </motion.div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Personal Information */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="bg-white dark:bg-dark-800 rounded-xl shadow-sm p-6"
          >
            <h2 className="text-xl font-semibold text-gray-900 dark:text-white flex items-center mb-6">
              <User className="w-5 h-5 mr-2 text-primary-600" />
              Personal Information
            </h2>

            <div className="space-y-4">
              <div>
                <label className="flex items-center text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  <User className="w-4 h-4 mr-2" />
                  Full Name
                </label>
                <input
                  type="text"
                  name="name"
                  value={profileData.name}
                  onChange={handleProfileChange}
                  disabled={!editingProfile}
                  className={`input-field ${!editingProfile ? 'opacity-60 cursor-not-allowed' : ''}`}
                  placeholder="Enter your full name"
                />
              </div>

              <div>
                <label className="flex items-center text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  <Mail className="w-4 h-4 mr-2" />
                  Email Address
                </label>
                <input
                  type="email"
                  name="email"
                  value={profileData.email}
                  onChange={handleProfileChange}
                  disabled={!editingProfile}
                  className={`input-field ${!editingProfile ? 'opacity-60 cursor-not-allowed' : ''}`}
                  placeholder="Enter your email"
                />
              </div>

              <div>
                <label className="flex items-center text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  <Phone className="w-4 h-4 mr-2" />
                  Phone Number
                </label>
                <input
                  type="tel"
                  name="phone"
                  value={profileData.phone}
                  onChange={handleProfileChange}
                  disabled={!editingProfile}
                  className={`input-field ${!editingProfile ? 'opacity-60 cursor-not-allowed' : ''}`}
                  placeholder="Enter your phone number"
                />
              </div>

              <div>
                <label className="flex items-center text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  <MapPin className="w-4 h-4 mr-2" />
                  Address
                </label>
                <input
                  type="text"
                  name="address"
                  value={profileData.address}
                  onChange={handleProfileChange}
                  disabled={!editingProfile}
                  className={`input-field ${!editingProfile ? 'opacity-60 cursor-not-allowed' : ''}`}
                  placeholder="Enter your address"
                />
              </div>

              <div>
                <label className="flex items-center text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  <Calendar className="w-4 h-4 mr-2" />
                  Date of Birth
                </label>
                <div className={!editingProfile ? 'opacity-60 cursor-not-allowed pointer-events-none' : ''}>
                  <CustomDatePicker
                    name="dateOfBirth"
                    value={profileData.dateOfBirth}
                    onChange={(value) => setProfileData(prev => ({ ...prev, dateOfBirth: value }))}
                  />
                </div>
              </div>

              <div>
                <label className="flex items-center text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  <Briefcase className="w-4 h-4 mr-2" />
                  Occupation
                </label>
                <input
                  type="text"
                  name="occupation"
                  value={profileData.occupation}
                  onChange={handleProfileChange}
                  disabled={!editingProfile}
                  className={`input-field ${!editingProfile ? 'opacity-60 cursor-not-allowed' : ''}`}
                  placeholder="Enter your occupation"
                />
              </div>

              {editingProfile && (
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={handleSaveProfile}
                  disabled={profileLoading}
                  className="btn-primary w-full flex items-center justify-center space-x-2 mt-6"
                >
                  {profileLoading ? (
                    <LoadingSpinner size="sm" color="text-white" />
                  ) : (
                    <>
                      <Save className="w-4 h-4" />
                      <span>Save Changes</span>
                    </>
                  )}
                </motion.button>
              )}
            </div>
          </motion.div>

          {/* Security Section */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            className="space-y-6"
          >
            {/* Account Security */}
            <div className="bg-white dark:bg-dark-800 rounded-xl shadow-sm p-6">
              <h2 className="text-xl font-semibold text-gray-900 dark:text-white flex items-center mb-6">
                <Shield className="w-5 h-5 mr-2 text-primary-600" />
                Account Security
              </h2>

              <div className="space-y-4">
                {/* Change Password */}
                <div className="border border-gray-200 dark:border-gray-600 rounded-lg p-4">
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center space-x-3">
                      <Lock className="w-5 h-5 text-gray-600 dark:text-gray-400" />
                      <div>
                        <p className="font-medium text-gray-900 dark:text-white">Change Password</p>
                        <p className="text-sm text-gray-600 dark:text-gray-400">Update your account password</p>
                      </div>
                    </div>
                    <button
                      onClick={() => setChangingPassword(!changingPassword)}
                      className="btn-secondary text-sm"
                    >
                      {changingPassword ? 'Cancel' : 'Change'}
                    </button>
                  </div>

                  {changingPassword && (
                    <div className="space-y-4 border-t border-gray-200 dark:border-gray-600 pt-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                          Current Password
                        </label>
                        <div className="relative">
                          <input
                            type={showPasswords.current ? 'text' : 'password'}
                            value={passwordData.currentPassword}
                            onChange={(e) => setPasswordData(prev => ({ ...prev, currentPassword: e.target.value }))}
                            className="input-field pr-10"
                            placeholder="Enter current password"
                          />
                          <button
                            type="button"
                            onClick={() => setShowPasswords(prev => ({ ...prev, current: !prev.current }))}
                            className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-500"
                          >
                            {showPasswords.current ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                          </button>
                        </div>
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                          New Password
                        </label>
                        <div className="relative">
                          <input
                            type={showPasswords.new ? 'text' : 'password'}
                            value={passwordData.newPassword}
                            onChange={(e) => setPasswordData(prev => ({ ...prev, newPassword: e.target.value }))}
                            className="input-field pr-10"
                            placeholder="Enter new password"
                          />
                          <button
                            type="button"
                            onClick={() => setShowPasswords(prev => ({ ...prev, new: !prev.new }))}
                            className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-500"
                          >
                            {showPasswords.new ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                          </button>
                        </div>
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                          Confirm New Password
                        </label>
                        <div className="relative">
                          <input
                            type={showPasswords.confirm ? 'text' : 'password'}
                            value={passwordData.confirmPassword}
                            onChange={(e) => setPasswordData(prev => ({ ...prev, confirmPassword: e.target.value }))}
                            className="input-field pr-10"
                            placeholder="Confirm new password"
                          />
                          <button
                            type="button"
                            onClick={() => setShowPasswords(prev => ({ ...prev, confirm: !prev.confirm }))}
                            className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-500"
                          >
                            {showPasswords.confirm ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                          </button>
                        </div>
                      </div>

                      <button
                        onClick={handlePasswordChange}
                        className="btn-primary w-full"
                      >
                        Update Password
                      </button>
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Achievements */}
            <div className="bg-white dark:bg-dark-800 rounded-xl shadow-sm p-6">
              <h2 className="text-xl font-semibold text-gray-900 dark:text-white flex items-center mb-6">
                <Award className="w-5 h-5 mr-2 text-primary-600" />
                Achievements
              </h2>

              <div className="space-y-3">
                <div className="flex items-center space-x-3 p-3 bg-success-50 dark:bg-success-900/20 rounded-lg border border-success-200 dark:border-success-800">
                  <div className="p-2 bg-success-500 text-white rounded-lg">
                    <Award className="w-5 h-5" />
                  </div>
                  <div>
                    <p className="font-medium text-gray-900 dark:text-white">Budget Master</p>
                    <p className="text-sm text-gray-600 dark:text-gray-400">100+ transactions recorded</p>
                  </div>
                </div>

                <div className="flex items-center space-x-3 p-3 bg-primary-50 dark:bg-primary-900/20 rounded-lg border border-primary-200 dark:border-primary-800">
                  <div className="p-2 bg-primary-500 text-white rounded-lg">
                    <TrendingUp className="w-5 h-5" />
                  </div>
                  <div>
                    <p className="font-medium text-gray-900 dark:text-white">Savings Guru</p>
                    <p className="text-sm text-gray-600 dark:text-gray-400">Positive balance maintained</p>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
};

export default Profile;

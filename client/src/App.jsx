import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import ProtectedRoute from './components/ProtectedRoute';

import Landing from './pages/Landing';
import Login from './pages/Login';
import Register from './pages/Register';
import ApplyTechnician from './pages/ApplyTechnician';
import CustomerDashboard from './pages/CustomerDashboard';
import Booking from './pages/Booking';
import JobTracking from './pages/JobTracking';
import RepairHistory from './pages/RepairHistory';
import Complaint from './pages/Complaint';
import TechnicianDashboard from './pages/TechnicianDashboard';
import Earnings from './pages/Earnings';
import AdminDashboard from './pages/AdminDashboard';

export default function App() {
  return (
    <AuthProvider>
      <Router>
        <Routes>
          {/* Public Routes */}
          <Route path="/" element={<Landing />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/apply-technician" element={<ApplyTechnician />} />

          {/* Customer Routes */}
          <Route path="/customer-dashboard" element={
            <ProtectedRoute allowedRoles={['customer']}>
              <CustomerDashboard />
            </ProtectedRoute>
          } />
          <Route path="/booking" element={
            <ProtectedRoute allowedRoles={['customer']}>
              <Booking />
            </ProtectedRoute>
          } />
          <Route path="/job-tracking/:id" element={
            <ProtectedRoute allowedRoles={['customer', 'technician', 'admin']}>
              <JobTracking />
            </ProtectedRoute>
          } />
          <Route path="/repair-history" element={
            <ProtectedRoute allowedRoles={['customer']}>
              <RepairHistory />
            </ProtectedRoute>
          } />
          <Route path="/complaint" element={
            <ProtectedRoute allowedRoles={['customer']}>
              <Complaint />
            </ProtectedRoute>
          } />

          {/* Technician Routes */}
          <Route path="/technician-dashboard" element={
            <ProtectedRoute allowedRoles={['technician']}>
              <TechnicianDashboard />
            </ProtectedRoute>
          } />
          <Route path="/earnings" element={
            <ProtectedRoute allowedRoles={['technician']}>
              <Earnings />
            </ProtectedRoute>
          } />

          {/* Admin Routes */}
          <Route path="/admin-dashboard" element={
            <ProtectedRoute allowedRoles={['admin']}>
              <AdminDashboard />
            </ProtectedRoute>
          } />
        </Routes>
      </Router>
    </AuthProvider>
  );
}

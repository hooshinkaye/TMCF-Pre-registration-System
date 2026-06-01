import { useState } from 'react';
import { AdminDashboardNew } from '@/components/AdminDashboardNew';
import { AdminLogin } from '@/components/AdminLogin';

export function AdminPage() {
  const [isAuthenticated, setIsAuthenticated] = useState(() => !!localStorage.getItem('adminToken'));

  const handleLoginSuccess = (token: string) => {
    localStorage.setItem('adminToken', token);
    setIsAuthenticated(true);
  };

  const handleLogout = () => {
    localStorage.removeItem('adminToken');
    setIsAuthenticated(false);
  };

  if (!isAuthenticated) {
    return <AdminLogin onLoginSuccess={handleLoginSuccess} />;
  }

  return <AdminDashboardNew onLogout={handleLogout} />;
}

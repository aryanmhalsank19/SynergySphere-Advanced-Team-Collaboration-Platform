import { useEffect, useState } from 'react';
import { Outlet, Navigate } from 'react-router-dom';
import { Sidebar } from './Sidebar';
import { authService, AuthState } from '@/lib/auth';

export function DashboardLayout() {
  const [authState, setAuthState] = useState<AuthState>(authService.getAuthState());

  useEffect(() => {
    const unsubscribe = authService.subscribe(setAuthState);
    return unsubscribe;
  }, []);

  if (!authState.isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  return (
    <div className="flex h-screen bg-background">
      <Sidebar />
      <main className="flex-1 lg:ml-64">
        <div className="h-full overflow-auto">
          <div className="container max-w-7xl mx-auto px-4 py-8 lg:px-8">
            <Outlet />
          </div>
        </div>
      </main>
    </div>
  );
}
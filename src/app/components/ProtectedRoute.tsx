import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

/**
 * Protejează rutele care necesită autentificare.
 *
 * Utilizare în routes.tsx:
 * { path: '/', Component: Layout, children: [
 *   { Component: ProtectedRoute, children: [
 *     { path: 'account', Component: Account }
 *   ]}
 * ]}
 */
export function ProtectedRoute() {
  const { isAuthenticated, isLoading } = useAuth();

  // Cât timp se verifică sesiunea (la refresh) — spinner simplu
  if (isLoading) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent" />
      </div>
    );
  }

  // Dacă nu e autentificat → redirecționare la login
  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  return <Outlet />;
}

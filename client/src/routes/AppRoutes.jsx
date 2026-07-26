import { Routes, Route, Navigate } from "react-router-dom";

import Landing from "../pages/Landing/Landing";
import Login from "../pages/Login/Login";
import Signup from "../pages/Signup/Signup";
import Dashboard from "../pages/Dashboard/Dashboard";
import Transactions from "../pages/Transactions/Transactions";

import ProtectedRoute from "./ProtectedRoute";
import useAuth from "../hooks/useAuth";
import Upload from "../pages/upload/Upload";
import Analytics from "../pages/Analytics/Analytics";
import Settings from "../pages/Settings/Settings";

export default function AppRoutes() {
  const { isAuthenticated } = useAuth();

  return (
    <Routes>
      {/* Public Routes */}

      <Route
        path="/"
        element={<Landing />}
      />

      <Route
        path="/login"
        element={
          isAuthenticated ? (
            <Navigate to="/dashboard" replace />
          ) : (
            <Login />
          )
        }
      />

      <Route
        path="/signup"
        element={
          isAuthenticated ? (
            <Navigate to="/dashboard" replace />
          ) : (
            <Signup />
          )
        }
      />

      {/* Protected Dashboard */}

      <Route
        path="/dashboard"
        element={
          <ProtectedRoute>
            <Dashboard />
          </ProtectedRoute>
        }
      />

      {/* Protected Upload */}
      <Route
        path="/upload"
        element={
          <ProtectedRoute>
            <Upload />
          </ProtectedRoute>
        }
      />

      {/* Protected Analytics */}
      <Route
        path="/analytics"
        element={
          <ProtectedRoute>
            <Analytics />
          </ProtectedRoute>
        }
      />

      {/* Protected Settings */}
      <Route
        path="/settings"
        element={
          <ProtectedRoute>
            <Settings />
          </ProtectedRoute>
        }
      />

      {/* Protected Transactions */}

      <Route
        path="/transactions"
        element={
          <ProtectedRoute>
            <Transactions />
          </ProtectedRoute>
        }
      />

      {/* 404 */}

      <Route
        path="*"
        element={<Navigate to="/" replace />}
      />
    </Routes>
  );
}
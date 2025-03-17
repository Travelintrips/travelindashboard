import React, { useEffect } from "react";
import LoginForm from "../auth/LoginForm";
import { useAuth } from "../../contexts/AuthContext";
import { useNavigate } from "react-router-dom";

const LoginPage = () => {
  const { user, userRole, loading } = useAuth();
  const navigate = useNavigate();

  // Redirect if user is already logged in
  useEffect(() => {
    if (user && !loading && userRole) {
      if (userRole === "Admin") {
        navigate("/");
      } else {
        navigate("/");
      }
    }
  }, [user, userRole, loading, navigate]);

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
      <LoginForm />
    </div>
  );
};

export default LoginPage;

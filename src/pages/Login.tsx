
import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import LoginForm from '@/components/auth/LoginForm';
import { Shield } from 'lucide-react';

const Login = () => {
  const { isAuthenticated } = useAuth();
  const navigate = useNavigate();
  
  useEffect(() => {
    if (isAuthenticated) {
      navigate('/dashboard');
    }
  }, [isAuthenticated, navigate]);

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-dashboard-pattern p-4">
      <div className="flex items-center mb-8">
        <Shield className="h-10 w-10 text-secureGuard-blue" />
        <h1 className="ml-2 text-3xl font-bold text-secureGuard-navy">SecureGuard</h1>
      </div>
      <LoginForm />
      <p className="mt-8 text-sm text-gray-500">
        Automating security operations for improved efficiency and oversight
      </p>
    </div>
  );
};

export default Login;

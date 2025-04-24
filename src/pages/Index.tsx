
import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { Shield, ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/button';

const Index = () => {
  const { isAuthenticated } = useAuth();
  const navigate = useNavigate();
  
  useEffect(() => {
    if (isAuthenticated) {
      navigate('/dashboard');
    }
  }, [isAuthenticated, navigate]);

  return (
    <div className="min-h-screen bg-secureGuard-lightGray">
      {/* Hero Section */}
      <div className="relative bg-secureGuard-navy text-white">
        <div className="container mx-auto px-4 py-20">
          <div className="max-w-3xl mx-auto text-center">
            <div className="flex items-center justify-center mb-6">
              <Shield className="h-12 w-12 text-secureGuard-blue" />
              <h1 className="ml-3 text-4xl font-bold">SecureGuard</h1>
            </div>
            <h2 className="text-3xl md:text-5xl font-bold mb-6">
              Automated Security Management Platform
            </h2>
            <p className="text-xl mb-8 text-gray-300">
              Streamline guard check-ins, incident reporting, and security analytics for improved operational efficiency.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button 
                className="bg-secureGuard-blue hover:bg-secureGuard-blue/90 text-white text-lg px-8 py-6"
                onClick={() => navigate('/login')}
              >
                Sign In
                <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
              <Button 
                variant="outline"
                className="border-white text-white hover:bg-white hover:text-secureGuard-navy text-lg px-8 py-6"
                onClick={() => navigate('/login')}
              >
                Learn More
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Features Section */}
      <div className="container mx-auto px-4 py-16">
        <h2 className="text-3xl font-bold text-center mb-12">Key Features</h2>
        <div className="grid md:grid-cols-3 gap-8">
          <div className="bg-white p-6 rounded-lg shadow-md">
            <div className="bg-secureGuard-blue/10 p-3 rounded-full w-fit mb-4">
              <Shield className="h-6 w-6 text-secureGuard-blue" />
            </div>
            <h3 className="text-xl font-bold mb-2">Automated Check-ins</h3>
            <p className="text-gray-600">
              Streamline guard check-in processes with automated tracking and verification.
            </p>
          </div>
          <div className="bg-white p-6 rounded-lg shadow-md">
            <div className="bg-secureGuard-blue/10 p-3 rounded-full w-fit mb-4">
              <Shield className="h-6 w-6 text-secureGuard-blue" />
            </div>
            <h3 className="text-xl font-bold mb-2">Incident Reporting</h3>
            <p className="text-gray-600">
              Document and manage security incidents with our structured reporting system.
            </p>
          </div>
          <div className="bg-white p-6 rounded-lg shadow-md">
            <div className="bg-secureGuard-blue/10 p-3 rounded-full w-fit mb-4">
              <Shield className="h-6 w-6 text-secureGuard-blue" />
            </div>
            <h3 className="text-xl font-bold mb-2">Performance Analytics</h3>
            <p className="text-gray-600">
              Gain insights into security operations with comprehensive data analytics.
            </p>
          </div>
        </div>
      </div>

      {/* CTA Section */}
      <div className="bg-secureGuard-blue/10 py-16">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold mb-4">Ready to transform your security operations?</h2>
          <p className="text-lg mb-8 max-w-2xl mx-auto">
            Join security firms around the world who trust SecureGuard for their management needs.
          </p>
          <Button 
            className="bg-secureGuard-blue hover:bg-secureGuard-navy text-white text-lg px-8 py-6"
            onClick={() => navigate('/login')}
          >
            Get Started Today
          </Button>
        </div>
      </div>

      {/* Footer */}
      <footer className="bg-secureGuard-navy text-white py-8">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-center mb-4">
            <Shield className="h-6 w-6 text-secureGuard-blue" />
            <span className="ml-2 font-bold">SecureGuard</span>
          </div>
          <p className="text-center text-sm text-gray-400">
            &copy; 2025 SecureGuard. All rights reserved.
          </p>
        </div>
      </footer>
    </div>
  );
};

export default Index;

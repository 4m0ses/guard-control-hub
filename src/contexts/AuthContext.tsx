
import { createContext, useState, useContext, useEffect, ReactNode } from 'react';
import { useToast } from '@/components/ui/use-toast';

interface User {
  id: string;
  email: string;
  name: string;
  role: 'admin' | 'manager' | 'guard';
  companyId?: string;
}

interface AuthContextType {
  user: User | null;
  isLoading: boolean;
  isAuthenticated: boolean;
  login: (email: string, password: string) => Promise<void>;
  logout: () => void;
  hasRole: (role: string | string[]) => boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Simulated user data - this would come from Auth0 in the real implementation
const mockUsers = [
  {
    id: '1',
    email: 'admin@secureguard.com',
    password: 'admin123',
    name: 'Admin User',
    role: 'admin' as const,
  },
  {
    id: '2',
    email: 'manager@secureguard.com',
    password: 'manager123',
    name: 'Manager User',
    role: 'manager' as const,
    companyId: 'company1',
  },
  {
    id: '3',
    email: 'guard@secureguard.com',
    password: 'guard123',
    name: 'Guard User',
    role: 'guard' as const,
    companyId: 'company1',
  },
];

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const { toast } = useToast();
  
  useEffect(() => {
    // Check if a user is already logged in via localStorage
    const storedUser = localStorage.getItem('secureGuard_user');
    
    if (storedUser) {
      try {
        setUser(JSON.parse(storedUser));
      } catch (error) {
        console.error('Failed to parse stored user:', error);
        localStorage.removeItem('secureGuard_user');
      }
    }
    
    setIsLoading(false);
  }, []);
  
  const login = async (email: string, password: string) => {
    setIsLoading(true);
    
    try {
      // Simulate API call to Auth0
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Find user in mock data
      const foundUser = mockUsers.find(
        user => user.email === email && user.password === password
      );
      
      if (!foundUser) {
        throw new Error('Invalid credentials');
      }
      
      // Create user object without password
      const { password: _, ...userWithoutPassword } = foundUser;
      
      // Store in state and localStorage
      setUser(userWithoutPassword);
      localStorage.setItem('secureGuard_user', JSON.stringify(userWithoutPassword));
      
      toast({
        title: 'Login Successful',
        description: `Welcome back, ${userWithoutPassword.name}!`,
      });
    } catch (error) {
      toast({
        title: 'Login Failed',
        description: error instanceof Error ? error.message : 'An unexpected error occurred',
        variant: 'destructive',
      });
      throw error;
    } finally {
      setIsLoading(false);
    }
  };
  
  const logout = () => {
    localStorage.removeItem('secureGuard_user');
    setUser(null);
    toast({
      title: 'Logged Out',
      description: 'You have been successfully logged out.',
    });
  };
  
  const hasRole = (role: string | string[]) => {
    if (!user) return false;
    
    if (Array.isArray(role)) {
      return role.includes(user.role);
    }
    
    return user.role === role;
  };
  
  return (
    <AuthContext.Provider 
      value={{ 
        user, 
        isLoading, 
        isAuthenticated: !!user,
        login, 
        logout,
        hasRole
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  
  return context;
};

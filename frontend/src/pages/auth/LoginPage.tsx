import React, { useState,useEffect } from 'react';
import { Link } from 'react-router-dom';
import { User,  LogIn, AlertCircle } from 'lucide-react';
import { Button } from '../../components/ui/Button';
import { Input } from '../../components/ui/Input';
import { useNavigate } from "react-router-dom";
import { clearError } from '../../features/auth/authSlice';
import { useAppDispatch, useAppSelector } from "../../store/hooks";
import { loginThunk } from "../../features/auth/authThunk";


export const LoginPage: React.FC = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  // const [error, setError] = useState<string | null>(null);
  // const [isLoading, setIsLoading] = useState(false);
  const { loading, error } = useAppSelector(
  (state) => state.auth
);
  
const dispatch = useAppDispatch()
const navigate = useNavigate();

useEffect(() => {
  dispatch(clearError());

  return () => {
    dispatch(clearError());
  };
}, [dispatch]);
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    dispatch(clearError());


  const resultAction = await dispatch(
    loginThunk({
      email,
      password,
    })
  );

   if (loginThunk.fulfilled.match(resultAction)) {
  const user = resultAction.payload.data;

if (user.role === "entrepreneur") {
    navigate("/dashboard/entrepreneur");
} else {
    navigate("/dashboard/investor");
}
  }
    

  };
  

  
  return (
    <div className="min-h-screen bg-gray-50 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        <div className="flex justify-center">
          <div className="w-12 h-12 bg-primary-600 rounded-md flex items-center justify-center">
            <svg width="32" height="32" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className="text-white">
              <path d="M20 7H4C2.89543 7 2 7.89543 2 9V19C2 20.1046 2.89543 21 4 21H20C21.1046 21 22 20.1046 22 19V9C22 7.89543 21.1046 7 20 7Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              <path d="M16 21V5C16 3.89543 15.1046 3 14 3H10C8.89543 3 8 3.89543 8 5V21" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </div>
        </div>
        <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
          Sign in to Business Nexus
        </h2>
        <p className="mt-2 text-center text-sm text-gray-600">
          Connect with investors and entrepreneurs
        </p>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
        <div className="bg-white py-8 px-4 shadow sm:rounded-lg sm:px-10">
          {error && (
            <div className="mb-4 bg-error-50 border border-error-500 text-error-700 px-4 py-3 rounded-md flex items-start">
              <AlertCircle size={18} className="mr-2 mt-0.5" />
              <span>{error}</span>
            </div>
          )}
          
          <form className="space-y-6" onSubmit={handleSubmit}>
          
            
            <Input
              label="Email address"
              type="email"
              value={email}
                onChange={(e) => {
    setEmail(e.target.value);
    dispatch(clearError())
                }}
              required
              fullWidth
              startAdornment={<User size={18} />}
            />
            
            <Input
              label="Password"
              type="password"
              value={password}
              onChange={(e) => {
                setPassword(e.target.value)
    dispatch(clearError())

                

              }}
              required
              fullWidth
            />
            
            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <input
                  id="remember-me"
                  name="remember-me"
                  type="checkbox"
                  className="h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300 rounded"
                />
                <label htmlFor="remember-me" className="ml-2 block text-sm text-gray-900">
                  Remember me
                </label>
              </div>

              <div className="text-sm">
                <a href="#" className="font-medium text-primary-600 hover:text-primary-500">
                  Forgot your password?
                </a>
              </div>
            </div>
            
            <Button
              type="submit"
              fullWidth
              isLoading={loading}
              leftIcon={<LogIn size={18} />}
              disabled={loading}
            >
              Sign in
            </Button>
          </form>

          
          <div className="mt-6">
            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-gray-300"></div>
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="px-2 bg-white text-gray-500">Or</span>
              </div>
            </div>
            
            <div className="mt-2 text-center">
              <p className="text-sm text-gray-600">
                Don't have an account?{' '}
                <Link to="/register" className="font-medium text-primary-600 hover:text-primary-500">
                  Sign up
                </Link>
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
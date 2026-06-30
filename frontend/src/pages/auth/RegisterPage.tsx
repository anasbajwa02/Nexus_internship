import React, { useState,useEffect } from 'react';
import { Link } from 'react-router-dom';
import { User, Mail, Lock, CircleDollarSign, Building2, AlertCircle,Smile } from 'lucide-react';
import { Button } from '../../components/ui/Button';
import { Input } from '../../components/ui/Input';
import type { UserRole } from "../../features/auth/authTypes";
import { useNavigate } from "react-router-dom";
import { useAppDispatch, useAppSelector } from "../../store/hooks";
import { registerThunk } from "../../features/auth/authThunk";
import { clearError } from '../../features/auth/authSlice';


export const RegisterPage: React.FC = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [bio, setBio] = useState("")
  const [avatar, setAvatar] = useState<File | null>(null);
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [role, setRole] = useState<UserRole>('entrepreneur');
const [formError, setFormError] = useState<string | null>(null);
 
const dispatch = useAppDispatch();

const navigate = useNavigate();

useEffect(() => {
  dispatch(clearError());

  return () => {
    dispatch(clearError());
  };
}, [dispatch]);

const { loading, error } = useAppSelector(
    (state) => state.auth
);

const handleSubmit = async (e: React.FormEvent) => {
  e.preventDefault();
setFormError(null)
 dispatch(clearError());;



 if (password !== confirmPassword) {
    setFormError("Passwords do not match");
    return;
}


  if (!avatar) {
    setFormError("Please upload a profile picture");
    return;
}
  const resultAction = await dispatch(
    

    registerThunk({
      name,
      email,
      password,
      bio,
      role,
      avatar,
    })
  );

  if (registerThunk.fulfilled.match(resultAction)) {
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
          Create your account
        </h2>
        <p className="mt-2 text-center text-sm text-gray-600">
          Join Business Nexus to connect with partners
        </p>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
        <div className="bg-white py-8 px-4 shadow sm:rounded-lg sm:px-10">
          {formError && (
  <div className="mb-4 bg-error-50 border border-error-500 text-error-700 px-4 py-3 rounded-md flex items-start">
    <AlertCircle size={18} className="mr-2 mt-0.5" />
    <span>{formError}</span>
  </div>
)}

{error && (
  <div className="mb-4 bg-error-50 border border-error-500 text-error-700 px-4 py-3 rounded-md flex items-start">
    <AlertCircle size={18} className="mr-2 mt-0.5" />
    <span>{error}</span>
  </div>
)}
          
          <form className="space-y-6" onSubmit={handleSubmit}>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                I am registering as a
              </label>
              <div className="grid grid-cols-2 gap-3">
                <button
                  type="button"
                  className={`py-3 px-4 border rounded-md flex items-center justify-center transition-colors ${
                    role === 'entrepreneur'
                      ? 'border-primary-500 bg-primary-50 text-primary-700'
                      : 'border-gray-300 text-gray-700 hover:bg-gray-50'
                  }`}
                  onClick={() => setRole('entrepreneur')}
                >
                  <Building2 size={18} className="mr-2" />
                  Entrepreneur
                </button>
                
                <button
                  type="button"
                  className={`py-3 px-4 border rounded-md flex items-center justify-center transition-colors ${
                    role === 'investor'
                      ? 'border-primary-500 bg-primary-50 text-primary-700'
                      : 'border-gray-300 text-gray-700 hover:bg-gray-50'
                  }`}
                  onClick={() => setRole('investor')}
                >
                  <CircleDollarSign size={18} className="mr-2" />
                  Investor
                </button>
              </div>
            </div>
            
            <Input
              label="Full name"
              type="text"
              value={name}
              onChange={(e) => {
    setName(e.target.value);
    setFormError(null)
     dispatch(clearError());;
}}
              required
              fullWidth
              startAdornment={<User size={18} />}
            />
            
            <Input
              label="Email address"
              type="email"
              value={email}
             onChange={(e) => {
    setEmail(e.target.value);
    setFormError(null)
     dispatch(clearError());;
}}
              required
              fullWidth
              startAdornment={<Mail size={18} />}
            />

            {/* // bio */}
            <Input
              label="Enter your bio"
              type="text"
              value={bio}
              onChange={(e) => {
    setBio(e.target.value);
    setFormError(null)
     dispatch(clearError());;
}}
              required
              fullWidth
              startAdornment={<Smile size={18} />}
            />
            <div>
  <label className="block text-sm font-medium text-gray-700 mb-1">
    Profile Picture
  </label>

  <input
    type="file"
    accept="image/*"
    onChange={(e) => {
      if (e.target.files && e.target.files.length > 0) {
        setAvatar(e.target.files[0]);
         setFormError(null)
          dispatch(clearError());;
      }
    }}
    className="block w-full text-sm"
  />
</div>

            
            <Input
              label="Password"
              type="password"
              value={password}
             onChange={(e) => {
    setPassword(e.target.value);
    setFormError(null)
     dispatch(clearError());;
}}
              required
              fullWidth
              startAdornment={<Lock size={18} />}
            />
            
            <Input
              label="Confirm password"
              type="password"
              value={confirmPassword}
             onChange={(e) => {
    setConfirmPassword(e.target.value);
    setFormError(null)
     dispatch(clearError());;
}}
              required
              fullWidth
              startAdornment={<Lock size={18} />}
            />
            
            <div className="flex items-center">
              <input
                id="terms"
                name="terms"
                type="checkbox"
                required
                className="h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300 rounded"
              />
              <label htmlFor="terms" className="ml-2 block text-sm text-gray-900">
                I agree to the{' '}
                <a href="#" className="font-medium text-primary-600 hover:text-primary-500">
                  Terms of Service
                </a>{' '}
                and{' '}
                <a href="#" className="font-medium text-primary-600 hover:text-primary-500">
                  Privacy Policy
                </a>
              </label>
            </div>
            
            <Button
              type="submit"
              fullWidth
              isLoading={loading}
              disabled={loading}

            >
              Create account
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
                Already have an account?{' '}
                <Link to="/login" className="font-medium text-primary-600 hover:text-primary-500">
                  Sign in
                </Link>
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
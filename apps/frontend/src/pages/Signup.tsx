import React, { useState } from 'react';
import { Lock, Mail, UserPlus, Code, Wand2, Globe, Rocket, Zap, User } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { BACKEND_URL } from '../config';

export const Signup = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [name, setName] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [error, setError] = useState('');

    const navigate = useNavigate();
  
    const handleSubmit = async (e: React.FormEvent) => {
      e.preventDefault();
      try{
        if(password !== confirmPassword){
          setError('Passwords does not match');
          return;
        }
        const response = await axios.post(`${BACKEND_URL}/user/signup`, {
            email,
            password,
            name
        },{
            withCredentials: true
        });
        if(response.status === 200){
          localStorage.setItem("token", `Bearer ${response.data.token}`);
          localStorage.setItem("name", name);
          navigate('/');
        }
      } catch (error) {
        console.log(error);
      }
    };
  
    return (
      <div className="min-h-screen bg-brown3 flex">
        {/* Left side - Form */}
        <div className="w-full md:w-1/2 flex items-center justify-center p-4">
          <div className="w-full max-w-md space-y-8 bg-gray-800/50 p-8 rounded-xl shadow-2xl backdrop-blur-sm">
            {/* Header */}
            <div className="text-center">
              <div className="flex items-center justify-center gap-2 mb-8">
                <Code className="h-8 w-8 text-blue-400" />
                <span className="text-2xl font-bold text-white">Webcraft</span>
              </div>
              <h2 className="text-3xl font-extrabold text-white">
                Create an account
              </h2>
              <p className="mt-2 text-sm text-gray-400">
                  Start creating stunning websites in minutes
              </p>
            </div>
  
            {/* Form */}
            <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
              <div className="space-y-4">
                  <div>
                    <label htmlFor="name" className="sr-only">
                      Full name
                    </label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <User className="h-5 w-5 text-gray-500" />
                      </div>
                      <input
                        id="name"
                        name="name"
                        type="text"
                        required
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        className="block w-full pl-10 pr-3 py-3 border border-gray-700 rounded-lg bg-gray-700/50 text-gray-200 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-transparent sm:text-sm"
                        placeholder="Full name"
                      />
                    </div>
                  </div>
  
                <div>
                  <label htmlFor="email" className="sr-only">
                    Email address
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <Mail className="h-5 w-5 text-gray-500" />
                    </div>
                    <input
                      id="email"
                      name="email"
                      type="email"
                      required
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="block w-full pl-10 pr-3 py-3 border border-gray-700 rounded-lg bg-gray-700/50 text-gray-200 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-transparent sm:text-sm"
                      placeholder="Email address"
                    />
                  </div>
                </div>
  
                <div>
                  <label htmlFor="password" className="sr-only">
                    Password
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <Lock className="h-5 w-5 text-gray-500" />
                    </div>
                    <input
                      id="password"
                      name="password"
                      type="password"
                      required
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      className="block w-full pl-10 pr-3 py-3 border border-gray-700 rounded-lg bg-gray-700/50 text-gray-200 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-transparent sm:text-sm"
                      placeholder="Password"
                    />
                  </div>
                </div>
                  <div>
                    <label htmlFor="confirmPassword" className="sr-only">
                      Confirm Password
                    </label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <Lock className="h-5 w-5 text-gray-500" />
                      </div>
                      <input
                        id="confirmPassword"
                        name="confirmPassword"
                        type="password"
                        required
                        value={confirmPassword}
                        onChange={(e) => setConfirmPassword(e.target.value)}
                        className="block w-full pl-10 pr-3 py-3 border border-gray-700 rounded-lg bg-gray-700/50 text-gray-200 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-transparent sm:text-sm"
                        placeholder="Confirm password"
                      />
                    </div>
                  </div>

                  {error && <div className="text-red-500 text-sm">{error}</div>}
              </div>
  
              <button
                type="submit"
                className="group relative w-full bg-gradient-to-r from-blue-400 to-purple-500 text-white px-8 py-3 rounded-lg font-medium flex items-center justify-center hover:bg-gradient-to-r hover:from-blue-500 hover:to-purple-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-400 focus:ring-offset-gray-800 transform transition-all duration-150 hover:scale-[1.02]"
                >
                 Sign up
                  <UserPlus className="ml-2 h-5 w-5" />
              </button>
  
              <p className="mt-2 text-center text-sm text-gray-400">
                 Already have an account?{' '}
                <button
                  type="button"
                  onClick={() => navigate('/signin')}
                  className="font-medium text-blue-400 hover:text-blue-300"
                >
                   Sign in
                </button>
              </p>
            </form>
          </div>
        </div>
  
        {/* Right side - Features */}
        <div className="hidden md:flex md:w-1/2 bg-gradient-to-br from-blue-600/20 to-purple-600/20 p-12 items-center justify-center">
          <div className="max-w-lg">
            <h2 className="text-4xl font-bold text-white mb-8">
              Create stunning websites with WebCraft
            </h2>
            
            <div className="space-y-6">
              <div className="flex items-start space-x-4">
                <div className="bg-blue-500/10 p-3 rounded-lg">
                  <Wand2 className="h-6 w-6 text-blue-400" />
                </div>
                <div>
                  <h3 className="text-xl font-semibold text-white mb-2">AI-Powered Design</h3>
                  <p className="text-gray-400">Create beautiful, responsive websites in minutes with our AI-driven design tools.</p>
                </div>
              </div>
  
              <div className="flex items-start space-x-4">
                <div className="bg-purple-500/10 p-3 rounded-lg">
                  <Globe className="h-6 w-6 text-purple-400" />
                </div>
                <div>
                  <h3 className="text-xl font-semibold text-white mb-2">One-Click Deploy</h3>
                  <p className="text-gray-400">Deploy your website globally with our integrated hosting and CDN infrastructure.</p>
                </div>
              </div>
  
              <div className="flex items-start space-x-4">
                <div className="bg-blue-500/10 p-3 rounded-lg">
                  <Rocket className="h-6 w-6 text-blue-400" />
                </div>
                <div>
                  <h3 className="text-xl font-semibold text-white mb-2">SEO Optimization</h3>
                  <p className="text-gray-400">Built-in SEO tools to help your website rank higher in search results.</p>
                </div>
              </div>
  
              <div className="flex items-start space-x-4">
                <div className="bg-purple-500/10 p-3 rounded-lg">
                  <Zap className="h-6 w-6 text-purple-400" />
                </div>
                <div>
                  <h3 className="text-xl font-semibold text-white mb-2">Lightning Fast</h3>
                  <p className="text-gray-400">Optimized performance ensures your website loads instantly on any device.</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
}
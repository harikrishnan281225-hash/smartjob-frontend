import React, { useState } from 'react';
import { Link } from 'react-router-dom';

const Register = () => {
    const [formData, setFormData] = useState({ username: '', email: '', password: '' });
    const [message, setMessage] = useState('');
    const [error, setError] = useState('');
    const [isLoading, setIsLoading] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setMessage('');
        setIsLoading(true);

        try {
            const response = await fetch('http://localhost:8080/api/auth/register', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(formData),
            });

            const text = await response.text();
            
            if (response.ok) {
                setMessage("Registration successful! You can now login.");
            } else {
                setError(text || "Registration failed.");
            }
        } catch (err) {
            setError("Server unreachable. Make sure Spring Boot is running.");
        } finally {
            setIsLoading(false);
        }
    };

    const handleGoogleRegister = () => {
        window.location.href = 'http://localhost:8080/oauth2/authorization/google?mode=register';
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-slate-50 p-4">
            <div className="w-full max-w-md bg-white rounded-xl shadow-xl p-8 border border-slate-100">
                <div className="text-center mb-6">
                    <h2 className="text-2xl font-bold text-slate-800">Create Account</h2>
                    <p className="text-sm text-slate-500 mt-1">Join Smart Job Portal to find your next career</p>
                </div>
                
                {/* Google Register Button with Official SVG Icon */}
                <button 
                    onClick={handleGoogleRegister}
                    type="button"
                    className="w-full flex items-center justify-center gap-3 bg-white hover:bg-slate-50 text-slate-700 border border-slate-300 p-2.5 rounded-lg transition font-semibold shadow-sm"
                >
                    <svg className="w-5 h-5" viewBox="0 0 24 24">
                        <path
                            fill="#4285F4"
                            d="M23.745 12.27c0-.7-.06-1.4-.19-2.07H12v4.51h6.6c-.29 1.52-1.14 2.82-2.4 3.68v3.05h3.88c2.27-2.09 3.66-5.17 3.66-9.17z"
                        />
                        <path
                            fill="#34A853"
                            d="M12 24c3.24 0 5.95-1.08 7.93-2.91l-3.88-3.05c-1.08.72-2.45 1.16-4.05 1.16-3.13 0-5.78-2.11-6.73-4.96H1.18v3.15C3.15 21.32 7.22 24 12 24z"
                        />
                        <path
                            fill="#FBBC05"
                            d="M5.27 14.24c-.25-.72-.38-1.49-.38-2.24s.13-1.52.38-2.24V6.61H1.18C.43 8.13 0 9.87 0 11.75s.43 3.62 1.18 5.14l4.09-3.15z"
                        />
                        <path
                            fill="#EA4335"
                            d="M12 4.75c1.77 0 3.35.61 4.6 1.8l3.42-3.42C17.95 1.19 15.24 0 12 0 7.22 0 3.15 2.68 1.18 6.61l4.09 3.15c.95-2.85 3.6-4.96 6.73-4.96z"
                        />
                    </svg>
                    Continue with Google
                </button>
                
                <div className="flex items-center my-6">
                    <div className="flex-grow border-t border-slate-200"></div>
                    <span className="px-3 text-slate-400 text-xs uppercase tracking-wider font-medium">or register with email</span>
                    <div className="flex-grow border-t border-slate-200"></div>
                </div>

                <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                        <label className="block text-xs font-semibold text-slate-600 mb-1">Username</label>
                        <input 
                            className="w-full p-2.5 border border-slate-300 rounded-lg text-slate-800 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent" 
                            type="text" 
                            placeholder="Choose a username" 
                            required
                            onChange={(e) => setFormData({...formData, username: e.target.value})} 
                        />
                    </div>
                    <div>
                        <label className="block text-xs font-semibold text-slate-600 mb-1">Email Address</label>
                        <input 
                            className="w-full p-2.5 border border-slate-300 rounded-lg text-slate-800 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent" 
                            type="email" 
                            placeholder="name@example.com" 
                            required
                            onChange={(e) => setFormData({...formData, email: e.target.value})} 
                        />
                    </div>
                    <div>
                        <label className="block text-xs font-semibold text-slate-600 mb-1">Password</label>
                        <input 
                            className="w-full p-2.5 border border-slate-300 rounded-lg text-slate-800 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent" 
                            type="password" 
                            placeholder="Create a strong password" 
                            required
                            autoComplete="new-password"
                            onChange={(e) => setFormData({...formData, password: e.target.value})} 
                        />
                    </div>
                    <button 
                        className={`w-full text-white p-2.5 rounded-lg transition font-semibold text-sm mt-2 ${isLoading ? 'bg-blue-400 cursor-not-allowed' : 'bg-blue-600 hover:bg-blue-700 shadow-sm'}`} 
                        type="submit"
                        disabled={isLoading}
                    >
                        {isLoading ? 'Creating Account...' : 'Register'}
                    </button>
                </form>
                
                <div className="mt-6 text-center">
                    <p className="text-sm text-slate-500">Already have an account? 
                        <Link to="/login" className="text-blue-600 hover:underline ml-1 font-semibold">Login here</Link>
                    </p>
                </div>

                {message && <p className="mt-4 text-green-700 font-medium bg-green-50 p-3 rounded-lg border border-green-200 text-xs text-center">{message}</p>}
                {error && <p className="mt-4 text-red-600 bg-red-50 p-3 rounded-lg border border-red-200 text-xs text-center">{error}</p>}
            </div>
        </div>
    );
};

export default Register;
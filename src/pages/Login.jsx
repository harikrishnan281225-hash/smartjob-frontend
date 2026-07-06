import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';

const Login = () => {
    const [formData, setFormData] = useState({ username: '', password: '' });
    const [error, setError] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const navigate = useNavigate();

    const handleLogin = async (e) => {
        e.preventDefault();
        setIsLoading(true);
        setError('');

        try {
            const response = await fetch('/api/auth/login', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(formData),
            });
            
            const data = await response.json();
            
            console.log("Login Server Response:", data);
            
            if (response.ok) {
                if (data.token && data.role) {
                    localStorage.setItem('token', data.token);
                    localStorage.setItem('role', data.role);
                    
                    const usernameToSave = data.username || formData.username;
                    localStorage.setItem('username', usernameToSave);
                    
                    console.log("LocalStorage set for:", usernameToSave);
                    
                    if (data.role === 'ADMIN') {
                        navigate('/admin');
                    } else {
                        navigate('/dashboard');
                    }
                } else {
                    setError("Login failed: Missing security credentials.");
                }
            } else {
                setError(data.message || "Invalid username or password.");
            }
        } catch (err) {
            console.error("Fetch error:", err);
            setError("Server unreachable.");
        } finally {
            setIsLoading(false);
        }
    };

    const handleGoogleLogin = () => {
        window.location.href = 'http://localhost:8080/oauth2/authorization/google?mode=login';
    };

    return (
        <div className="max-w-md mx-auto mt-10 p-6 bg-white rounded-lg shadow-xl">
            <h2 className="text-2xl font-bold mb-6 text-center">Login</h2>
            <div className="space-y-4">
                <button onClick={handleGoogleLogin} className="w-full bg-red-500 hover:bg-red-600 text-white p-2 rounded transition font-semibold">
                    Continue with Google
                </button>
                <div className="text-center text-gray-500 text-sm">— or —</div>
            </div>
            <form onSubmit={handleLogin} className="space-y-4 mt-4">
                <input className="w-full p-2 border rounded" type="text" placeholder="Username" required onChange={(e) => setFormData({...formData, username: e.target.value})} />
                <input className="w-full p-2 border rounded" type="password" placeholder="Password" required onChange={(e) => setFormData({...formData, password: e.target.value})} />
                <button className={`w-full text-white p-2 rounded transition ${isLoading ? 'bg-blue-400' : 'bg-blue-600 hover:bg-blue-700'}`} type="submit" disabled={isLoading}>
                    {isLoading ? 'Logging in...' : 'Login'}
                </button>
            </form>

            {/* Restored Navigation Link */}
            <div className="mt-4 text-center">
                <p className="text-sm">Don't have an account? 
                    <Link to="/register" className="text-blue-600 hover:underline ml-1 font-semibold">Register here</Link>
                </p>
            </div>

            {error && <p className="mt-4 text-red-600 bg-red-50 p-2 rounded border border-red-200">{error}</p>}
        </div>
    );
};

export default Login;
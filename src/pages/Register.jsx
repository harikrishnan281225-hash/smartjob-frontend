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
        <div className="max-w-md mx-auto mt-10 p-6 bg-white rounded-lg shadow-xl">
            <h2 className="text-2xl font-bold mb-6 text-center">Register</h2>
            
            <button 
                onClick={handleGoogleRegister}
                className="w-full bg-red-500 hover:bg-red-600 text-white p-2 rounded mb-4 transition block text-center font-semibold"
            >
                Continue with Google
            </button>
            
            <div className="text-center mb-4 text-gray-500 text-sm">— or —</div>

            <form onSubmit={handleSubmit} className="space-y-4">
                <input 
                    className="w-full p-2 border rounded" 
                    type="text" 
                    placeholder="Username" 
                    required
                    onChange={(e) => setFormData({...formData, username: e.target.value})} 
                />
                <input 
                    className="w-full p-2 border rounded" 
                    type="email" 
                    placeholder="Email" 
                    required
                    onChange={(e) => setFormData({...formData, email: e.target.value})} 
                />
                <input 
                    className="w-full p-2 border rounded" 
                    type="password" 
                    placeholder="Password" 
                    required
                    autoComplete="new-password"
                    onChange={(e) => setFormData({...formData, password: e.target.value})} 
                />
                <button 
                    className={`w-full text-white p-2 rounded transition ${isLoading ? 'bg-blue-400 cursor-not-allowed' : 'bg-blue-600 hover:bg-blue-700'}`} 
                    type="submit"
                    disabled={isLoading}
                >
                    {isLoading ? 'Registering...' : 'Register'}
                </button>
            </form>
            
            <div className="mt-4 text-center">
                <p className="text-sm">Already have an account? 
                    <Link to="/login" className="text-blue-600 hover:underline ml-1 font-semibold">Login here</Link>
                </p>
            </div>

            {message && <p className="mt-4 text-green-600 font-semibold bg-green-50 p-2 rounded border border-green-200 text-center">{message}</p>}
            {error && <p className="mt-4 text-red-600 bg-red-50 p-2 rounded border border-red-200 text-center">{error}</p>}
        </div>
    );
};

export default Register;
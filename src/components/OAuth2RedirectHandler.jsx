import React, { useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';

const OAuth2RedirectHandler = () => {
    const navigate = useNavigate();
    const location = useLocation();

    useEffect(() => {
        const params = new URLSearchParams(location.search);
        const token = params.get('token');
        const role = params.get('role'); // Capture role from URL

        if (token) {
            localStorage.setItem('token', token);
            
            // Store the role if provided by backend
            if (role) {
                localStorage.setItem('role', role);
            }

            // Redirect based on the role
            if (role === 'ADMIN') {
                navigate('/admin');
            } else {
                navigate('/dashboard');
            }
        } else {
            // Handle error case
            navigate('/login');
        }
    }, [location, navigate]);

    return <div>Authenticating... Please wait.</div>;
};

export default OAuth2RedirectHandler;
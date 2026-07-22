import React from 'react';
import AdminJobForm from '../components/AdminJobForm';
import { useNavigate } from 'react-router-dom';

const AdminPostJob = () => {
    const navigate = useNavigate();

    const handleJobPosted = () => {
        alert("Job posted and assigned successfully!");
        // Redirect to dashboard after success
        navigate('/admin/dashboard'); 
    };

    return (
        <div className="p-8">
            <h1 className="text-2xl font-bold mb-6">Post a New Job</h1>
            {/* Ensure your AdminJobForm component is collecting these fields:
               id, title, companyName, location, description, 
               salary, experienceRequired, skillsRequired, url
            */}
            <AdminJobForm 
                onClose={() => navigate(-1)} 
                onJobPosted={handleJobPosted} 
            />
        </div>
    );
};

export default AdminPostJob;
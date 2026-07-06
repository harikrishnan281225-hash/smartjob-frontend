import React from 'react';
import AdminJobForm from '../components/AdminJobForm';

const AdminPostJob = () => {
    return (
        <div className="p-8">
            <h1 className="text-2xl font-bold mb-6">Post a New Job</h1>
            <AdminJobForm 
                onClose={() => window.history.back()} 
                onJobPosted={() => alert("Job posted successfully!")} 
            />
        </div>
    );
};

export default AdminPostJob;
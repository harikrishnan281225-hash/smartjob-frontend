import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { addJob } from '../services/JobService';

const AddJob = () => {
    const [job, setJob] = useState({ 
        title: '', companyName: '', location: '', salary: '', 
        experienceRequired: '', description: '', skillsRequired: ''
    });
    
    const [isSubmitting, setIsSubmitting] = useState(false);
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (isSubmitting) return; 

        setIsSubmitting(true);
        try {
            await addJob(job);
            navigate('/dashboard');
        } catch (error) {
            console.error("Error adding job:", error);
            alert("Failed to save. Please try again.");
            setIsSubmitting(false); 
        }
    };

    return (
        <form onSubmit={handleSubmit} className="max-w-md mx-auto mt-10 p-6 bg-white rounded-lg shadow-xl space-y-4">
            <h2 className="text-2xl font-bold mb-4">Add New Job Application</h2>
            
            <input className="w-full p-2 border rounded" placeholder="Job Title" required onChange={(e) => setJob({...job, title: e.target.value})} />
            <input className="w-full p-2 border rounded" placeholder="Company Name" required onChange={(e) => setJob({...job, companyName: e.target.value})} />
            <input className="w-full p-2 border rounded" placeholder="Location" required onChange={(e) => setJob({...job, location: e.target.value})} />
            <input className="w-full p-2 border rounded" placeholder="Salary" onChange={(e) => setJob({...job, salary: e.target.value})} />
            <input className="w-full p-2 border rounded" placeholder="Experience Required (e.g., 2 years)" onChange={(e) => setJob({...job, experienceRequired: e.target.value})} />
            <textarea className="w-full p-2 border rounded" placeholder="Job Description" onChange={(e) => setJob({...job, description: e.target.value})} />
            <input className="w-full p-2 border rounded" placeholder="Skills (comma separated)" onChange={(e) => setJob({...job, skillsRequired: e.target.value})} />

            <button 
                type="submit"
                disabled={isSubmitting} 
                className={`w-full p-2 rounded text-white transition font-bold ${
                    isSubmitting ? 'bg-gray-400 cursor-wait' : 'bg-blue-600 hover:bg-blue-700'
                }`}
            >
                {isSubmitting ? "Saving Application..." : "Save Job"}
            </button>
            
            <button type="button" onClick={() => navigate('/dashboard')} className="w-full text-gray-500 hover:underline mt-2">
                Cancel
            </button>
        </form>
    );
};

export default AddJob;
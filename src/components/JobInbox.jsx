import React, { useEffect, useState } from 'react';
import api from '../services/api';

const JobInbox = () => {
    const [assignedJobs, setAssignedJobs] = useState([]);

    useEffect(() => {
        const fetchJobs = async () => {
            try {
                // This hits the /api/jobs/assigned endpoint
                const response = await api.get('/jobs/assigned');
                setAssignedJobs(Array.isArray(response.data) ? response.data : []);
            } catch (err) {
                console.error("Error fetching assignments", err);
            }
        };
        fetchJobs();
    }, []);

    const handleAction = async (jobId, status) => {
        try {
            // Send uppercase status to ensure it matches the database logic
            const statusUpper = status.toUpperCase(); 
            
            // This hits the /api/jobs/{id}/status endpoint
            await api.put(`/jobs/${jobId}/status`, { status: statusUpper }, {
                headers: { 'Content-Type': 'application/json' }
            });
            
            // Remove the job from the local list immediately after success
            // Using a functional update to ensure state consistency
            setAssignedJobs(prev => prev.filter(j => j.id !== jobId));
            
            // Dispatch event to trigger a re-fetch in your Dashboard/Sidebar components
            window.dispatchEvent(new CustomEvent('jobUpdate'));
            
            console.log(`Job ${jobId} successfully updated to ${statusUpper}`);
        } catch (err) {
            console.error("Update Error:", err);
            alert("Failed to update status. Please ensure the backend server is running.");
        }
    };

    return (
        <div className="p-8 max-w-4xl mx-auto">
            <h1 className="text-3xl font-bold mb-6 text-gray-800">Job Assignments</h1>
            
            {assignedJobs.length === 0 ? (
                <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200 text-gray-500 text-center">
                    No new job assignments at this time.
                </div>
            ) : (
                <div className="space-y-4">
                    {assignedJobs.map(job => (
                        // FIX: Key is now guaranteed to be the unique job ID
                        <div key={job.id} className="bg-white p-6 rounded-lg shadow-sm border border-gray-200 flex justify-between items-center transition hover:border-gray-300">
                            <div>
                                <h4 className="font-bold text-lg text-gray-900">{job.title}</h4>
                                <p className="text-sm font-medium text-gray-500">{job.companyName || 'Unknown Company'}</p>
                            </div>
                            <div className="flex gap-2">
                                <button 
                                    onClick={() => handleAction(job.id, "APPLIED")} 
                                    className="bg-green-600 text-white px-4 py-2 rounded-lg font-semibold hover:bg-green-700 transition"
                                >
                                    Accept
                                </button>
                                <button 
                                    onClick={() => handleAction(job.id, "REJECTED")} 
                                    className="bg-red-600 text-white px-4 py-2 rounded-lg font-semibold hover:bg-red-700 transition"
                                >
                                    Decline
                                </button>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};

export default JobInbox;
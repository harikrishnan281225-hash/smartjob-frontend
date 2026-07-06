import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { searchJobs } from '../services/SearchService';
import { getAllUsers } from '../services/api'; 
import api from '../services/api'; 
import UserSelectionModal from '../components/UserSelectionModal';

const AdminSearchJobs = () => {
    const [query, setQuery] = useState("");
    const [location, setLocation] = useState(""); 
    const [results, setResults] = useState([]);
    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(false);
    
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [selectedJob, setSelectedJob] = useState(null);
    
    const navigate = useNavigate();

    useEffect(() => {
        const fetchUsers = async () => {
            try {
                const response = await getAllUsers();
                setUsers(response.data);
            } catch (err) {
                console.error("Error fetching users for assignment", err);
            }
        };
        fetchUsers();
    }, []);

    const handleSearch = async () => {
        if (!query) return;
        setLoading(true);
        try {
            const data = await searchJobs(query, location);
            setResults(data);
        } catch (err) {
            alert("Failed to fetch jobs.");
        } finally {
            setLoading(false);
        }
    };

    const initiateAssignment = (job) => {
        setSelectedJob(job);
        setIsModalOpen(true);
    };

    const performAssignment = async (userIds) => {
        if (!selectedJob) return;
        
        const jobId = selectedJob.job_id; 

        // CRITICAL: We ensure all mandatory fields are provided
        // to prevent the SQLIntegrityConstraintViolationException
        const payload = {
            userIds: userIds,
            job: {
                id: jobId,
                title: selectedJob.job_title || "Untitled Job",
                // Ensure companyName is never null
                companyName: selectedJob.employer_name && selectedJob.employer_name.trim() !== "" 
                             ? selectedJob.employer_name 
                             : "Unknown Company",
                location: selectedJob.job_city || "Remote",
                description: selectedJob.job_description || "No description provided.",
                url: selectedJob.job_apply_link || ""
            }
        };

        console.log("Sending payload to backend:", payload);
        
        try {
            await api.post('/admin/assign-job', payload);
            alert(`Job assigned successfully!`);
            setIsModalOpen(false);
        } catch (err) {
            console.error("Assignment Error Details:", err.response?.data);
            alert("Assignment failed: " + (err.response?.data?.message || "Check server logs"));
        }
    };

    return (
        <div className="p-8">
            <header className="flex justify-between items-center mb-8">
                <h1 className="text-3xl font-bold text-gray-900">Search & Assign Jobs</h1>
                <button 
                    onClick={() => navigate('/admin/dashboard')} 
                    className="px-4 py-2 bg-gray-800 text-white rounded-lg hover:bg-gray-900"
                >
                    ← Back to Dashboard
                </button>
            </header>
            
            <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200 flex flex-col md:flex-row gap-4 mb-8">
                <input 
                    type="text" 
                    value={query} 
                    onChange={(e) => setQuery(e.target.value)} 
                    className="flex-grow p-3 border rounded-lg" 
                    placeholder="Job title..." 
                />
                <input 
                    type="text" 
                    value={location} 
                    onChange={(e) => setLocation(e.target.value)} 
                    className="w-full md:w-1/3 p-3 border rounded-lg" 
                    placeholder="Location..." 
                />
                <button 
                    onClick={handleSearch} 
                    className="bg-blue-600 text-white px-8 py-3 rounded-lg font-semibold hover:bg-blue-700"
                >
                    {loading ? "Searching..." : "Search"}
                </button>
            </div>
            
            <ul className="space-y-4">
                {results.map((job, index) => (
                    <li key={job.job_id || index} className="bg-white p-6 rounded-xl shadow border flex justify-between items-center">
                        <div>
                            <h3 className="font-bold text-lg">{job.job_title}</h3>
                            <p className="text-gray-600">{job.employer_name || "Unknown Company"}</p>
                        </div>
                        <button 
                            onClick={() => initiateAssignment(job)} 
                            className="bg-green-600 text-white px-5 py-2 rounded-lg font-semibold hover:bg-green-700"
                        >
                            Assign to Users
                        </button>
                    </li>
                ))}
            </ul>

            <UserSelectionModal 
                isOpen={isModalOpen} 
                onClose={() => setIsModalOpen(false)} 
                users={users} 
                onConfirm={performAssignment} 
            />
        </div>
    );
};

export default AdminSearchJobs;
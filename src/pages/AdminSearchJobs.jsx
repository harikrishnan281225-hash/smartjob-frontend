import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { searchJobs } from '../services/SearchService';
import { getAllUsers, assignJob } from '../services/api'; // Use the named import from api.js
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
                console.error("Error fetching users:", err);
            }
        };
        fetchUsers();
    }, []);

    const handleSearch = async () => {
        if (!query.trim()) return;
        setLoading(true);
        try {
            const data = await searchJobs(query, location);
            setResults(data || []);
        } catch (err) {
            alert("Failed to fetch jobs. Please check your search service.");
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
        
        // Strict mapping to your Backend JobAssignmentRequest DTO
        const payload = {
            userIds: userIds,
            job: {
                id: selectedJob.job_id || selectedJob.id,
                title: selectedJob.job_title || selectedJob.title || "Untitled Job",
                companyName: selectedJob.employer_name || selectedJob.companyName || "Unknown",
                location: selectedJob.job_city || selectedJob.location || "Remote",
                description: selectedJob.job_description || selectedJob.description || "",
                url: selectedJob.job_apply_link || selectedJob.url || ""
            }
        };

        try {
            // Using the assignJob method defined in api.js
            await assignJob(payload);
            alert(`Job assigned successfully to ${userIds.length} users!`);
            setIsModalOpen(false);
        } catch (err) {
            console.error("Assignment Error:", err.response?.data);
            alert("Assignment failed: " + (err.response?.data || "Check console for details"));
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
                    disabled={loading}
                    className="bg-blue-600 text-white px-8 py-3 rounded-lg font-semibold hover:bg-blue-700 disabled:bg-blue-300"
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
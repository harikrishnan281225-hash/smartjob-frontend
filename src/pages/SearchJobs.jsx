import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { searchJobs } from '../services/SearchService';
import { addJob } from '../services/JobService';

const SearchJobs = () => {
    const [query, setQuery] = useState("");
    const [location, setLocation] = useState(""); 
    const [results, setResults] = useState([]);
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

    const handleSearch = async () => {
        if (!query) return;
        setLoading(true);
        try {
            const data = await searchJobs(query, location);
            setResults(data);
        } catch (err) {
            alert("Failed to fetch jobs. Please check your API key or connection.");
        } finally {
            setLoading(false);
        }
    };

    const handleAddJob = async (job) => {
        const user = localStorage.getItem("username") || "anonymous";
        
        // This object maps exactly to the fields in your Spring Boot ApplyRequest DTO
        const jobData = {
            jobId: job.job_id,
            title: job.job_title || "Untitled",
            companyName: job.employer_name || "Unknown",
            status: "Applied",
            location: job.job_city ? `${job.job_city}, ${job.job_country}` : (job.job_country || "Remote"),
            url: job.job_apply_link || "",
            description: job.job_description || "No description provided.",
            salary: job.job_salary || "Not specified",
            skillsRequired: job.job_highlights?.Qualifications?.join(', ') || "Not specified",
            experienceRequired: job.job_required_experience?.required_experience_in_months 
                                ? `${job.job_required_experience.required_experience_in_months} months` 
                                : "Not specified",
            username: user,
            postedDate: new Date().toISOString().split('T')[0]
        };
        
        try {
            await addJob(jobData);
            alert("Job added to your dashboard!");
            navigate('/dashboard');
        } catch (err) {
            console.error("Submission Error:", err);
            alert("Error adding job: " + err.message);
        }
    };

    return (
        <div className="min-h-screen bg-gray-50 px-4 py-8 md:px-8">
            <div className="max-w-6xl mx-auto">
                <header className="flex justify-between items-center mb-8">
                    <div>
                        <h1 className="text-3xl font-bold text-gray-900">Find Opportunities</h1>
                        <p className="text-gray-500">Search for jobs and add them to your board</p>
                    </div>
                    <button 
                        onClick={() => navigate('/dashboard')} 
                        className="px-4 py-2 bg-gray-800 text-white rounded-lg hover:bg-gray-900 transition"
                    >
                        ← Back to Dashboard
                    </button>
                </header>
                
                <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200 flex flex-col md:flex-row gap-4 mb-8">
                    <input 
                        type="text" 
                        value={query} 
                        onChange={(e) => setQuery(e.target.value)} 
                        className="flex-grow p-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                        placeholder="Job title (e.g., Full Stack Developer)"
                    />
                    <input 
                        type="text" 
                        value={location} 
                        onChange={(e) => setLocation(e.target.value)} 
                        className="w-full md:w-1/3 p-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                        placeholder="Location"
                    />
                    <button 
                        onClick={handleSearch} 
                        className="bg-blue-600 text-white px-8 py-3 rounded-lg font-semibold hover:bg-blue-700 transition"
                    >
                        Search
                    </button>
                </div>
                
                {loading ? <p className="text-center text-gray-500">Searching jobs...</p> : (
                    <ul className="space-y-4">
                        {results.map((job) => (
                            <li key={job.job_id} className="bg-white p-6 rounded-xl shadow-sm border border-gray-200 flex justify-between items-center hover:border-blue-500 transition">
                                <div>
                                    <h3 className="font-bold text-lg text-gray-900">{job.job_title}</h3>
                                    <p className="text-gray-600 mb-2">{job.employer_name} • {job.job_city || job.job_country}</p>
                                    <a href={job.job_apply_link} target="_blank" rel="noreferrer" className="text-blue-600 underline text-sm hover:text-blue-800">View Original Posting</a>
                                </div>
                                <button 
                                    onClick={() => handleAddJob(job)} 
                                    className="bg-green-600 text-white px-5 py-2 rounded-lg font-semibold hover:bg-green-700 transition"
                                >
                                    + Add to Dashboard
                                </button>
                            </li>
                        ))}
                    </ul>
                )}
            </div>
        </div>
    );
};

export default SearchJobs;
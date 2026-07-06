import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';

const UserProfile = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const [stats, setStats] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchUserData = async () => {
            try {
                const token = localStorage.getItem('token');
                const res = await axios.get(`http://localhost:8080/api/admin/user-profile-stats/${id}`, {
                    headers: { 'Authorization': `Bearer ${token}` }
                });
                setStats(res.data);
            } catch (err) {
                console.error("Error fetching user profile", err);
            } finally {
                setLoading(false);
            }
        };
        fetchUserData();
    }, [id]);

    if (loading) return <div className="p-8 text-center text-gray-500">Loading profile...</div>;
    if (!stats || !stats.user) return <div className="p-8 text-center text-red-500">User not found.</div>;

    const { user } = stats;

    return (
        <div className="p-8 bg-gray-50 min-h-screen">
            <button onClick={() => navigate(-1)} className="mb-6 text-gray-600 hover:text-blue-600 font-medium">
                &larr; Back to Manage Users
            </button>

            <div className="max-w-3xl bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
                {/* Header Section */}
                <div className="bg-gray-800 p-6 text-white">
                    <h1 className="text-3xl font-bold">{user.fullName || user.username}</h1>
                    <p className="text-gray-300 mt-1">{user.email}</p>
                </div>

                {/* Content Section */}
                <div className="p-6 space-y-8">
                    
                    {/* Portfolio & Socials */}
                    <section>
                        <h2 className="text-sm font-bold text-gray-400 uppercase tracking-wider mb-4">Portfolio & Socials</h2>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                            {user.portfolioUrl && <SocialLink label="Portfolio" url={user.portfolioUrl} />}
                            {user.linkedInUrl && <SocialLink label="LinkedIn" url={user.linkedInUrl} />}
                            {user.githubUrl && <SocialLink label="GitHub" url={user.githubUrl} />}
                            {!user.portfolioUrl && !user.linkedInUrl && !user.githubUrl && <p className="text-gray-400 italic">No links provided.</p>}
                        </div>
                    </section>

                    {/* Resume Section */}
                    <section className="border-t pt-8">
                        <h2 className="text-sm font-bold text-gray-400 uppercase tracking-wider mb-4">Resume</h2>
                        {user.resumePath ? (
                            <div className="flex gap-4">
                                <a href={`http://localhost:8080/${user.resumePath}`} target="_blank" rel="noopener noreferrer" 
                                   className="bg-blue-600 text-white px-6 py-2 rounded-lg font-medium hover:bg-blue-700 transition">
                                    View PDF
                                </a>
                                <a href={`http://localhost:8080/${user.resumePath}`} download 
                                   className="bg-gray-100 text-gray-700 px-6 py-2 rounded-lg font-medium hover:bg-gray-200 transition">
                                    Download PDF
                                </a>
                            </div>
                        ) : (
                            <p className="text-gray-500 italic">No resume uploaded.</p>
                        )}
                    </section>
                </div>
            </div>
        </div>
    );
};

// Simple helper component for consistent links
const SocialLink = ({ label, url }) => (
    <a href={url} target="_blank" rel="noopener noreferrer" 
       className="block p-4 border rounded-lg hover:border-blue-400 hover:bg-blue-50 transition">
        <span className="text-xs text-gray-500 font-semibold uppercase">{label}</span>
        <p className="text-blue-600 font-medium truncate">{url.replace(/^https?:\/\//, '')}</p>
    </a>
);

export default UserProfile;
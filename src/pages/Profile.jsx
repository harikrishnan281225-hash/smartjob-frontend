import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../services/UserService'; 

const Profile = () => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);
    const [formData, setFormData] = useState({ fullName: '', phone: '', bio: '', linkedInUrl: '', githubUrl: '' });
    const [passwords, setPasswords] = useState({ current: '', new: '' });
    const [resume, setResume] = useState(null);
    const [error, setError] = useState(null);
    const navigate = useNavigate();

    useEffect(() => {
        const fetchProfile = async () => {
            try {
                setLoading(true);
                const response = await api.get('/profile/me');
                setUser(response.data);
                setFormData({
                    fullName: response.data.fullName || '',
                    phone: response.data.phone || '',
                    bio: response.data.bio || '',
                    linkedInUrl: response.data.linkedInUrl || '',
                    githubUrl: response.data.githubUrl || ''
                });
            } catch (err) {
                setError("Could not load profile.");
            } finally {
                setLoading(false);
            }
        };
        fetchProfile();
    }, [navigate]);

    const handleUpdatePortfolio = async (e) => {
        e.preventDefault();
        try {
            await api.put('/profile/details', formData);
            alert("Portfolio updated successfully!");
        } catch (err) { alert("Failed to update profile."); }
    };

    const handleUpload = async () => {
        if (!resume) return alert("Please select a file first.");
        const data = new FormData();
        data.append('file', resume);
        try {
            await api.post('/profile/upload-resume', data);
            alert("Resume uploaded successfully!");
        } catch (err) { 
            console.error(err);
            alert("Upload failed."); 
        }
    };

    const handlePasswordChange = async (e) => {
        e.preventDefault();
        try {
            await api.put('/profile/password', { currentPassword: passwords.current, newPassword: passwords.new });
            alert("Password updated!");
            setPasswords({ current: '', new: '' });
        } catch (err) { alert("Failed to update password."); }
    };

    if (loading) return <div className="min-h-screen flex items-center justify-center">Loading...</div>;
    if (error) return <div className="min-h-screen flex items-center justify-center text-red-600 font-bold">{error}</div>;

    return (
        <div className="min-h-screen bg-slate-50 p-6 md:p-10">
            <div className="max-w-5xl mx-auto">
                {/* Header */}
                <div className="flex justify-between items-center mb-8">
                    <div>
                        <h1 className="text-3xl font-black text-slate-900">Manage Portfolio</h1>
                        <p className="text-slate-500 font-medium">Update your professional profile details</p>
                    </div>
                    <button 
                        onClick={() => navigate('/dashboard')} 
                        className="px-5 py-2.5 bg-white border border-slate-200 text-slate-700 rounded-xl hover:bg-slate-100 transition font-semibold"
                    >
                        ← Back to Dashboard
                    </button>
                </div>

                <div className="grid md:grid-cols-2 gap-8">
                    {/* Professional Details Section */}
                    <form onSubmit={handleUpdatePortfolio} className="bg-white p-8 rounded-3xl shadow-sm border border-slate-100">
                        <h2 className="text-lg font-bold text-slate-800 mb-6 flex items-center gap-2">
                            <span className="w-1.5 h-6 bg-indigo-600 rounded-full"></span>
                            Professional Details
                        </h2>
                        <div className="space-y-4">
                            <input type="text" placeholder="Full Name" className="w-full p-3 bg-slate-50 rounded-xl border border-slate-200 focus:ring-2 focus:ring-indigo-500 outline-none" value={formData.fullName} onChange={(e) => setFormData({...formData, fullName: e.target.value})} />
                            <input type="tel" placeholder="Phone Number" className="w-full p-3 bg-slate-50 rounded-xl border border-slate-200 focus:ring-2 focus:ring-indigo-500 outline-none" value={formData.phone} onChange={(e) => setFormData({...formData, phone: e.target.value})} />
                            <textarea placeholder="Professional Bio" rows="4" className="w-full p-3 bg-slate-50 rounded-xl border border-slate-200 focus:ring-2 focus:ring-indigo-500 outline-none" value={formData.bio} onChange={(e) => setFormData({...formData, bio: e.target.value})} />
                            <input type="url" placeholder="LinkedIn URL" className="w-full p-3 bg-slate-50 rounded-xl border border-slate-200 focus:ring-2 focus:ring-indigo-500 outline-none" value={formData.linkedInUrl} onChange={(e) => setFormData({...formData, linkedInUrl: e.target.value})} />
                            <input type="url" placeholder="GitHub URL" className="w-full p-3 bg-slate-50 rounded-xl border border-slate-200 focus:ring-2 focus:ring-indigo-500 outline-none" value={formData.githubUrl} onChange={(e) => setFormData({...formData, githubUrl: e.target.value})} />
                            <button type="submit" className="w-full py-3 bg-indigo-600 text-white rounded-xl hover:bg-indigo-700 font-bold transition shadow-lg shadow-indigo-200 mt-2">
                                Save Portfolio
                            </button>
                        </div>
                    </form>

                    {/* Side Panel: Resume & Security */}
                    <div className="space-y-8">
                        {/* Resume Upload */}
                        <div className="bg-white p-8 rounded-3xl shadow-sm border border-slate-100">
                            <h2 className="text-lg font-bold text-slate-800 mb-6 flex items-center gap-2">
                                <span className="w-1.5 h-6 bg-emerald-500 rounded-full"></span>
                                Resume
                            </h2>
                            <div className="border-2 border-dashed border-slate-200 rounded-2xl p-6 text-center">
                                <input type="file" className="text-sm text-slate-500" onChange={(e) => setResume(e.target.files[0])} />
                            </div>
                            <button onClick={handleUpload} className="w-full mt-4 py-3 bg-emerald-600 text-white rounded-xl hover:bg-emerald-700 font-bold text-sm transition">
                                Upload Resume
                            </button>
                        </div>

                        {/* Password Change */}
                        <form onSubmit={handlePasswordChange} className="bg-white p-8 rounded-3xl shadow-sm border border-slate-100">
                            <h2 className="text-lg font-bold text-slate-800 mb-6 flex items-center gap-2">
                                <span className="w-1.5 h-6 bg-red-500 rounded-full"></span>
                                Change Password
                            </h2>
                            <div className="space-y-4">
                                <input type="password" placeholder="Current Password" className="w-full p-3 bg-slate-50 rounded-xl border border-slate-200 focus:ring-2 focus:ring-red-200 outline-none" value={passwords.current} onChange={(e) => setPasswords({...passwords, current: e.target.value})} />
                                <input type="password" placeholder="New Password" className="w-full p-3 bg-slate-50 rounded-xl border border-slate-200 focus:ring-2 focus:ring-red-200 outline-none" value={passwords.new} onChange={(e) => setPasswords({...passwords, new: e.target.value})} />
                                <button type="submit" className="w-full py-3 bg-red-600 text-white rounded-xl hover:bg-red-700 font-bold transition shadow-lg shadow-red-100">
                                    Update Password
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Profile;
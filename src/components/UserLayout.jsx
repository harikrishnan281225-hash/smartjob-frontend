import React, { useEffect, useState } from 'react';
import { NavLink, useNavigate, useLocation } from 'react-router-dom';
import { getMyMessages, getAssignedJobs } from "../services/api";

const UserLayout = ({ children }) => {
    const navigate = useNavigate();
    const location = useLocation();
    const [unreadCount, setUnreadCount] = useState(0);
    const [unreadJobCount, setUnreadJobCount] = useState(0);

    const fetchCounts = async () => {
        // 1. Fetch Messages safely
        try {
            const msgRes = await getMyMessages();
            // Assuming the backend returns 200 OK with an empty array if no messages exist
            if (msgRes && Array.isArray(msgRes.data)) {
                const unread = msgRes.data.filter(msg => msg.read === false).length;
                setUnreadCount(unread);
            }
        } catch (error) {
            // Silently fail if 404/400 (likely no data yet)
            console.log("Info: No messages or unauthorized access to messages.");
        }

        // 2. Fetch Assigned Jobs safely
        try {
            const jobRes = await getAssignedJobs();
            setUnreadJobCount(Array.isArray(jobRes.data) ? jobRes.data.length : 0);
        } catch (error) {
            console.log("Info: No assigned jobs or unauthorized access to jobs.");
        }
    };

    useEffect(() => {
        fetchCounts();
    }, [location.pathname]); // Only refetch when path changes

    useEffect(() => {
        const handleMsgEvent = () => fetchCounts();
        const handleJobEvent = () => fetchCounts();

        window.addEventListener('messageRead', handleMsgEvent);
        window.addEventListener('jobUpdate', handleJobEvent);

        return () => {
            window.removeEventListener('messageRead', handleMsgEvent);
            window.removeEventListener('jobUpdate', handleJobEvent);
        };
    }, []);

    const handleLogout = () => {
        localStorage.clear();
        navigate('/login');
    };

    const getNavLinkClass = ({ isActive }) => 
        `block p-2 rounded transition ${isActive ? 'bg-blue-600 text-white' : 'hover:bg-gray-800'}`;

    return (
        <div className="flex">
            <aside className="w-64 bg-gray-900 text-white min-h-screen p-6 shadow-xl">
                <h1 className="text-2xl font-bold mb-10 tracking-wider">Job Portal</h1>
                <nav className="space-y-4">
                    <NavLink to="/dashboard" className={getNavLinkClass}>Dashboard</NavLink>
                    <NavLink to="/search-jobs" className={getNavLinkClass}>Search Jobs</NavLink>
                    
                    <NavLink to="/job-inbox" className={getNavLinkClass}>
                        <div className="flex justify-between items-center">
                            <span>Job Inbox</span>
                            {unreadJobCount > 0 && (
                                <span className="bg-yellow-500 text-white text-[10px] font-bold px-2 py-0.5 rounded-full animate-bounce">
                                    {unreadJobCount}
                                </span>
                            )}
                        </div>
                    </NavLink>

                    <NavLink to="/inbox" className={getNavLinkClass}>
                        <div className="flex justify-between items-center">
                            <span>Messages</span>
                            {unreadCount > 0 && (
                                <span className="bg-red-500 text-white text-[10px] font-bold px-2 py-0.5 rounded-full animate-bounce">
                                    {unreadCount}
                                </span>
                            )}
                        </div>
                    </NavLink>

                    <NavLink to="/profile" className={getNavLinkClass}>Profile</NavLink>
                    
                    <div className="pt-8 border-t border-gray-800">
                        <button 
                            onClick={handleLogout} 
                            className="w-full text-left p-2 text-red-400 hover:bg-red-900/30 rounded transition"
                        >
                            Logout
                        </button>
                    </div>
                </nav>
            </aside>
            
            <main className="flex-1 p-8 bg-gray-50 min-h-screen">
                {children}
            </main>
        </div>
    );
};

export default UserLayout;
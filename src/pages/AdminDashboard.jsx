import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import StatCard from '../components/StatCard';
import JobStatusChart from '../components/JobStatusChart';
import RecentActivity from '../components/RecentActivity';
import api from '../services/api';

const AdminDashboard = () => {
    const navigate = useNavigate();
    const [stats, setStats] = useState({
        totalUsers: 0,
        totalJobs: 0,
        pendingAssignments: 0,
        unreadMessages: 0
    });

    useEffect(() => {
        const fetchDashboardData = async () => {
            try {
                const res = await api.get('/admin/dashboard-stats');
                setStats(res.data);
            } catch (err) {
                console.error("Failed to load dashboard data", err);
            }
        };
        fetchDashboardData();
    }, []);

    return (
        <div className="p-8">
            <header className="mb-8 flex justify-between items-center">
                <h1 className="text-3xl font-bold text-gray-800">Admin Dashboard</h1>
                <button 
                    onClick={() => { localStorage.clear(); navigate('/login'); }} 
                    className="bg-red-600 text-white px-4 py-2 rounded shadow hover:bg-red-700 transition"
                >
                    Logout
                </button>
            </header>

            {/* KPI Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                <StatCard title="Total Users" value={stats.totalUsers} color="blue" />
                <StatCard title="Total Jobs Posted" value={stats.totalJobs} color="green" />
                <StatCard title="Pending Assignments" value={stats.pendingAssignments} color="yellow" />
                <StatCard title="Unread Messages" value={stats.unreadMessages} color="red" />
            </div>

            {/* Main Content Area */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
                
                {/* Left Column: Job Overview - Height increased to match the right column total height */}
                <div className="lg:col-span-2 bg-white p-6 rounded-lg shadow h-[520px]">
                    <h2 className="text-xl font-semibold text-gray-700 mb-4">Job Status Overview</h2>
                    <JobStatusChart />
                </div>

                {/* Right Column: Assignment Queue + Recent Activity */}
                <div className="flex flex-col gap-8">
                    <div className="bg-white p-6 rounded-lg shadow">
                        <h2 className="text-xl font-semibold text-gray-700 mb-4">Assignment Queue</h2>
                        <Link 
                            to="/admin/search-jobs" 
                            className="block w-full text-center bg-blue-600 text-white py-2 rounded hover:bg-blue-700 transition"
                        >
                            Go to Assignment Portal
                        </Link>
                    </div>

                    <div className="bg-white p-6 rounded-lg shadow">
                        <RecentActivity />
                    </div>
                </div>
                
            </div>
        </div>
    );
};

export default AdminDashboard;
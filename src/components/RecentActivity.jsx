import React, { useEffect, useState } from 'react';
import api from '../services/api';

const RecentActivity = () => {
    const [activities, setActivities] = useState([]);

    useEffect(() => {
        const fetchActivity = async () => {
            try {
                const res = await api.get('/admin/recent-activity');
                setActivities(res.data);
            } catch (err) {
                console.error("Failed to load activity", err);
            }
        };
        fetchActivity();
    }, []);

    return (
        <div className="bg-white p-6 rounded-lg shadow mt-6">
            <h2 className="text-xl font-semibold text-gray-700 mb-4">Recent Activity</h2>
            <ul className="space-y-3">
                {activities.length > 0 ? (
                    activities.map((act, idx) => (
                        // Changed rendering to access the flat fields from ApplicationDTO
                        <li key={act.id || idx} className="text-sm text-gray-600 border-b pb-2 last:border-0">
                            <span className="text-blue-500 font-medium">• </span> 
                            <strong>{act.userName || "User"}</strong> applied to 
                            <span className="italic"> {act.jobTitle || "a job"}</span>
                        </li>
                    ))
                ) : (
                    <li className="text-sm text-gray-400">No recent activity found.</li>
                )}
            </ul>
        </div>
    );
};

export default RecentActivity;
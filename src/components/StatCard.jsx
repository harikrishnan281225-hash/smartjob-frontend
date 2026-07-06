// src/components/StatCard.jsx
import React from 'react';

const StatCard = ({ title, value, color }) => {
    const colorClasses = {
        blue: "bg-blue-50 text-blue-600 border-blue-200",
        green: "bg-green-50 text-green-600 border-green-200",
        yellow: "bg-yellow-50 text-yellow-600 border-yellow-200",
        red: "bg-red-50 text-red-600 border-red-200"
    };

    return (
        <div className={`p-6 rounded-lg border shadow-sm ${colorClasses[color] || colorClasses.blue}`}>
            <h3 className="text-sm font-semibold opacity-80">{title}</h3>
            <p className="text-3xl font-bold mt-2">{value ?? 0}</p>
        </div>
    );
};

export default StatCard;
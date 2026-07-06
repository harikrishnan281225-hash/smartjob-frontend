// src/components/JobStatusChart.jsx
import React, { useEffect, useState } from 'react';
import { Bar } from 'react-chartjs-2';
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend } from 'chart.js';
import api from '../services/api';

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

const JobStatusChart = () => {
    const [chartData, setChartData] = useState({ labels: [], datasets: [] });

    useEffect(() => {
        const fetchJobStats = async () => {
            const res = await api.get('/admin/job-stats'); // The new endpoint
            const data = res.data;
            setChartData({
                labels: Object.keys(data),
                datasets: [{ label: 'Jobs by Status', data: Object.values(data), backgroundColor: '#3b82f6' }]
            });
        };
        fetchJobStats();
    }, []);

    return <div className="bg-white p-6 rounded shadow"><Bar data={chartData} /></div>;
};

export default JobStatusChart;
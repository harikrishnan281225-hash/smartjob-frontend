import React, { useEffect, useState, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../services/api';
import { deleteJob, updateJobStatus } from '../services/JobService';
import { DragDropContext, Droppable, Draggable } from '@hello-pangea/dnd';
import { 
    BarChart, Bar, XAxis, Tooltip, ResponsiveContainer, Cell,
    PieChart, Pie, AreaChart, Area
} from 'recharts';

const Dashboard = () => {
    const [jobs, setJobs] = useState([]);
    const [loading, setLoading] = useState(true);
    const [expandedColumns, setExpandedColumns] = useState({});
    const [searchTerm, setSearchTerm] = useState(""); 
    const [activeFilter, setActiveFilter] = useState("All");
    const [sortBy, setSortBy] = useState("newest"); 
    const navigate = useNavigate();

    const isAdmin = localStorage.getItem('role') === 'ADMIN';

    // Must match Backend Enum values exactly
    const statuses = ["APPLIED", "INTERVIEWING", "OFFER", "REJECTED"];
    const statusColors = {
        "APPLIED": "border-blue-500",
        "INTERVIEWING": "border-yellow-500",
        "OFFER": "border-green-500",
        "REJECTED": "border-red-500"
    };

    const chartData = statuses.map(s => ({
        name: s,
        count: jobs.filter(j => j.status === s).length
    }));
    const barColors = ['#3b82f6', '#eab308', '#22c55e', '#ef4444'];

    const toggleColumn = (status) => {
        setExpandedColumns(prev => ({ ...prev, [status]: !prev[status] }));
    };

    const filteredJobs = jobs
        .filter(job => {
            const matchesSearch = job.title.toLowerCase().includes(searchTerm.toLowerCase()) || 
                                  job.companyName.toLowerCase().includes(searchTerm.toLowerCase());
            const matchesFilter = activeFilter === "All" || job.status === activeFilter;
            return matchesSearch && matchesFilter;
        })
        .sort((a, b) => {
            if (sortBy === "newest") return b.id - a.id;
            if (sortBy === "oldest") return a.id - b.id;
            if (sortBy === "title") return a.title.localeCompare(b.title);
            return 0;
        });

    const fetchAllJobs = useCallback(async () => {
        setLoading(true);
        try {
            const response = await api.get('/jobs/my-jobs');
            setJobs(Array.isArray(response.data) ? response.data : []);
        } catch (err) {
            if (err.response?.status === 403) navigate('/login');
            console.error("Fetch error:", err);
        } finally {
            setLoading(false);
        }
    }, [navigate]);

    useEffect(() => {
        if (!localStorage.getItem('token')) { navigate('/login'); return; }
        fetchAllJobs();

        // Sync with other components
        window.addEventListener('jobUpdate', fetchAllJobs);
        return () => window.removeEventListener('jobUpdate', fetchAllJobs);
    }, [fetchAllJobs]);

    const handleLogout = () => {
        localStorage.removeItem('token');
        localStorage.removeItem('role');
        navigate('/login');
    };

    const onDragEnd = async (result) => {
        if (!result.destination) return;
        const { draggableId, destination } = result;
        const newStatus = destination.droppableId;
        const originalJobs = [...jobs];

        setJobs(jobs.map(job => String(job.id) === String(draggableId) ? { ...job, status: newStatus } : job));
        try {
            await updateJobStatus(draggableId, newStatus);
        } catch (err) {
            alert("Failed to update status.");
            setJobs(originalJobs);
        }
    };

    const handleDelete = async (id) => {
        if (window.confirm("Delete this application?")) {
            await deleteJob(id);
            setJobs(jobs.filter(job => job.id !== id));
        }
    };

    return (
        <div className="min-h-screen bg-slate-50 p-6 md:p-10">
            <div className="max-w-7xl mx-auto">
                <header className="mb-10 flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                    <div>
                        <h1 className="text-4xl font-black text-slate-900 tracking-tight">My Dashboard</h1>
                        <p className="text-slate-500 font-medium">Track and visualize your career progress</p>
                    </div>
                    <div className="flex gap-3">
                        {isAdmin && (
                            <button onClick={() => navigate('/admin')} className="px-5 py-2.5 bg-purple-600 text-white rounded-xl hover:bg-purple-700 transition font-bold shadow-lg shadow-purple-200">
                                Admin Panel
                            </button>
                        )}
                        <button onClick={() => navigate('/search-jobs')} className="px-5 py-2.5 bg-white border border-slate-200 text-slate-700 rounded-xl hover:bg-slate-100 transition font-semibold">Search</button>
                        <button onClick={() => navigate('/profile')} className="px-5 py-2.5 bg-white border border-slate-200 text-slate-700 rounded-xl hover:bg-slate-100 transition font-semibold">My Profile</button>
                        <button onClick={handleLogout} className="px-5 py-2.5 bg-red-50 text-red-600 rounded-xl hover:bg-red-100 transition font-semibold">Logout</button>
                        <button onClick={() => navigate('/add-job')} className="px-5 py-2.5 bg-indigo-600 text-white rounded-xl hover:bg-indigo-700 shadow-lg shadow-indigo-200 transition font-bold">+ Add Job</button>
                    </div>
                </header>

                {/* --- Charts --- */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8 h-64">
                    <div className="bg-white p-6 rounded-3xl shadow-sm border border-slate-100">
                        <h3 className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2">Status Distribution</h3>
                        <ResponsiveContainer width="100%" height="85%">
                            <BarChart data={chartData}>
                                <XAxis dataKey="name" hide />
                                <Tooltip />
                                <Bar dataKey="count">{chartData.map((e, i) => <Cell key={i} fill={barColors[i]} />)}</Bar>
                            </BarChart>
                        </ResponsiveContainer>
                    </div>
                    <div className="bg-white p-6 rounded-3xl shadow-sm border border-slate-100">
                        <h3 className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2">Status Ratio</h3>
                        <ResponsiveContainer width="100%" height="85%">
                            <PieChart>
                                <Pie data={chartData} innerRadius={40} outerRadius={60} dataKey="count">
                                    {chartData.map((e, i) => <Cell key={i} fill={barColors[i]} />)}
                                </Pie>
                                <Tooltip />
                            </PieChart>
                        </ResponsiveContainer>
                    </div>
                    <div className="bg-white p-6 rounded-3xl shadow-sm border border-slate-100">
                        <h3 className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2">App Trend</h3>
                        <ResponsiveContainer width="100%" height="85%">
                            <AreaChart data={chartData}>
                                <Area type="monotone" dataKey="count" stroke="#6366f1" fill="#e0e7ff" />
                                <Tooltip />
                            </AreaChart>
                        </ResponsiveContainer>
                    </div>
                </div>

                {/* --- Search and Filter --- */}
                <div className="flex flex-col md:flex-row gap-4 mb-8">
                    <input 
                        type="text"
                        placeholder="Search by title or company..."
                        className="flex-grow p-4 rounded-2xl border border-slate-200 shadow-sm focus:ring-2 focus:ring-indigo-500 outline-none"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                    />
                    <div className="flex gap-2 overflow-x-auto pb-2 md:pb-0">
                        {["All", ...statuses].map((filter) => (
                            <button
                                key={filter}
                                onClick={() => setActiveFilter(filter)}
                                className={`px-4 py-2 rounded-full text-sm font-bold transition-all whitespace-nowrap ${
                                    activeFilter === filter ? "bg-indigo-600 text-white shadow-md" : "bg-white border border-slate-200 text-slate-600 hover:border-indigo-300"
                                }`}
                            >
                                {filter}
                            </button>
                        ))}
                    </div>
                    <select value={sortBy} onChange={(e) => setSortBy(e.target.value)} className="px-4 py-2 bg-white border border-slate-200 rounded-xl text-sm font-semibold text-slate-700 outline-none cursor-pointer">
                        <option value="newest">Newest</option>
                        <option value="oldest">Oldest</option>
                        <option value="title">Title (A-Z)</option>
                    </select>
                </div>

                {/* --- Drag and Drop --- */}
                <DragDropContext onDragEnd={onDragEnd}>
                    <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                        {statuses.map((status) => {
                            const columnJobs = filteredJobs.filter(j => j.status === status);
                            const displayJobs = expandedColumns[status] ? columnJobs : columnJobs.slice(0, 3);
                            return (
                                <Droppable key={status} droppableId={status}>
                                    {(provided, snapshot) => (
                                        <div {...provided.droppableProps} ref={provided.innerRef} className={`p-4 rounded-3xl transition-colors ${snapshot.isDraggingOver ? 'bg-indigo-50 border-2 border-dashed border-indigo-200' : 'bg-slate-200/30'}`}>
                                            <h3 className="text-[10px] font-black text-slate-500 mb-4 uppercase tracking-widest px-2">{status} ({columnJobs.length})</h3>
                                            {columnJobs.length > 0 ? (
                                                displayJobs.map((job, index) => (
                                                    <Draggable key={job.id} draggableId={String(job.id)} index={index}>
                                                        {(provided) => (
                                                            <div ref={provided.innerRef} {...provided.draggableProps} {...provided.dragHandleProps} className={`bg-white p-4 mb-3 rounded-2xl shadow-sm border-l-4 ${statusColors[status]}`}>
                                                                <h4 className="font-bold text-slate-800 text-sm leading-tight truncate">{job.title}</h4>
                                                                <p className="text-[10px] text-slate-400 font-bold uppercase mt-1">{job.companyName}</p>
                                                                <div className="flex justify-between items-center pt-3 mt-3 border-t border-slate-50">
                                                                    <a href={job.url} target="_blank" rel="noreferrer" className="text-[9px] font-black text-indigo-600">VIEW</a>
                                                                    <button onClick={() => handleDelete(job.id)} className="text-[9px] font-black text-slate-300 hover:text-red-500">DELETE</button>
                                                                </div>
                                                            </div>
                                                        )}
                                                    </Draggable>
                                                ))
                                            ) : (
                                                <div className="py-10 border-2 border-dashed border-slate-300 rounded-2xl flex flex-col items-center text-center px-4">
                                                    <p className="text-[11px] font-bold text-slate-400">No {status.toLowerCase()} jobs</p>
                                                </div>
                                            )}
                                            {provided.placeholder}
                                            {columnJobs.length > 3 && (
                                                <button onClick={() => toggleColumn(status)} className="w-full text-[10px] font-bold text-slate-500 hover:text-indigo-600 py-2 mt-1">
                                                    {expandedColumns[status] ? "Show Less" : `See All (${columnJobs.length})`}
                                                </button>
                                            )}
                                        </div>
                                    )}
                                </Droppable>
                            );
                        })}
                    </div>
                </DragDropContext>
            </div>
        </div>
    );
};

export default Dashboard;
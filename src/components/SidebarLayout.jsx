import React from 'react';
import { useNavigate, Link, useLocation } from 'react-router-dom';

const SidebarLayout = ({ children }) => {
    const navigate = useNavigate();
    const location = useLocation();

    const handleLogout = () => {
        localStorage.clear();
        navigate('/login');
    };

    const navItems = [
        { name: 'Dashboard', path: '/admin/dashboard' },
        { name: 'Manage Users', path: '/admin/manage-users' },
        { name: 'Search & Assign', path: '/admin/search-jobs' },
        { name: 'Inbox', path: '/admin/inbox' },
        { name: 'Post New Job', path: '/admin/post-job' },
    ];

    return (
        <div className="flex h-screen bg-gray-100">
            {/* Sidebar */}
            <aside className="w-64 bg-gray-900 text-white flex flex-col shadow-xl">
                <div className="p-6 text-xl font-bold border-b border-gray-800">
                    Admin Portal
                </div>
                
                <nav className="flex-grow py-4">
                    {navItems.map((item) => (
                        <Link
                            key={item.name}
                            to={item.path}
                            className={`block py-3 px-6 transition-colors ${
                                location.pathname === item.path 
                                ? 'bg-blue-600 text-white' 
                                : 'text-gray-400 hover:bg-gray-800 hover:text-white'
                            }`}
                        >
                            {item.name}
                        </Link>
                    ))}
                </nav>

                <div className="p-4 border-t border-gray-800">
                    <button 
                        onClick={handleLogout} 
                        className="w-full text-left text-red-400 hover:text-red-300 px-2 font-medium"
                    >
                        Logout
                    </button>
                </div>
            </aside>
            
            {/* Main Content Area */}
            <main className="flex-grow p-8 overflow-y-auto bg-gray-50">
                {children}
            </main>
        </div>
    );
};

export default SidebarLayout;
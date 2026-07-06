import React, { useEffect, useState } from 'react';
import { getAllUsers, deleteUser, sendBroadcast, sendMessage } from '../services/api'; 
import { useNavigate } from 'react-router-dom';

const ManageUsers = () => {
    const [users, setUsers] = useState([]);
    const [searchTerm, setSearchTerm] = useState('');
    const [selectedUserIds, setSelectedUserIds] = useState([]);
    
    const [isMessageModalOpen, setIsMessageModalOpen] = useState(false);
    const [messageContent, setMessageContent] = useState('');
    const [targetUser, setTargetUser] = useState(null);
    
    const navigate = useNavigate();

    useEffect(() => { fetchUsers(); }, []);

    const fetchUsers = async () => {
        try {
            const response = await getAllUsers();
            setUsers(Array.isArray(response.data) ? response.data : []);
        } catch (error) { console.error("Error loading users", error); }
    };

    const handleDelete = async (userId) => {
        if (!window.confirm("Are you sure you want to delete this user?")) return;
        try {
            await deleteUser(userId);
            fetchUsers();
        } catch (err) { alert("Failed to delete user."); }
    };

    const toggleUserSelection = (userId) => {
        setSelectedUserIds(prev => 
            prev.includes(userId) ? prev.filter(id => id !== userId) : [...prev, userId]
        );
    };

    const handleSendAction = async () => {
        try {
            if (targetUser) {
                await sendMessage({ receiverId: targetUser.id, content: messageContent });
            } else {
                await sendBroadcast({ userIds: selectedUserIds, content: messageContent });
                setSelectedUserIds([]);
            }
            setIsMessageModalOpen(false);
            setMessageContent('');
            setTargetUser(null);
            alert("Message sent!");
        } catch (err) { alert("Action failed."); }
    };

    const filteredUsers = users.filter(user => 
        (user.username?.toLowerCase() || "").includes(searchTerm.toLowerCase()) ||
        (user.email?.toLowerCase() || "").includes(searchTerm.toLowerCase())
    );

    return (
        <div className="p-6 bg-gray-50 min-h-screen">
            {/* Header Area */}
            <div className="flex justify-between items-end mb-8">
                <div>
                    <h1 className="text-4xl font-black text-gray-900 tracking-tight">User Registry</h1>
                    <p className="text-gray-500 mt-2 font-medium">Manage your portal's user base and communication.</p>
                </div>
                <div className="bg-white px-6 py-3 rounded-xl border border-gray-200 shadow-sm">
                    <span className="text-gray-500 text-sm font-semibold uppercase">Total Users</span>
                    <p className="text-3xl font-bold text-blue-600">{users.length}</p>
                </div>
            </div>
            
            {/* Toolbar */}
            <div className="mb-6 flex gap-4 items-center bg-white p-2 rounded-2xl shadow-sm border border-gray-100">
                <input 
                    type="text" 
                    placeholder="Filter users by name or email..." 
                    className="w-full bg-transparent p-3 outline-none text-gray-700" 
                    onChange={(e) => setSearchTerm(e.target.value)} 
                />
                {selectedUserIds.length > 0 && (
                    <button onClick={() => { setTargetUser(null); setIsMessageModalOpen(true); }} className="bg-blue-600 text-white px-8 py-3 rounded-xl font-bold hover:bg-blue-700 transition shadow-lg shadow-blue-200">
                        Broadcast ({selectedUserIds.length})
                    </button>
                )}
            </div>

            {/* Table */}
            <div className="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden">
                <table className="w-full">
                    <thead className="bg-gray-50">
                        <tr className="text-left text-gray-400 uppercase text-xs tracking-widest font-bold">
                            <th className="p-6">Select</th>
                            <th className="p-6">User Details</th>
                            <th className="p-6 text-center">Actions</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-100">
                        {filteredUsers.map(user => (
                            <tr key={user.id} className="hover:bg-blue-50/30 transition group">
                                <td className="p-6"><input type="checkbox" className="w-5 h-5 rounded border-gray-300" onChange={() => toggleUserSelection(user.id)} /></td>
                                <td className="p-6">
                                    <p className="font-bold text-gray-900">{user.username}</p>
                                    <p className="text-gray-500 text-sm">{user.email}</p>
                                </td>
                                <td className="p-6 flex justify-center gap-3">
                                    <button onClick={() => navigate(`/admin/user-profile/${user.id}`)} className="bg-gray-100 text-gray-700 px-4 py-2 rounded-lg font-semibold hover:bg-gray-200 text-sm">View Profile</button>
                                    <button onClick={() => { setTargetUser(user); setIsMessageModalOpen(true); }} className="bg-blue-50 text-blue-600 px-4 py-2 rounded-lg font-semibold hover:bg-blue-100 text-sm">Message</button>
                                    <button onClick={() => handleDelete(user.id)} className="bg-red-50 text-red-600 px-4 py-2 rounded-lg font-semibold hover:bg-red-100 text-sm">Delete</button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            {/* Modal */}
            {isMessageModalOpen && (
                <div className="fixed inset-0 bg-gray-900/40 backdrop-blur-sm flex items-center justify-center p-4">
                    <div className="bg-white p-8 rounded-3xl shadow-2xl w-full max-w-lg border border-gray-100">
                        <h2 className="text-2xl font-black mb-6">{targetUser ? "Direct Message" : "New Broadcast"}</h2>
                        <textarea className="w-full p-4 bg-gray-50 rounded-2xl mb-6 outline-none focus:ring-2 ring-blue-500" rows="5" value={messageContent} onChange={(e) => setMessageContent(e.target.value)} placeholder="What would you like to send?" />
                        <div className="flex justify-end gap-3">
                            <button onClick={() => setIsMessageModalOpen(false)} className="px-6 py-3 font-bold text-gray-500">Cancel</button>
                            <button onClick={handleSendAction} className="px-8 py-3 bg-blue-600 text-white rounded-2xl font-bold hover:bg-blue-700">Send Message</button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default ManageUsers;
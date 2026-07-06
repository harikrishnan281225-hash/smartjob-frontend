import React, { useState, useEffect } from 'react';

/**
 * UserSelectionModal component
 * Handles selection of multiple users for job assignment.
 */
const UserSelectionModal = ({ isOpen, onClose, users, onConfirm, initialSelectedIds = [] }) => {
    const [selectedIds, setSelectedIds] = useState(initialSelectedIds);
    const [searchTerm, setSearchTerm] = useState('');

    // Updated useEffect: Using JSON.stringify ensures the effect only runs 
    // when the CONTENT of the initialSelectedIds array actually changes,
    // preventing infinite loops caused by new object references.
    useEffect(() => {
        if (isOpen) {
            setSelectedIds(initialSelectedIds);
        }
    }, [isOpen, JSON.stringify(initialSelectedIds)]); 

    // If modal is closed, return null to remove it from the DOM
    if (!isOpen) return null;

    const toggleUser = (id) => {
        setSelectedIds(prev => 
            prev.includes(id) ? prev.filter(uid => uid !== id) : [...prev, id]
        );
    };

    // Filter logic for search bar
    const filteredUsers = users.filter(user => 
        (user.username && user.username.toLowerCase().includes(searchTerm.toLowerCase())) || 
        (user.email && user.email.toLowerCase().includes(searchTerm.toLowerCase()))
    );

    return (
        <div className="fixed inset-0 bg-gray-900/50 backdrop-blur-sm flex items-center justify-center p-4 z-50">
            <div className="bg-white rounded-2xl shadow-2xl w-full max-w-lg overflow-hidden animate-in fade-in zoom-in duration-200">
                {/* Header */}
                <div className="p-6 border-b border-gray-100">
                    <h2 className="text-xl font-bold text-gray-900">Select Users to Assign</h2>
                    <p className="text-sm text-gray-500">Pick users from the list to assign this job</p>
                </div>

                {/* Search Bar */}
                <div className="px-6 py-4 bg-gray-50">
                    <input 
                        type="text" 
                        placeholder="Search by name or email..." 
                        className="w-full p-3 rounded-xl border border-gray-200 outline-none focus:ring-2 focus:ring-blue-500 transition-all"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                    />
                </div>

                {/* User List */}
                <div className="max-h-72 overflow-y-auto px-2 py-2">
                    {filteredUsers.length > 0 ? (
                        filteredUsers.map(user => (
                            <div 
                                key={user.id} 
                                onClick={() => toggleUser(user.id)}
                                className={`flex items-center gap-4 p-3 rounded-xl cursor-pointer transition-all ${
                                    selectedIds.includes(user.id) ? 'bg-blue-50 ring-1 ring-blue-200' : 'hover:bg-gray-50'
                                }`}
                            >
                                <input 
                                    type="checkbox" 
                                    checked={selectedIds.includes(user.id)} 
                                    readOnly
                                    className="w-5 h-5 rounded border-gray-300 text-blue-600 focus:ring-blue-500 cursor-pointer"
                                />
                                <div className="flex flex-col">
                                    <span className="font-semibold text-gray-800">{user.username}</span>
                                    <span className="text-xs text-gray-500">{user.email}</span>
                                </div>
                            </div>
                        ))
                    ) : (
                        <div className="p-8 text-center text-gray-400">
                            <p>No users found matching "{searchTerm}"</p>
                        </div>
                    )}
                </div>

                {/* Footer */}
                <div className="p-6 border-t border-gray-100 flex justify-end gap-3">
                    <button 
                        type="button"
                        onClick={onClose} 
                        className="px-5 py-2.5 text-gray-600 font-medium hover:bg-gray-100 rounded-xl transition"
                    >
                        Cancel
                    </button>
                    <button 
                        type="button"
                        onClick={() => { onConfirm(selectedIds); onClose(); }} 
                        className="px-6 py-2.5 bg-blue-600 text-white font-bold rounded-xl hover:bg-blue-700 transition-all shadow-lg shadow-blue-200"
                    >
                        Confirm Selection ({selectedIds.length})
                    </button>
                </div>
            </div>
        </div>
    );
};

export default UserSelectionModal;
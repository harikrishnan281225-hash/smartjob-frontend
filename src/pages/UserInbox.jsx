import React, { useEffect, useState } from 'react';
import { getMyMessages, markMessageAsRead } from '../services/api';

const UserInbox = () => {
    const [messages, setMessages] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchMessages();
    }, []);

    const fetchMessages = async () => {
        setLoading(true);
        try {
            const response = await getMyMessages();
            // Safety check: ensure response.data exists and is an array
            const data = Array.isArray(response.data) ? response.data : [];
            const sorted = data.sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp));
            setMessages(sorted);
        } catch (error) {
            console.error("Error fetching messages", error);
        } finally {
            setLoading(false);
        }
    };

    const handleRead = async (id, isRead) => {
        if (isRead) return; // Prevent unnecessary API calls for already read messages

        try {
            await markMessageAsRead(id);
            
            // 1. Update local state
            setMessages(prev => prev.map(msg => 
                msg.id === id ? { ...msg, read: true } : msg
            ));
            
            // 2. Dispatch event to update UserLayout notification badge
            window.dispatchEvent(new CustomEvent('messageRead'));
            
        } catch (error) {
            console.error("Error marking as read", error);
            alert("Could not mark message as read. Please try again.");
        }
    };

    return (
        <div className="p-8 max-w-4xl mx-auto">
            <h1 className="text-3xl font-bold mb-6 text-gray-800">My Inbox</h1>
            
            {loading ? (
                <div className="text-gray-500 animate-pulse">Loading your messages...</div>
            ) : messages.length === 0 ? (
                <div className="bg-white p-6 rounded-lg shadow text-gray-500 text-center">
                    No messages at this time.
                </div>
            ) : (
                <div className="space-y-4">
                    {messages.map((msg) => (
                        <div 
                            key={msg.id} 
                            onClick={() => handleRead(msg.id, msg.read)}
                            className={`p-6 rounded-lg shadow-sm border transition duration-200 cursor-pointer flex justify-between items-center
                                ${msg.read ? 'bg-white border-gray-100' : 'bg-blue-50 border-blue-200 hover:border-blue-300'}`}
                        >
                            <div className="flex-1">
                                <p className={`text-lg mb-2 ${msg.read ? 'text-gray-600' : 'text-gray-900 font-semibold'}`}>
                                    {msg.content}
                                </p>
                                <span className="text-sm text-gray-400">
                                    {new Date(msg.timestamp).toLocaleString()}
                                </span>
                            </div>
                            
                            {msg.read ? (
                                <span className="text-green-500 font-bold ml-4 text-sm whitespace-nowrap">✓ Read</span>
                            ) : (
                                <span className="text-blue-500 font-bold ml-4 text-xs uppercase animate-pulse">New</span>
                            )}
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};

export default UserInbox;
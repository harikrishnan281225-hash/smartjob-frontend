import React, { useState, useEffect } from 'react';
import { getMyMessages, markMessageAsRead } from '../services/api';

const UserInbox = () => {
    const [messages, setMessages] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        fetchMessages();
    }, []);

    const fetchMessages = async () => {
        setLoading(true);
        setError(null);
        try {
            const response = await getMyMessages();
            // Verify structure: ensure response.data exists and is an array
            const data = response && Array.isArray(response.data) ? response.data : [];
            
            // Sort by timestamp
            const sorted = [...data].sort((a, b) => {
                return new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime();
            });
            
            setMessages(sorted);
        } catch (error) {
            console.error("Error fetching messages:", error);
            setError("Failed to load messages. Please ensure you are logged in.");
        } finally {
            setLoading(false);
        }
    };

    const handleRead = async (id, isRead) => {
        if (isRead) return; 

        try {
            await markMessageAsRead(id);
            setMessages(prev => prev.map(msg => 
                msg.id === id ? { ...msg, read: true } : msg
            ));
            window.dispatchEvent(new CustomEvent('messageRead'));
        } catch (error) {
            console.error("Error marking as read:", error);
        }
    };

    const formatDate = (timestamp) => {
        if (!timestamp) return "";
        return new Date(timestamp).toLocaleString(undefined, { 
            year: 'numeric', month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' 
        });
    };

    return (
        <div className="p-8 max-w-4xl mx-auto">
            <h1 className="text-3xl font-bold mb-6 text-gray-800">My Inbox</h1>
            
            {loading ? (
                <div className="text-gray-500 animate-pulse">Loading your messages...</div>
            ) : error ? (
                <div className="bg-red-50 p-4 rounded text-red-600 border border-red-200">{error}</div>
            ) : messages.length === 0 ? (
                <div className="bg-white p-6 rounded-lg shadow text-gray-500 text-center border">
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
                                    {formatDate(msg.timestamp)}
                                </span>
                            </div>
                            
                            <div className="ml-4">
                                {msg.read ? (
                                    <span className="text-green-500 font-bold text-sm whitespace-nowrap">✓ Read</span>
                                ) : (
                                    <span className="text-blue-500 font-bold text-xs uppercase animate-pulse">New</span>
                                )}
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};

export default UserInbox;
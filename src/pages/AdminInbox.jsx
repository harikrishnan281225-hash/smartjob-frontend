import React, { useEffect, useState } from 'react';
import { getAllMessagesForAdmin } from '../services/api';

const AdminInbox = () => {
    const [messages, setMessages] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchStatus();
    }, []);

    const fetchStatus = async () => {
        setLoading(true);
        try {
            const response = await getAllMessagesForAdmin();
            // Ensure response.data is an array before processing
            const data = Array.isArray(response.data) ? response.data : [];
            
            // Sort by timestamp descending (newest first)
            const sorted = [...data].sort((a, b) => 
                new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime()
            );
            setMessages(sorted);
        } catch (error) {
            console.error("Error fetching admin message reports:", error);
        } finally {
            setLoading(false);
        }
    };

    // Safe date formatter
    const formatDate = (timestamp) => {
        if (!timestamp) return "N/A";
        return new Date(timestamp).toLocaleString(undefined, { 
            year: 'numeric', month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' 
        });
    };

    return (
        <div className="p-8 max-w-6xl mx-auto">
            <h1 className="text-2xl font-bold mb-6 text-gray-800">Message Delivery Status</h1>
            
            {loading ? (
                <div className="text-gray-500 animate-pulse">Loading delivery reports...</div>
            ) : messages.length === 0 ? (
                <div className="bg-white p-6 rounded-lg shadow text-gray-500 text-center border">
                    No messages found in the system.
                </div>
            ) : (
                <div className="bg-white shadow rounded-lg overflow-hidden border border-gray-200">
                    <table className="w-full text-left border-collapse">
                        <thead>
                            <tr className="bg-gray-50 text-gray-600 uppercase text-xs font-semibold">
                                <th className="p-4 border-b">Receiver ID</th>
                                <th className="p-4 border-b">Content</th>
                                <th className="p-4 border-b">Sent At</th>
                                <th className="p-4 border-b">Status</th>
                            </tr>
                        </thead>
                        <tbody>
                            {messages.map(msg => (
                                <tr key={msg.id} className="border-t hover:bg-gray-50 transition">
                                    <td className="p-4 font-medium text-gray-900">{msg.receiverId}</td>
                                    <td className="p-4 text-gray-700 truncate max-w-md">{msg.content}</td>
                                    <td className="p-4 text-sm text-gray-500">
                                        {formatDate(msg.timestamp)}
                                    </td>
                                    <td className="p-4">
                                        {msg.read ? (
                                            <span className="text-green-700 font-bold bg-green-50 px-2 py-1 rounded border border-green-200 text-xs">
                                                Read
                                            </span>
                                        ) : (
                                            <span className="text-red-600 font-bold bg-red-50 px-2 py-1 rounded border border-red-200 text-xs">
                                                Unread
                                            </span>
                                        )}
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            )}
        </div>
    );
};

export default AdminInbox;
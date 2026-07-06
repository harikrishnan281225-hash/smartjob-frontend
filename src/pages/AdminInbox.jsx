import React, { useEffect, useState } from 'react';
import { getAllMessagesForAdmin } from '../services/api'; // Ensure this points to your updated api.js

const AdminInbox = () => {
    const [messages, setMessages] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchStatus();
    }, []);

    const fetchStatus = async () => {
        try {
            // Now calling the Admin-specific endpoint for all messages
            const response = await getAllMessagesForAdmin();
            
            // Sort by timestamp descending (newest first)
            const sorted = response.data.sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp));
            setMessages(sorted);
        } catch (error) {
            console.error("Error fetching admin message reports", error);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="p-8 max-w-6xl mx-auto">
            <h1 className="text-2xl font-bold mb-6 text-gray-800">Message Delivery Status</h1>
            
            {loading ? (
                <div className="text-gray-500">Loading delivery reports...</div>
            ) : messages.length === 0 ? (
                <div className="text-gray-500">No messages found in the system.</div>
            ) : (
                <div className="bg-white shadow rounded-lg overflow-hidden">
                    <table className="w-full text-left border-collapse">
                        <thead>
                            <tr className="bg-gray-100 text-gray-600 uppercase text-sm">
                                <th className="p-4">Receiver ID</th>
                                <th className="p-4">Content</th>
                                <th className="p-4">Sent At</th>
                                <th className="p-4">Status</th>
                            </tr>
                        </thead>
                        <tbody>
                            {messages.map(msg => (
                                <tr key={msg.id} className="border-t hover:bg-gray-50">
                                    <td className="p-4 font-medium">{msg.receiverId}</td>
                                    <td className="p-4 text-gray-700">{msg.content}</td>
                                    <td className="p-4 text-sm text-gray-500">
                                        {new Date(msg.timestamp).toLocaleString()}
                                    </td>
                                    <td className="p-4">
                                        {msg.read ? (
                                            <span className="text-green-600 font-bold bg-green-50 px-2 py-1 rounded border border-green-200 text-xs">
                                                Read
                                            </span>
                                        ) : (
                                            <span className="text-red-500 font-bold bg-red-50 px-2 py-1 rounded border border-red-200 text-xs">
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
import React, { useState, useEffect } from 'react';
import UserSelectionModal from './UserSelectionModal';

const AdminJobForm = ({ onClose, onJobPosted }) => {
    const [formData, setFormData] = useState({
        title: '', companyName: '', location: '', salary: '',
        experienceRequired: '', description: '', skillsRequired: ''
    });

    const [isModalOpen, setIsModalOpen] = useState(false);
    const [allUsers, setAllUsers] = useState([]);
    const [selectedUserIds, setSelectedUserIds] = useState([]);
    const [isLoading, setIsLoading] = useState(false);

    useEffect(() => {
        const fetchUsers = async () => {
            try {
                const response = await fetch('/api/admin/users', {
                    headers: { 'Authorization': `Bearer ${localStorage.getItem('token')}` }
                });
                if (response.ok) {
                    const data = await response.json();
                    setAllUsers(data);
                }
            } catch (err) {
                console.error("Error fetching users:", err);
            }
        };
        fetchUsers();
    }, []);

    // Centralized handler to prevent state merge issues
    const handleInputChange = (field, value) => {
        setFormData(prev => ({
            ...prev,
            [field]: value
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsLoading(true);

        // Explicitly map formData to the payload structure
        const payload = {
            userIds: selectedUserIds,
            job: {
                id: null, // Allow backend to generate ID
                title: formData.title,
                companyName: formData.companyName,
                location: formData.location,
                salary: formData.salary,
                experienceRequired: formData.experienceRequired,
                description: formData.description,
                skillsRequired: formData.skillsRequired
            }
        };

        console.log("Submitting Payload:", JSON.stringify(payload, null, 2));

        try {
            const response = await fetch('/api/admin/post-job', {
                method: 'POST',
                headers: { 
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${localStorage.getItem('token')}`
                },
                body: JSON.stringify(payload)
            });
            
            if (response.ok) {
                alert("Job posted and assigned successfully!");
                onJobPosted(); 
                onClose();    
            } else {
                const text = await response.text();
                console.error("Backend Error Response:", text);
                alert(`Failed to post job: ${text}`);
            }
        } catch (err) {
            console.error("Connection Error:", err);
            alert("Error connecting to server. Please try again.");
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <form onSubmit={handleSubmit} className="w-full">
            <h2 className="text-xl font-bold mb-4">Post New Job</h2>
            <input required className="w-full border p-2 mb-2 rounded" placeholder="Job Title" onChange={(e) => handleInputChange('title', e.target.value)} />
            <input required className="w-full border p-2 mb-2 rounded" placeholder="Company Name" onChange={(e) => handleInputChange('companyName', e.target.value)} />
            <input required className="w-full border p-2 mb-2 rounded" placeholder="Location" onChange={(e) => handleInputChange('location', e.target.value)} />
            <input required className="w-full border p-2 mb-2 rounded" placeholder="Salary" onChange={(e) => handleInputChange('salary', e.target.value)} />
            <input required className="w-full border p-2 mb-2 rounded" placeholder="Experience Required" onChange={(e) => handleInputChange('experienceRequired', e.target.value)} />
            <textarea required className="w-full border p-2 mb-2 h-24 rounded" placeholder="Description" onChange={(e) => handleInputChange('description', e.target.value)} />
            <input required className="w-full border p-2 mb-4 rounded" placeholder="Skills Required" onChange={(e) => handleInputChange('skillsRequired', e.target.value)} />
            
            <div className="flex justify-between items-center mb-4">
                <button 
                    type="button" 
                    onClick={() => setIsModalOpen(true)}
                    className="text-blue-600 font-medium underline hover:text-blue-800 transition"
                >
                    {selectedUserIds.length > 0 ? `Selected ${selectedUserIds.length} users` : "+ Select Users to Assign"}
                </button>
            </div>

            <div className="flex justify-end gap-2">
                <button type="button" onClick={onClose} className="px-4 py-2 bg-gray-300 rounded hover:bg-gray-400 transition">Cancel</button>
                <button 
                    type="submit" 
                    disabled={isLoading}
                    className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 disabled:bg-blue-300 transition"
                >
                    {isLoading ? "Posting..." : "Post Job"}
                </button>
            </div>

            <UserSelectionModal 
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                users={allUsers}
                initialSelectedIds={selectedUserIds}
                onConfirm={(ids) => setSelectedUserIds(ids)}
            />
        </form>
    );
};

export default AdminJobForm;
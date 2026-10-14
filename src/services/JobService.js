const API_URL = 'http://localhost:8080/api/jobs';
const APP_API_URL = 'http://localhost:8080/api/applications';
const PROFILE_API_URL = 'http://localhost:8080/api/profile';

const getHeaders = () => {
    const token = localStorage.getItem('token');
    if (!token || token === 'null' || token === 'undefined') {
        return { 'Content-Type': 'application/json' };
    }
    return {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
    };
};

// --- Job Methods ---
export const getJobs = async (search = "", status = "All") => {
    const statusParam = status === "All" ? "" : status;
    const response = await fetch(`${API_URL}/my-jobs?search=${encodeURIComponent(search)}&status=${encodeURIComponent(statusParam)}`, { 
        method: 'GET', 
        headers: getHeaders()
    });
    if (!response.ok) throw new Error(`${response.status}`);
    return response.json();
};

/**
 * FIXED: Now sends both jobId AND full job details
 * So it works whether backend uses ApplyRequest DTO or full Job entity
 */
export const addJob = async (jobData) => {
    // jobData comes from SearchJobs.jsx with externalId, title, companyName...
    const jobIdValue = jobData.externalId || jobData.jobId || jobData.job_id || "";

    const payload = {
        // For ApplyRequest DTO (backend that expects only jobId)
        jobId: jobIdValue,
        externalId: jobIdValue,
        
        // For full Job entity (so company is NOT empty)
        title: jobData.title || "No Title",
        companyName: jobData.companyName || "UNKNOWN",
        location: jobData.location || "Remote",
        description: jobData.description || "No description provided.",
        url: jobData.url || "",
        salary: jobData.salary || "Not specified",
        skillsRequired: jobData.skillsRequired || "Not specified",
        experienceRequired: jobData.experienceRequired || "Not specified",
        status: jobData.status || "Applied",
        username: jobData.username,
        postedDate: jobData.postedDate,
        postedBy: jobData.postedBy || "USER_SEARCH"
    };

    console.log("JobService payload:", payload);

    const response = await fetch(`${API_URL}/add`, {
        method: 'POST',
        headers: getHeaders(),
        body: JSON.stringify(payload)
    });
    if (!response.ok) {
        const errorMsg = await response.text();
        throw new Error(errorMsg || 'Failed to add job.');
    }
    return response.text();
};

export const deleteJob = async (id) => {
    const response = await fetch(`${API_URL}/${id}`, { 
        method: 'DELETE', 
        headers: getHeaders() 
    });
    if (!response.ok) throw new Error('Failed to delete job.');
    return response.text();
};

export const updateJobStatus = async (id, status) => {
    const response = await fetch(`${API_URL}/${id}/status`, {
        method: 'PUT',
        headers: getHeaders(),
        body: JSON.stringify({ status: status }) 
    });
    if (!response.ok) throw new Error('Failed to update status.');
    return response.text();
};

export const updateJobDate = async (id, followUpDate) => {
    const response = await fetch(`${APP_API_URL}/${id}/follow-up-date`, {
        method: 'PUT',
        headers: getHeaders(),
        body: JSON.stringify({ followUpDate }) 
    });
    if (!response.ok) throw new Error('Failed to update follow-up date.');
    return response.text();
};

// --- Profile / Portfolio Methods ---

export const getUserProfile = async () => {
    const response = await fetch(`${PROFILE_API_URL}/me`, { 
        method: 'GET', 
        headers: getHeaders() 
    });
    if (!response.ok) throw new Error(`${response.status}`);
    return response.json();
};

export const updateProfile = async (profileData) => {
    const response = await fetch(`${PROFILE_API_URL}/details`, {
        method: 'PUT',
        headers: getHeaders(),
        body: JSON.stringify(profileData)
    });
    if (!response.ok) throw new Error('Failed to update portfolio.');
    return response.text();
};

export const uploadResume = async (formData) => {
    const token = localStorage.getItem('token');
    const response = await fetch(`${PROFILE_API_URL}/upload-resume`, {
        method: 'POST',
        headers: { 'Authorization': `Bearer ${token}` },
        body: formData
    });
    if (!response.ok) throw new Error('Failed to upload resume.');
    return response.text();
};

export const changePassword = async (currentPassword, newPassword) => {
    const response = await fetch(`${PROFILE_API_URL}/password`, {
        method: 'PUT',
        headers: getHeaders(),
        body: JSON.stringify({ currentPassword, newPassword })
    });
    if (!response.ok) throw new Error('Failed to update password.');
    return response.text();
};
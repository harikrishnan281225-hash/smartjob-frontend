import axios from 'axios';

const API_KEY = import.meta.env.VITE_RAPIDAPI_KEY;
const API_HOST = import.meta.env.VITE_RAPIDAPI_HOST;

export const searchJobs = async (query, location = "") => {
    const searchQuery = location ? `${query} in ${location}` : query;

    const options = {
        method: 'GET',
        url: 'https://jsearch.p.rapidapi.com/search',
        params: { 
            query: searchQuery, 
            page: '1', 
            num_pages: '1' 
        },
        headers: {
            'X-RapidAPI-Key': API_KEY,
            'X-RapidAPI-Host': API_HOST
        }
    };

    try {
        const response = await axios.request(options);
        
        // Map the results to ensure consistent field naming
        // This confirms that job_id is treated as a String throughout your frontend
        return response.data.data.map(job => ({
            ...job,
            // Explicitly ensuring job_id is handled as a string
            job_id: String(job.job_id) 
        }));
    } catch (error) {
        console.error("Search API Error:", error);
        throw error;
    }
};
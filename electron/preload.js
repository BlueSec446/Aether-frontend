import { contextBridge } from 'electron';

const API_KEY = process.env.AETHER_API_KEY; 
const API_BASE_URL = 'http://127.0.0.1:5000/api/v1';


async function apiCall(endpoint, options = {}) {
    const url = `${API_BASE_URL}${endpoint}`;

    const headers = {
        'Content-Type': 'application/json',
        'X-Aether-API-Key': API_KEY,
        ...options.headers
    };

    try {
        const response = await fetch(url, { ...options, headers });

        if (!response.ok) {
            const errorData = await response.json().catch(() => ({}));
            const backendMessage = errorData.message || response.statusText;
            throw new Error(backendMessage);
        }
        return await response.json();
    } catch (error) {
        console.error(`[Secure API Bridge] Failed call to ${endpoint}:`, error);
        throw error; //Maybe ausklammern?
    }
}
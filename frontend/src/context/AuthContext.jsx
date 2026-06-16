/* global authentication state */
/* provides state synchronization for logins across entire frontend app, preventing session losses during page relods */

import React, { createContext, useState, useEffect, useContext } from 'react';

export const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);
    const API_URL = import.meta.env.VITE_API_URL || '';

    useEffect(() => {
        fetch(`${API_URL}/api/check_session`, { credentials: 'include' })
            .then(res => res.ok ? res.json() : null)
            .then(data => setUser(data))
            .catch(() => setUser(null))
            .finally(() => setLoading(false));
    }, []);

    const login = async (username, password) => {
        const res = await fetch(`${API_URL}/api/login`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ username, password }),
            credentials: 'include'
        });
        if (res.ok) {
            const data = await res.json();
            setUser(data);
            return { success: true };
        } else {
            const errorData = await res.json();
            return { success: false, error: errorData.error };
        }
    };

    const register = async (username, password) => {
        const res = await fetch(`${API_URL}/api/register`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ username, password }),
            credentials: 'include' // Added credentials here for consistency
        });
        if (res.ok) {
            const data = await res.json();
            setUser(data);
            return { success: true };
        } else {
            const errorData = await res.json();
            return { success: false, error: errorData.error };
        }
    };

    const logout = async () => {
        try {
            const res = await fetch(`${API_URL}/api/logout`, { 
                method: 'DELETE',
                credentials: 'include' 
            }); // Fixed: Added closing brace here
            
            if (res.ok) {
                setUser(null); 
                window.location.href = '/'; 
            }
        } catch (err) {
            console.error("Logout error:", err);
        }
    };

    return (
        <AuthContext.Provider value={{ user, loading, login, register, logout }}>
            {loading ? <p>Consulting the archives...</p> : children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => useContext(AuthContext);
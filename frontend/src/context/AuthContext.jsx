/* global authentication state */
/* provides state synchronization for logins across entire frontend app, preventing session losses during page relods */

import React, { createContext, useState, useEffect, useContext } from 'react';

// create the Context
export const AuthContext = createContext(null);

// create the Provider Component
export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);

    // check for active session when app first loads
    useEffect(() => {
        fetch('/api/check_session')
            .then((res) => {
                if (res.ok) {
                    return res.json();
                }
                throw new Error("No active session");
            })
            .then((userData) => setUser(userData))
            .catch(() => setUser(null))
            .finally(() => setLoading(false));
    }, []);

    // login function
    const login = async (username, password) => {
        const res = await fetch('/api/login', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ username, password }),
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

    // register function
    const register = async (username, password) => {
        const res = await fetch('/api/register', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ username, password }),
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

    // logout function
    const logout = async () => {
        const res = await fetch('/api/logout', { method: 'DELETE' });
        if (res.ok) {
            setUser(null);
        }
    };

    return (
        <AuthContext.Provider value={{ user, loading, login, register, logout }}>
            {children}
        </AuthContext.Provider>
    );
};

// quick access to the Auth Context
export const useAuth = () => useContext(AuthContext);
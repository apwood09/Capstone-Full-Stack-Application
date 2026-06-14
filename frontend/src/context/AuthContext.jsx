/* global authentication state */
/* provides state synchronization for logins across entire frontend app, preventing session losses during page relods */

import React, { createContext, useState, useEffect, useContext } from 'react';

// create content object 
// acts as global container: hold our authentication state 
// initialize with null, eventually will hold user, login & logout functions 
const AuthContext = createContext(null);

// create provider component 
// component wrappped inside <AuthProvider>: have access to auth state & methods 
export const AuthProvider = ({ children }) => {
    // State: hold current authenticated user's data 
    const [user, setUser] = useState(null);

    // State: track if still checking user's session status on inital page load 
    // prevents app from flashing Logged out screens while fetching data
    const [loading, setLoading] = useState(true);

    // State: store authentication-related error message 
    const [authError, setAuthError] = useState(null);

    // persistent session check: runs once on app mounts
    useEffect(() => {
        // sends request to backend to check if valid session cookie/token exists
        fetch('/api/check_session')
            .then(res => res.ok ? res.json() : Promise.reject()) // successful: parse JSON, if not: rejected 
            .then(data => setUser(data)) // save returned user data to state 
            .catch(() => setUser(null)) // no valid session: user is null 
            .finally(() => setLoading(false)); // turn off loading spinner regardless outcome 
    }, []); // empty dependency array: only runs once on inital page load 

    // login function 
    const login = async (username, password) => {
        setAuthError(null); // clear previous login error before trying again 
        const res = await fetch('/api/login', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ username, password })
        });
        const data = await res.json();
        if (res.ok) { 
            setUser(data); // update state with logged-in user data
            return true; // return true: calling component know login succeeded 
        }

        // login failed: save error message from backend to state
        setAuthError(data.error);
        return false; // return false: calling component knows it failed 
    };

    // logout function 
    const logout = async () => {
        const res = await fetch('/api/logout', { method: 'DELETE' });
        if (res.ok) {
            setUser(null); // reset user state null, effetively logging out of UI 
        }
    };

    // provide values to component tree
    // every property passed into value object becomes globally accesible to children 
    return (
        <AuthContext.Provider value={{ user, loading, authError, login, logout }}>
            {children}
        </AuthContext.Provider>
    );
};

// custom hook
// insted of importing both useContext & AuthContent every file, components can call useAuth() to access user data & authentication methods 
export const useAuth = () => useContext(AuthContext);
import { useAuth } from '../context/AuthContext';
import { Navigate } from 'react-router-dom';
import React from 'react';

const ProtectedRoute = ({ children }) => {
    const { user, loading } = useAuth();
    
    // IF loading, don't redirect: show a simple state
    if (loading) return <p style={{ color: 'white' }}>Verifying your soul...</p>;
    
    // ONLY redirect if we are sure the user is null
    if (!user) return <Navigate to="/" />;
    
    return children;
};

export default ProtectedRoute;
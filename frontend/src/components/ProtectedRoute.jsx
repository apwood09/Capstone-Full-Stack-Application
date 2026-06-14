/* navigation interceptor */
/* prevents unauthenticated routing across private frotend views */

import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

// wrapper component (Higher-Order Component layout)
// accepts `children` (the private page/component you want to protect) as a prop
const ProtectedRoute = ({ children }) => {
    // destructure properties from global Authentication context
    const { user, loading } = useAuth();

    // handle async lag state.
    // app first loads: React Context has to make a network request to check if 
    // the user is logged in
    // during brief moment: `loading` is true. return a loading state here; 
    // otherwise, code would immediately jump down, see `user` is null, and boot 
    // logged-in user to login screen by mistake before network request finishes
    if (loading) return <div>Flipping spellbook pages...</div>;

    // authenticate check
    // if network request finished (`loading` is false) and `user` is still null, 
    // means they are unauthorized. use React Router's <Navigate> component to force 
    // redirect them instantly to login page.
    // `replace` attribute overwrites current entry in browser history stack, 
    // meaning if click the browser's "Back" button, won't get stuck in infinite redirect loop
    if (!user) return <Navigate to="/login" replace />;

    // access granted 
    // are authenticated, render child component tree seamlessly
    return children;
};

export default ProtectedRoute;
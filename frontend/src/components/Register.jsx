import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate, Link } from 'react-router-dom';

const Register = () => {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const { register, user } = useAuth();
    const navigate = useNavigate();


    const handleSubmit = async (e) => {
        e.preventDefault();
        const result = await register(username, password);
        if (result.success) {
            navigate('/dashboard');
        } else {
            alert(result.error);
        }
    };

    return (
        <form onSubmit={handleSubmit}>
            <h1>Begin Your Journey</h1>
            <input 
                placeholder="Username" 
                onChange={(e) => setUsername(e.target.value)} 
                required 
            />
            <input 
                type="password" 
                placeholder="Password" 
                onChange={(e) => setPassword(e.target.value)} 
                required 
            />
            <button type="submit">Sign Up</button>

            <p style={{ marginTop: '15px' }}>
                Already have an account? <Link to="/login">Log in here</Link>
            </p>
        </form>
    );
};

export default Register;
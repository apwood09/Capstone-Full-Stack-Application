import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const Login = () => {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const navigate = useNavigate();

    const API_URL = import.meta.env.VITE_API_URL || ''; // Add this!

    const handleLogin = async (e) => {
        e.preventDefault();
        
        const res = await fetch('${API_URL}/api/login', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ username, password }),
            credentials: 'include' 
        });

        if (res.ok) {
            navigate('/dashboard');
    } else {
        alert("Invalid credentials.");
    }
};

   return (
        <div className="login-container">
            {/* Everything is inside the container, so it will center vertically and horizontally */}
            <form onSubmit={handleLogin}>
                <h1 style={{ color: 'var(--arcane-gold)', textAlign: 'center' }}>
                    Enter the Grimoire
                </h1>
                
                <input 
                    type="text" 
                    placeholder="Username" 
                    value={username} 
                    onChange={(e) => setUsername(e.target.value)} 
                    required
                />
                <input 
                    type="password" 
                    placeholder="Password" 
                    value={password} 
                    onChange={(e) => setPassword(e.target.value)} 
                    required
                />
                <button type="submit">Unlock Grimoire</button>
            </form>
        </div>
    );
};

export default Login;
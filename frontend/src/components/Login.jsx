import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const Login = () => {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const navigate = useNavigate();
    const { login } = useAuth();

    const API_URL = import.meta.env.VITE_API_URL; 
        
    const handleLogin = async (e) => {
        e.preventDefault();
        
        const result = await login(username, password);

        if (result.success) {
            navigate('/dashboard'); // Now AuthContext is updated, and the guard will pass
        } else {
            alert(result.error || "Invalid credentials.");
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
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const Register = () => {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState(null);
    const navigate = useNavigate();

    const handleRegister = async (e) => {
        e.preventDefault();
        setError(null); // Clear previous errors

        try {
            const res = await fetch('/api/register', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ username, password }),
                credentials: 'include' // Crucial for session persistence
            });

            if (res.ok) {
                // Registration successful, navigate to Dashboard
                navigate('/dashboard');
            } else {
                // If backend returns an error (like 400 or 409)
                const data = await res.json();
                setError(data.error || "Failed to register. Please try another name.");
            }
        } catch (err) {
            setError("The arcane network is down. Please try again later.");
        }
    };

    return (
        <div className="register-container" style={{ textAlign: 'center', marginTop: '50px' }}>
            <h1 style={{ color: 'var(--arcane-gold)' }}>Initiate Your Grimoire</h1>
            
            {error && <p style={{ color: 'red' }}>{error}</p>}
            
            <form onSubmit={handleRegister}>
                <div>
                    <input 
                        type="text" 
                        placeholder="Choose a Wizard Name" 
                        value={username} 
                        onChange={(e) => setUsername(e.target.value)} 
                        required
                    />
                </div>
                <div style={{ marginTop: '10px' }}>
                    <input 
                        type="password" 
                        placeholder="Secure Password" 
                        value={password} 
                        onChange={(e) => setPassword(e.target.value)} 
                        required
                    />
                </div>
                <button type="submit" style={{ marginTop: '15px' }}>
                    Bind to the Grimoire
                </button>
            </form>
            
            <p style={{ marginTop: '20px' }}>
                Already a scribe? <span onClick={() => navigate('/')} style={{ cursor: 'pointer', color: 'var(--arcane-gold)' }}>Login here</span>
            </p>
        </div>
    );
};

export default Register;
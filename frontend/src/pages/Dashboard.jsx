/* interactive UI */
/* foundational layout linking state parameters together. Handles adding tasks, updating status checkboxes, viewing nested relational items & saving individual page description directly. */

import React, { useContext, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import GrimoireForm from '../components/GrimoireForm';
import QuestCard from '../components/QuestCard';
import { QuestContext } from '../context/QuestProvider';
import { useAuth } from "../context/AuthContext";

const Dashboard = () => {
    const navigate = useNavigate();
    const { user, loading, logout } = useAuth(); 
    const { quests, fetchQuests} = useContext(QuestContext);

    useEffect(() => {
        if (user) {
            fetchQuests();
        }
    }, [user]);

    const handleLogout = async () => {
        await logout(); // calls the function from AuthContext

    };

    if (loading) return <p style={{ color: 'white', textAlign: 'center' }}>Consulting the archives...</p>;

    return (
        <div className="grimoire-container">
            <button 
                onClick={() => navigate("/")} 
                style={{ margin: '10px', cursor: 'pointer' }}
            >
                Back to Sign Up
            </button>

            <button onClick={handleLogout}>Log Out</button>

            <h1 style={{ color: 'var(--arcane-gold)', textAlign: 'center' }}>The Daily Grimoire</h1>
            <GrimoireForm />
            
            <div className="quest-list">
                {quests && quests.length === 0 ? (
                    <p style={{ textAlign: 'center' }}>No quests found in the Grimoire. Inscribe one above!</p>
                ) : (
                    quests.map(quest => (
                        <QuestCard key={quest.id} quest={quest} />
                    ))
                )}
            </div>
        </div>
    );
};

export default Dashboard;
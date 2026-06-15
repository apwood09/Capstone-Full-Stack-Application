/* interactive UI */
/* foundational layout linking state parameters together. Handles adding tasks, updating status checkboxes, viewing nested relational items & saving individual page description directly. */

import React, { useContext, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import GrimoireForm from '../components/GrimoireForm';
import QuestCard from '../components/QuestCard';
import { QuestContext } from '../context/QuestProvider';
import { useAuth } from '../context/AuthContext';

const Dashboard = () => {
    const navigate = useNavigate();
    const { user } = useAuth(); 
    const { quests } = useContext(QuestContext);

    useEffect(() => {
        // redirect to login if no user is found
        if (!user) {
            navigate("/"); 
        }
    }, [user, navigate]);

    return (
        <div className="grimoire-container">
            <h1 style={{ color: 'var(--arcane-gold)', textAlign: 'center' }}>The Daily Grimoire</h1>
            <GrimoireForm />
            
            <div className="quest-list">
                {/* Add this debug/status logic */}
                {quests.length === 0 ? (
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
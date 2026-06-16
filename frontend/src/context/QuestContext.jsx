/* global production core */
/* uses reactive updates to keep frontend synchronized with backend shifts without forcing explicit page updates */

import React, { createContext, useState, useEffect } from 'react';

export const QuestContext = createContext();

export const QuestProvider = ({ children }) => {
    const [quests, setQuests] = useState([]);

    const fetchQuests = async () => {
        const res = await fetch(`https://backend-daily-chore-grimoire.onrender.com/api/quests`);
        if (res.ok) {
            const data = await res.json();
            setQuests(data);
        }
    };

    useEffect(() => {
        fetchQuests();
    }, []);

    const addQuest = async (title) => {
        const res = await fetch(`${API_URL}/api/quests`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ title })
        });
        if (res.ok) fetchQuests();
    };

    const deleteQuest = async (id) => {
        const res = await fetch(`${API_URL}/api/quests/${id}`, { method: 'DELETE' });
        if (res.ok) fetchQuests();
    };

    return (
        <QuestContext.Provider value={{ quests, addQuest, deleteQuest }}>
            {children}
        </QuestContext.Provider>
    );
};
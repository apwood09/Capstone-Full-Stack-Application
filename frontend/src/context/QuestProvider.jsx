import React, { createContext, useState, useEffect, useContext } from 'react';

export const QuestContext = createContext();

export const QuestProvider = ({ children }) => {
    const [quests, setQuests] = useState([]);
    const API_URL = import.meta.env.VITE_API_URL || 'https://backend-daily-chore-grimoire.onrender.com';

    const fetchQuests = async () => {
        try {
            const res = await fetch(`${API_URL}/api/quests`, { credentials: 'include' });
            if (res.ok) {
                const data = await res.json();
                setQuests(data);
            }
        } catch (error) {
            console.error("Error fetching quests:", error);
        }
    };

    const addQuest = async (title) => {
        const res = await fetch(`${API_URL}/api/quests`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            credentials: 'include',
            body: JSON.stringify({ title })
        });
        if (res.ok) fetchQuests();
    };

    const deleteQuest = async (id) => {
        const res = await fetch(`${API_URL}/api/quests/${id}`, { 
            method: 'DELETE', 
            credentials: 'include' 
        });
        if (res.ok) fetchQuests();
    };

    return (
        <QuestContext.Provider value={{ quests, fetchQuests, addQuest, deleteQuest }}>
            {children}
        </QuestContext.Provider>
    );
};

export const useQuests = () => useContext(QuestContext);
import React, { createContext, useState, useEffect, useContext } from 'react';

// Create the Context to be used by your components
export const QuestContext = createContext();

// Create the Provider component
export const QuestProvider = ({ children }) => {
    const [quests, setQuests] = useState([]);

    // Fetch all quests for the current user from the backend
    const fetchQuests = async () => {
        try {
            
            const res = await fetch('/api/quests', {
                credentials: 'include'
            });
            
            if (res.ok) {
                const data = await res.json();
                setQuests(data);
            } else {
                console.error("Failed to fetch quests: Response not OK");
            }
        } catch (error) {
            console.error("Error connecting to the Grimoire:", error);
        }
    };

    // Load quests when the provider initializes
    useEffect(() => {
        fetchQuests();
    }, []);

    // Add a new quest
    const addQuest = async (title) => {
        const res = await fetch('/api/quests', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            credentials: 'include',
            body: JSON.stringify({ title })
        });
        if (res.ok) {
            fetchQuests(); // refresh list after adding
        }
    };

    // Remove a quest
    const deleteQuest = async (id) => {
        const res = await fetch(`/api/quests/${id}`, { method: 'DELETE', credentials: 'include' });
        if (res.ok) {
            setQuests((prev) => prev.filter((quest) => quest.id !== id));
        }
    };

    return (
        <QuestContext.Provider value={{ quests, addQuest, deleteQuest }}>
            {children}
        </QuestContext.Provider>
    );
};

// Custom hook to make using the context easier in other components
export const useQuests = () => useContext(QuestContext);
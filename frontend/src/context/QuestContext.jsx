/* global production core */
/* uses reactive updates to keep frontend synchronized with backend shifts without forcing explicit page updates */

import React, { createContext, useState, useEffect, useContext } from 'react';
import { useAuth } from './AuthContext';

// create global container for all game-like quest/todo data
const QuestContext = createContext(null); 

export const QuestProvider = ({ children }) => {
    // consume user state from AuthContext
    const { user } = useAuth(); 
    // state to store array of active quests fetched from backend
    const [quests, setQuests] = useState([]); 
    // state to catch & store quest-specific API errors
    const [questError, setQuestError] = useState(null); 

    // reactive data fetching (Driven by Auth State)
    // Whenever user logs in, logs out, or switches accounts, this effect triggers
    useEffect(() => {
        if (user) {
            // if user exists, fetch specific quests from server db
            fetch('/api/quests')
            .then(res => res.ok ? res.json() : Promise.reject("Failed tracking metrics"))
            .then(data => setQuests(data))
            .catch(err => setQuestError(err)); 
        } else {
            // CRITICAL: if user logs out, instantly wipe quest state in memory 
            // next user doesn't briefly see the previous person's confidential data
            setQuests([]); 
        }
    }, [user]); // 'user' is dependency driving this auto-fetch mechanism.

    // create operation (Add Quest)
    const addQuest = async (title) => {
        const res = await fetch('/api/quests', {
            method: 'POST', 
            headers: { 'Content-Type': 'application/json' }, 
            body: JSON.stringify({ title })
        }); 

        if (res.ok) {
            const data = await res.json(); 
            // optimistically update React state by appending new quest.
            // append a manual `notes: []` array here so that UI can safely map over notes 
            // even if db response hasn't pre-initialized specific empty array field yet.
            setQuests(prev => [...prev, {...data, notes: [] }]); 
        }
    }; 

    // update operation (Toggle Pending/Completed status)
    const toggleQuest = async (id, currentStatus) => {
        // valculate opposite status locally before hitting db
        const nextStatus = currentStatus === 'pending' ? 'completed' : 'pending'; 
        
        const res = await fetch(`/api/quests/${id}`, {
            method: 'PATCH', 
            headers: { 'Content-Type': 'application/json' }, 
            body: JSON.stringify({ status: nextStatus })
        });

        if (res.ok) {
            // immutably loop over quests. If ID matches: swap status property; keep others exactly as they are. 
            setQuests(prev => prev.map(q => q.id === id ? { ...q, status: nextStatus } : q)); 
        }
    }; 

    // delete operation (Remove Quest)
    const removeQuest = async (id) => {
        const res = await fetch(`/api/quests/${id}`, { method: 'DELETE' }); 
        if (res.ok) {
            // immutably filter out deleted quest by ID to remove it from screen
            setQuests(prev => prev.filter(q => q.id !== id)); 
        }
    };

    //  nested resource operation (Add a sub-note to a specific Quest)
    const addNote = async (questId, content) => {
        const res = await fetch(`/api/quests/${questId}/notes`, {
            method: 'POST', 
            headers: { 'Content-Type': 'application/json' }, 
            body: JSON.stringify({ content })
        }); 

        if (res.ok) {
            const newNote = await res.json(); 
            // safely locate parent quest array item & inject new nested note state
            setQuests(prev => prev.map(q => q.id === questId ? { ...q, notes: [...q.notes, newNote] } : q)); 
        }
    };

    return (
        <QuestContext.Provider value={{ quests, questError, addQuest, toggleQuest, removeQuest, addNote}}>
            {children}
        </QuestContext.Provider>
    ); 
}; 

export const useQuests = () => useContext(QuestContext); 
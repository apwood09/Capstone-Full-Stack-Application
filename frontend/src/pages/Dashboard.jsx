/* interactive UI */
/* foundational layout linking state parameters together. Handles adding tasks, updating status checkboxes, viewing nested relational items & saving individual page description directly. */

import React, { useState } from "react";
import { useAuth } from "../context/AuthContext";
import { useQuests } from "../context/QuestContext";

const Dashboard = () => {
    // destructure properties from global Authentication state
    const { user, logout } = useAuth(); 

    // destructure methods & resources from global Quests/Todo state
    const { quests, addQuest, toggleQuest, removeQuest, addNote} = useQuests(); 

    // local state for "New Quest" input text box
    const [newTitle, setNewTitle] = useState(''); 

    // local state for dynamic, multiple nested inputs
    // instead single string, stores an object mapped by quest IDs: { [questId]: "input string" }
    // allows users to type into specific quest's note box without affecting other quest's input box
    const [noteInputs, setNoteInputs] = useState({}); 

    // action handler: creating Main Quest
    const handleCreateQuest = (e) => {
        e.preventDefault(); // Stop page reloading on form submit
        if (!newTitle.trim()) return; // validation: Don't add empty quest if just spaces.

        addQuest(newTitle); // call Context function to update global state & backend.
        setNewTitle(''); // clear input box for next entry
    }; 
    
    // action handler: creating Nested Note inside a Quest
    const handleCreateNote = (questId) => {
        // retrieve: specific text typed for exact quest ID
        const content = noteInputs[questId]; 
        if (!content || !content.trim()) return; // validation: ensure it isn't empty

        addNote(questId, content); // call context function passing the parent quest's ID & text content

        // clear only specific quest's note input box while preserving any text typed in other boxes
        setNoteInputs(prev => ({ ...prev, [questId]: '' }));
    }; 

return (
        <div style={{ padding: '20px', maxWidth: '800px', margin: '0 auto' }}>
            <header style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '30px' }}>
                <h1>Greetings, {user?.username} 🔮</h1>
                <button onClick={logout}>Depart Grimoire</button>
            </header>

            {/* create core resource component */}
            <form onSubmit={handleCreateQuest} style={{ marginBottom: '20px' }}>
                <input 
                    type="text" 
                    placeholder="Inscribe a new active quest..." 
                    value={newTitle}
                    onChange={(e) => setNewTitle(e.target.value)}
                    style={{ width: '70%', padding: '8px' }}
                />
                <button type="submit" style={{ padding: '8px 15px', marginLeft: '10px' }}>Bind Quest</button>
            </form>

            {/* read core resource & nested operations */}
            <div>
                {quests.map(quest => (
                    <div key={quest.id} style={{ border: '1px solid #ccc', padding: '15px', marginBottom: '15px', borderRadius: '5px' }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                            <div>
                                <input 
                                    type="checkbox" 
                                    checked={quest.status === 'completed'} 
                                    onChange={() => toggleQuest(quest.id, quest.status)}
                                />
                                <span style={{ marginLeft: '10px', textDecoration: quest.status === 'completed' ? 'line-through' : 'none' }}>
                                    {quest.title}
                                </span>
                            </div>
                            <button onClick={() => removeQuest(quest.id)} style={{ color: 'red' }}>Vanish</button>
                        </div>

                        {/* secondary child resource section */}
                        <div style={{ marginTop: '15px', paddingLeft: '20px', borderLeft: '2px dashed #aaa' }}>
                            <h5>Incantations & Notes</h5>
                            <ul>
                                {quest.notes?.map(note => (
                                    <li key={note.id} style={{ fontSize: '0.9em', color: '#555' }}>{note.content}</li>
                                ))}
                            </ul>
                            <div style={{ display: 'flex', marginTop: '5px' }}>
                                <input 
                                    type="text" 
                                    placeholder="Add sub-note detail..."
                                    value={noteInputs[quest.id] || ''}
                                    onChange={(e) => setNoteInputs(prev => ({ ...prev, [quest.id]: e.target.value }))}
                                    style={{ flex: 1, padding: '4px' }}
                                />
                                <button onClick={() => handleCreateNote(quest.id)} style={{ marginLeft: '5px' }}>Ink</button>
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default Dashboard;
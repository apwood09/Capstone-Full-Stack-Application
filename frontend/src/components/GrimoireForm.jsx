import React, { useState, useContext } from 'react';
import { QuestContext } from '../context/QuestProvider';

const GrimoireForm = () => {
    const [title, setTitle] = useState('');
    const { addQuest } = useContext(QuestContext);

    const handleSubmit = (e) => {
        e.preventDefault();
        if (title.trim()) {
            addQuest(title);
            setTitle('');
        }
    };

    return (
        <form onSubmit={handleSubmit} style={{ display: 'flex', gap: '10px', marginBottom: '20px' }}>
            {/* Added id and name attributes below */}
            <input 
                id="quest-title"
                name="quest-title"
                type="text" 
                value={title} 
                onChange={(e) => setTitle(e.target.value)} 
                placeholder="Inscribe a new quest..." 
                style={{ flexGrow: 1 }}
            />
            <button type="submit">Bind Quest</button>
        </form>
    );
};

export default GrimoireForm;
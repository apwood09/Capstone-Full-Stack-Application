import React, { useContext } from 'react';
import { QuestContext } from '../context/QuestProvider';

const QuestCard = ({ quest }) => {
    const { deleteQuest } = useContext(QuestContext);

    return (
        <div className="card" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <h3 style={{ margin: 0 }}>{quest.title}</h3>
            <button onClick={() => deleteQuest(quest.id)} style={{ backgroundColor: '#800020', color: '#f4ecd8' }}>
                Vanish
            </button>
        </div>
    );
};

export default QuestCard;
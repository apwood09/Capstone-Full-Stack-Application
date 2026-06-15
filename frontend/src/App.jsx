import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { QuestProvider } from './context/QuestProvider';
import Dashboard from './pages/Dashboard';

function App() {
    return (
        <QuestProvider>
            <Router>
                <Routes>
                    <Route path="/" element={<Dashboard />} />
                </Routes>
            </Router>
        </QuestProvider>
    );
}

export default App;
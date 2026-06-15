import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Login from './pages/Login';
import Register from './pages/Register';
import Dashboard from './pages/Dashboard';
import { QuestProvider } from './context/QuestProvider';
import { AuthProvider } from './context/AuthContext';

function App() {
    return (
        <AuthProvider>
            <QuestProvider>
                <Router>
                    <Routes>
                        <Route path="/" element={<Login />} />
                        <Route path="/register" element={<Register />} />
                        <Route path="/dashboard" element={<Dashboard />} />
                    </Routes>
                </Router>
            </QuestProvider>
        </AuthProvider>
    );
}

export default App;
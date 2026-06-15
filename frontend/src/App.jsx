import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Login from "./components/Login";
import Register from "./components/Register";
import Dashboard from './pages/Dashboard';
import { QuestProvider } from './context/QuestProvider';
import { AuthProvider } from './context/AuthContext';

function App() {
    return (
        <AuthProvider>
            <QuestProvider>
                <Router>
                    <Routes>
                        <Route path="/" element={<Register />} />
                        <Route path="/login" element={<Login />} />
                        <Route path="/dashboard" element={<Dashboard />} />
                    </Routes>
                </Router>
            </QuestProvider>
        </AuthProvider>
    );
}

export default App;
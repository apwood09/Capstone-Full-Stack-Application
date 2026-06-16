import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Login from "./components/Login";
import Register from "./components/Register";
import Dashboard from './pages/Dashboard';
import { QuestProvider } from './context/QuestProvider';
import { AuthProvider, useAuth } from "./context/AuthContext"; // Import useAuth
import ProtectedRoute from "./components/ProtectedRoute";

const AppRoutes = () => {
    const { user, loading } = useAuth();
    
    if (loading) return <div>Summoning the Grimoire...</div>;
    
    return (
        <Routes>
            <Route path="/" element={user ? <Navigate to="/dashboard" /> : <Register />} />
            <Route path="/login" element={user ? <Navigate to="/dashboard" /> : <Login />} />
            <Route 
                path="/dashboard" 
                element={
                    <ProtectedRoute>
                        <Dashboard />
                    </ProtectedRoute>
                } 
            />
        </Routes>
    );
};

function App() {
    return (
        <AuthProvider>
            <QuestProvider>
                <Router>
                    <AppRoutes />
                </Router>
            </QuestProvider>
        </AuthProvider>
    );
}

export default App;
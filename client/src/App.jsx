import {BrowserRouter, Routes, Route, Navigate} from 'react-router-dom';
import {AuthProvider} from './context/AuthContext.jsx';

import Register from './pages/Register';
import Login from './pages/login';
import Dashboard from './pages/Dashboard';
import ProtectedRoutes from './components/ProtectedRoutes';
import Editor from './pages/Editor';

import './App.css';

function App() {
    return (
        <BrowserRouter>
            <AuthProvider>
                <Routes>
                  <Route path='/' element={<Navigate to="/dashboard" replace />} />
                  <Route path='/login' element={<Login />} />
                  <Route path='/register' element={<Register />} />
                  <Route path='/dashboard' element={<ProtectedRoutes><Dashboard /></ProtectedRoutes>} />
                  <Route path='/editor' element={<ProtectedRoutes><Editor /></ProtectedRoutes>} />
                  <Route path= "/editor/:id" element={<ProtectedRoutes><Editor /></ProtectedRoutes>} />
                </Routes>
            </AuthProvider>
        </BrowserRouter>
    );
}

export default App;

import {useState, useEffect} from "react";
import api from "../services/api";
import AuthContext from './authContext';

export const AuthProvider = ({children}) => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const loadUser = async () => {
            const token = localStorage.getItem('token');
            if (!token) {
                setUser(null);
                setLoading(false);
                return;
            }

            try {
                const response = await api.get('/auth/me');
                setUser(response.data);
            }catch (error) {
                console.error('Failed to load user:', error);
                localStorage.removeItem('token');
                setUser(null);
            }
            finally {
                setLoading(false);
            }
        };
        loadUser();
    }, []);

    const login = async (email, password) => {
        const response = await api.post('/auth/login', {email, password});
        localStorage.setItem('token', response.data.token);
        setUser(response.data);

        return response.data;
    }

    const register = async (username, email, password) => {
        const response = await api.post('/auth/register', {username, email, password});
        localStorage.setItem('token', response.data.token);
        setUser(response.data);

        return response.data;
    }

    const logout = () => {
        localStorage.removeItem('token');
        setUser(null);
    }

    return (
        <AuthContext.Provider value={{user, loading, login, register, logout}}>
            {children}
        </AuthContext.Provider>
    );
}


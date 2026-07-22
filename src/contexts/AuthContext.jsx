import { createContext, useState, useContext, useEffect } from 'react';
import { setAuthContextData } from '../helper/axiosHelper';

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    const [userData, setUserData] = useState(null);
    const [isAuthenticated, setIsAuthenticated] = useState(false);

    useEffect(() => {
        setAuthContextData(userData);
    }, [userData]);

    const login = (data) => {
        setUserData(data);
        setIsAuthenticated(true);
    };

    const logout = () => {
        setUserData(null);
        setIsAuthenticated(false);
        localStorage.removeItem('token');
        window.location.href = '/';
    };

    return (
        <AuthContext.Provider value={{ userData, isAuthenticated, login, logout, setUserData }}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => useContext(AuthContext);

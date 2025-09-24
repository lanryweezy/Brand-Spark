import React, { createContext, useState, useContext, useMemo } from 'react';
import { User, Role } from '../types';

// Mock current user for demonstration purposes
const MOCK_CURRENT_USER: User = {
    id: 'user-1',
    name: 'Alex Johnson (Admin)',
    email: 'alex@agency.com',
    role: Role.Admin,
    avatarUrl: 'https://i.pravatar.cc/150?u=alex',
};

interface AuthContextType {
    isAuthenticated: boolean;
    currentUser: User | null;
    login: () => void;
    logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [currentUser, setCurrentUser] = useState<User | null>(null);

    const login = () => {
        // In a real app, you'd verify credentials and fetch user data
        setIsAuthenticated(true);
        setCurrentUser(MOCK_CURRENT_USER);
    };

    const logout = () => {
        setIsAuthenticated(false);
        setCurrentUser(null);
    };

    const value = useMemo(() => ({
        isAuthenticated,
        currentUser,
        login,
        logout
    }), [isAuthenticated, currentUser]);

    return (
        <AuthContext.Provider value={value}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = (): AuthContextType => {
    const context = useContext(AuthContext);
    if (context === undefined) {
        throw new Error('useAuth must be used within an AuthProvider');
    }
    return context;
};

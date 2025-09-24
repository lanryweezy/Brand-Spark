import React, { createContext, useState, useContext, useMemo } from 'react';
import { User, Role } from '../types';

const MOCK_USERS: User[] = [
    { id: 'user-1', name: 'Alex Johnson', email: 'alex@agency.com', role: Role.Admin, avatarUrl: 'https://i.pravatar.cc/150?u=alex' },
    { id: 'user-2', name: 'Maria Garcia', email: 'maria@agency.com', role: Role.Member, avatarUrl: 'https://i.pravatar.cc/150?u=maria' },
    { id: 'user-3', name: 'Chen Wei', email: 'chen@agency.com', role: Role.Member, avatarUrl: 'https://i.pravatar.cc/150?u=chen' },
];


interface UsersContextType {
    users: User[];
    addUser: (user: Omit<User, 'id'>) => Promise<User>;
    updateUser: (userId: string, updatedUser: Partial<User>) => Promise<void>;
    deleteUser: (userId: string) => Promise<void>;
}

const UsersContext = createContext<UsersContextType | undefined>(undefined);

export const UsersProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [users, setUsers] = useState<User[]>(MOCK_USERS);

    const addUser = async (user: Omit<User, 'id'>): Promise<User> => {
        console.log('Inviting user:', user.email, 'with role:', user.role);
        const newUser: User = {
            id: `user-${Date.now()}`,
            ...user,
            avatarUrl: `https://i.pravatar.cc/150?u=${user.email}`
        };
        setUsers(prev => [...prev, newUser]);
        return newUser;
    };

    const updateUser = async (userId: string, updatedData: Partial<User>) => {
        setUsers(prev => prev.map(u => u.id === userId ? { ...u, ...updatedData } : u));
    };

    const deleteUser = async (userId: string) => {
        setUsers(prev => prev.filter(u => u.id !== userId));
    };
    
    const value = useMemo(() => ({
        users,
        addUser,
        updateUser,
        deleteUser
    }), [users]);

    return (
        <UsersContext.Provider value={value}>
            {children}
        </UsersContext.Provider>
    );
};

export const useUsers = (): UsersContextType => {
    const context = useContext(UsersContext);
    if (context === undefined) {
        throw new Error('useUsers must be used within a UsersProvider');
    }
    return context;
};

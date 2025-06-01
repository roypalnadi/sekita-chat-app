'use client';

import {} from '@/utils/firebase';
import { getAuth, onAuthStateChanged, User } from 'firebase/auth';
import React, { createContext, useContext, ReactNode, useState, useEffect } from 'react';

interface AuthContextType {
    user: User | null;
    userReady: boolean;
}

const AuthContext = createContext<AuthContextType>({
    user: null,
    userReady: false,
});

export const useAuth = (): AuthContextType => {
    const context = useContext(AuthContext);
    return context;
};

interface AuthProviderProps {
    children: ReactNode;
}

export const AuthProvider = ({ children }: AuthProviderProps) => {
    const [user, setUser] = useState<User | null>(null);
    const [userReady, setUserReady] = useState<boolean>(false);

    useEffect(() => {
        setUserReady(false);
        const auth = getAuth();
        setUser(auth.currentUser);
        // Ambil session sekali saat mount

        const unsubscribe = onAuthStateChanged(auth, (u) => {
            setUser(u);
        });

        return () => unsubscribe();
    }, []);

    return <AuthContext.Provider value={{ user, userReady }}>{children}</AuthContext.Provider>;
};

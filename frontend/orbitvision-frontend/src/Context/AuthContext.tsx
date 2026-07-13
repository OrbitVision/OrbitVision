import { createContext, useContext, useState, type ReactNode } from 'react';
import { axiosLogin, axiosGetMultiple } from '../api/axios';

export interface User {
    username: string;
    email: string;
}

export interface SatellitePoint {
    latitude: number;
    longitude: number;
    altitudeKilometers: number;
    timestamp: string;
}

export interface Satellite {
    satelliteName: string;
    points: SatellitePoint[];
}

interface AuthContextValue {
    user: User | null;
    satellites: Satellite[];
    isLoadingSatellites: boolean;

    login: (username: string, password: string) => Promise<void>;
    logout: () => Promise<void>;
    loadSatellites: () => Promise<void>;
}

const AuthContext = createContext<AuthContextValue | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
    const [user, setUser] = useState<User | null>(null);
    const [satellites, setSatellites] = useState<Satellite[]>([]);
    const [isLoadingSatellites, setIsLoadingSatellites] = useState<boolean>(false);

    const login = async (username: string, password: string) => {
        const response = await axiosLogin(username, password);
        setUser(response.userData);
    };

    const logout = async () => {
        // Implementation for logout
    };

    const loadSatellites = async () => {
        setIsLoadingSatellites(true);
        try{
            const response = await axiosGetMultiple();

            setSatellites(response.data.satellites);
        } catch (error) {
            console.error('Error loading satellites:', error);
            throw error;
        } finally {
            setIsLoadingSatellites(false);
        }
    };

    return (
        <AuthContext.Provider value={{ user, satellites, isLoadingSatellites, login, logout, loadSatellites }}>
            {children}
        </AuthContext.Provider>
    );
}

export function useAuth() {
    const context = useContext(AuthContext);

    if(!context) {
        throw new Error('useAuth must be used within an AuthProvider');
    }

    return context;
}
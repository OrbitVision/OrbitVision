import { createContext, useContext, useState, type ReactNode } from 'react';
import { axiosLogin, axiosGetWatchlist, axiosAddToWatchlist, axiosDeleteFromWatchlist } from '../api/axios';
import { calculateOrbits } from '../Domain/calculateOrbits';

const USER_STORAGE_KEY = 'orbitvision_user';
const SATELLITES_STORAGE_KEY = 'orbitvision_satellites';

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
    id: number;
    satelliteName: string;
    points: SatellitePoint[];
}

interface AuthContextValue {
    user: User | null;
    satellites: Satellite[];
    isLoadingSatellites: boolean;

    login: (username: string, password: string) => Promise<void>;
    logout: () => Promise<void>;
    syncWatchlist: (selectedSatelliteIds: number[]) => Promise<void>;
}

const AuthContext = createContext<AuthContextValue | undefined>(undefined);

// Helper function to read from localStorage 
function readLocalStorage<T>(key: string, fallbackValue:T): T {
    try{
        const storedValue = localStorage.getItem(key);

        if(storedValue === null) {
            return fallbackValue;
        }

        return JSON.parse(storedValue) as T;
    }catch (error) {
        console.error(`Error reading from localStorage for key "${key}":`, error);
        localStorage.removeItem(key);
        return fallbackValue;
    }
}

export function AuthProvider({ children }: { children: ReactNode }) {
    const [user, setUser] = useState<User | null>(() => readLocalStorage<User | null>(USER_STORAGE_KEY, null));

    const [satellites, setSatellites] = useState<Satellite[]>(() => readLocalStorage<Satellite[]>(SATELLITES_STORAGE_KEY, []));

    const [isLoadingSatellites, setIsLoadingSatellites] = useState<boolean>(false);

    const login = async (username: string, password: string) => {
        const response = await axiosLogin(username, password);
        const loggedUser = response.userData;

        setUser(loggedUser);
        localStorage.setItem(USER_STORAGE_KEY, JSON.stringify(loggedUser));
    };

    const logout = async () => {
        setUser(null);
        setSatellites([]);

        localStorage.removeItem(USER_STORAGE_KEY);
        localStorage.removeItem(SATELLITES_STORAGE_KEY);
    };

    const syncWatchlist = async (selectedSatelliteIds: number[]) => {
        setIsLoadingSatellites(true);

        try {
            const currentWatchlist = await axiosGetWatchlist();

            const currentIds = currentWatchlist.map((satellite) => satellite.id);

            const idsToAdd = selectedSatelliteIds.filter((id) => !currentIds.includes(id));
            const idsToDelete = currentIds.filter((id) => !selectedSatelliteIds.includes(id));

            await Promise.all([
                ...idsToAdd.map((id) =>
                axiosAddToWatchlist(id)),
                ...idsToDelete.map((id) =>
                axiosDeleteFromWatchlist(id))
            ]);

            const updatedWatchList = await axiosGetWatchlist();

            const calculatedSatellites = calculateOrbits({satellites: updatedWatchList}).satellites;

            setSatellites(calculatedSatellites);

            localStorage.setItem(SATELLITES_STORAGE_KEY, JSON.stringify(calculatedSatellites));
        }catch (error)
        {
            console.error("Error synchronizing watchlist: ", error);
            throw error;
        }finally
        {
            setIsLoadingSatellites(false);
        }
    }

    return (
    <AuthContext.Provider value={{user,satellites,isLoadingSatellites,login,logout,syncWatchlist}}>
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
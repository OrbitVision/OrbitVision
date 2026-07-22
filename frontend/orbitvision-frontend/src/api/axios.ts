import axiosInstance from "./axiosInstance";
import { calculateOrbits } from "../Domain/calculateOrbits";

export interface LoginResponse {
    message: string;
    userData: {
        username: string;
        email: string;
    };
}

export interface RegisterResponse {
    email: string;
    password: string;
    username: string;
}

export interface SatelliteData {
    id: number;
    satelliteName: string;
    tle1: string;
    tle2: string;
    expDate: string;
}

export const axiosGetData = async () => {
    try {
        var data = await axiosInstance.get("/api/SattelliteControler")
        data.data = calculateOrbits(data.data);
        // console.log(data)
        return data;
    } catch (error) {
        console.error(error);
        throw error;
    }
}

export const axiosGetMultiple = async () => {
    try {
        var data = await axiosInstance.get("/api/SattelliteControler/getThree")
        console.log(data)
        data.data = calculateOrbits(data.data);
        console.log(data)
        return data;
    } catch (error) {
        console.error(error);
        throw error;
    }
}

export const axiosGetNames = async () => {
    try {
        var response = await axiosInstance.get("/api/SattelliteControler/allSattellitesData")
        console.log(response);
        return response.data;
    } catch (error) {
        console.error(error);
        throw error;
    }
}

export const axiosLogin = async (username: string, password: string): Promise<LoginResponse> => {
    try {
        const response = await axiosInstance.post<LoginResponse>("/api/Auth/login", { username, password });
        return response.data;
    } catch (error) {
        console.error(error);
        throw error;
    }
}

export const axiosRegister = async (username: string, email: string, password: string): Promise<RegisterResponse> => {
    try {
        const response = await axiosInstance.post<RegisterResponse>("/api/Auth/register", { username, email, password });
        return response.data;
    } catch (error) {
        console.error(error);
        throw error;
    }
}

export const axiosGetWatchlist = async () => {
    const response = await axiosInstance.get<SatelliteData[]>(
        "/api/Watchlist"
    );

    return response.data;
};

export const axiosAddToWatchlist = async (
    satelliteId: number
) => {
    const response = await axiosInstance.post(
        `/api/Watchlist/${satelliteId}`
    );

    return response.data;
};

export const axiosDeleteFromWatchlist = async (
    satelliteId: number
) => {
    const response = await axiosInstance.delete(
        `/api/Watchlist/${satelliteId}`
    );

    return response.data;
};
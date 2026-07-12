import axiosInstance from "./axiosInstance";
import { calculateOrbits } from "../Domain/calculateOrbits";


export interface LoginRequest {
    login: string;
    password: string;
}

export interface LoginResponse {
    message: string;
    Userdata: {
        username: string;
        email: string;
    };
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
        var data = await axiosInstance.get("/api/SattelliteControler/allNames")
        console.log(data);
        return data;
    } catch (error) {
        console.error(error);
        throw error;
    }
}

export const axiosLogin = async (username: string, password: string):Promise<LoginResponse> => {
    try{
        const response = await axiosInstance.post<LoginResponse>("/api/Auth/login", {username, password});
        return response.data;
    }catch(error){
        console.error(error);
        throw error;
    }
}
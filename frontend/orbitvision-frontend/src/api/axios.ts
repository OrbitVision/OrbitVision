import axiosInstance from "./axiosInstance";
import { calculateOrbits } from "../Domain/calculateOrbits";

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
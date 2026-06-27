import axiosInstance from "./axiosInstance";

export const axiosGetData = async () => {
    try {
        var data = await axiosInstance.get("/api/SattelliteControler")
        console.log(data)
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
        return data;
    } catch (error) {
        console.error(error);
        throw error;
    }
}
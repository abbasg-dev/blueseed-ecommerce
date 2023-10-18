import api from "../api";
import { UserInfo } from "interfaces/updates.model";

export const LoginService = async (username: string, password: string) => {
    const response = await api.post('login', { username, password });
    return response.data;
}

export const getUserInfo = async () => {
    const response = await api.get<UserInfo>('user-info');
    return response.data;
}

export const contactService = async ( message: string) => {
    const response = await api.post('contact-message', { message });
    return response.data;
}
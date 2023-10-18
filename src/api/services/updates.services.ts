import api from "../api";
import { QueryResult } from "interfaces/orders.model";
import { NotificationModel } from "interfaces/updates.model";

export const getNotifications = async (queryParams: string) => {
    const response = await api.get<QueryResult<NotificationModel>>(`notifications${queryParams}`);
    return response.data;
}

export const notificationSeen = async (ids: number[]) => {
    const response = await api.post(`notifications/seen`, ids);
    return response.data;
}
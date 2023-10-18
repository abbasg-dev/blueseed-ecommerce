import api from "../api";
import { RmaDetailsModel, RmaList, RmaModel, RmaReason } from "interfaces/rma.model";
import { QueryResult } from "interfaces/orders.model";

export const getRmaHistory = async () => {
    const response = await api.get<QueryResult<RmaList>>(`rma`);
    return response.data;
}

export const getRmaReasons = async () => {
    const response = await api.get<RmaReason[]>(`rma/return-reasons`);
    return response.data;
}

export const getRmaById = async (id: string | undefined) => {
    const response = await api.get<RmaDetailsModel>(`rma/${id}`);
    return response.data;
}

export const postRma = async (data: RmaModel) => {
    const response = await api.post(`rma`, data);
    return response.data;
}

export const closeRma = async (id: string) => {
    const response = await api.post(`rma/${id}/close`);
    return response.data;
}

export const voidRma = async (id: string) => {
    const response = await api.post(`rma/${id}/void`);
    return response.data;
}
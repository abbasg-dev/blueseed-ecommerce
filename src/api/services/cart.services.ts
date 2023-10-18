import api from "../api";
import { CartOrderModel } from "interfaces/cart.model";

export const Estimate = async (data: CartOrderModel) => {
    const response = await api.post('estimate', data);
    return response.data;
}

export const CreateOrder = async (data: CartOrderModel) => {
    const response = await api.post('sales-order', data);
    return response.data;
}

export const EditOrder = async (data: CartOrderModel) => {
    const response = await api.put(`sales-order/${data.id}`, data);
    return response.data;
}

export const ReceiveOrder = async (id: string) => {
    const response = await api.post(`sales-order/${id}/received`);
    return response.data;
}

export const ConfirmOrder = async (id: string) => {
    const response = await api.post(`estimate/${id}/confirm`);
    return response.data;
}

export const EditEstimate = async (data: CartOrderModel) => {
    const response = await api.put(`sales-order/estimate/${data.id}`, data);
    return response.data;
}
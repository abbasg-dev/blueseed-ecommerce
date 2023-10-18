import api from "../api";
import { CreditDetails, InvoiceModel, OrderInfo, OrderModel, QueryResult, ReceiptModel, ShippingInfo, ShippingMethod } from "interfaces/orders.model";

export const getInvoices = async (queryParams: string) => {
    const response = await api.get<QueryResult<InvoiceModel>>(`invoices${queryParams}`);
    return response.data;
}

export const getReceipts = async (queryParams: string) => {
    const response = await api.get<QueryResult<ReceiptModel>>(`receipts${queryParams}`);
    return response.data;
}

export const getOrders = async (queryParams: string) => {
    const response = await api.get<QueryResult<OrderModel>>(`sales-order${queryParams}`);
    return response.data;
}

export const getOrderById = async (id: string | undefined) => {
    const respone = await api.get<OrderInfo>(`sales-order/${id}`);
    return respone.data
};

export const getCreditById = async (id: string | undefined) => {
    const respone = await api.get<CreditDetails>(`invoices/${id}`);
    return respone.data
};

export const getShippingInfo = async () => {
    const response = await api.get<ShippingInfo[]>(`shipping-info`);
    return response.data;
}

export const getShippingMethods = async () => {
    const response = await api.get<ShippingMethod[]>(`shipping-methods`);
    return response.data;
}
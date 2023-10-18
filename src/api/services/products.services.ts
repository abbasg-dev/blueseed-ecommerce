import { Filters, Product } from "interfaces/products.model";
import api from "../api";

export const getProducts = async (queryParams: string) => {
    const response = await api.get<Product[]>(`products${queryParams}`);
    return response.data;
}

export const getFilters = async () => {
    const response = await api.get<Filters>(`filters`);
    return response.data;
}

export const getManufacturerImages = async () => {
    const response = await api.get(`manufacure-images`);
    return response.data;
}
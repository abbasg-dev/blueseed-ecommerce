export interface CartOrderModel {
    date: Date,
    shippingMethodId?: number,
    shippingInfoId?: number,
    itemOrders: OrderItem[],
    toPick: boolean,
    origin: number,
    id?: string
}

interface OrderItem {
    itemHubId: number,
    quantity: number,
    price: number
}
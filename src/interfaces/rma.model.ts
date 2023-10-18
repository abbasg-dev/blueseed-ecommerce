export interface RmaItemModel {
    itemOrderId: number,
    otherReason?: string,
    quantity: string,
    serials?: number[],
    reason?: number,
    price?: number
}

export interface RmaModel {
    items: RmaItemModel[],
    orderDate: string,
    returnMethod: number,
    salesOrderId: number
}

export interface RmaDetailsModel {
    creditMemo: string,
    date: Date,
    items: RmaDetailsItem[],
    orderNumber: string,
    returnMethod: number,
    rmaId: number,
    rmaNumber: string,
    status: number,
    subtotal: number,
    tax: number,
    totalItems: number,
    totalQuantity: number
}

interface RmaDetailsItem {
    description: string,
    itemNumber: string,
    itemOrderId: number,
    otherReason: string,
    price: number,
    quantity: number,
    reason: number,
    rmaItemId: number
    serials: string[]
}

export interface RmaList {
    creditMemo: string,
    itemsToReturn: number,
    orderNumber: string,
    returnMethod: number,
    rmaDate: Date,
    rmaId: number,
    rmaNumber: string,
    status: number
}

export interface RmaReason {
    id: number,
    reason: string
}
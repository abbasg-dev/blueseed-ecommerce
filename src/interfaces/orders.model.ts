export interface QueryResult<T> {
    count: number,
    data: T[]
}

export interface ReceiptModel {
    accountNumber: string,
    batchNumber: number,
    checkNumber: string,
    date: Date,
    payment: number,
    paymentMethod: string,
    paymentReceiptId: number,
    receiptNumber: string,
    refNumber: string,
    remark: string,
    status: number
}

export interface InvoiceModel {
    accountNumber: string,
    aging: number,
    amount: number,
    batchNumber: string,
    company: string,
    customerPo: string,
    date: Date,
    hubId: number,
    invoiceId: number,
    invoiceNumber: string,
    invoiceType: number,
    paidAmount: number,
    paidDate: Date,
    remarks: string,
    shippingInfoId: number,
    shippingMethodId: number,
    status: number
}

export interface OrderModel {
    orderDate: Date,
    orderNumber: string,
    status: number,
    totalItems: number,
    itemsQuantity: number,
    orderAmount: number,
    shipVia: string,
}

export interface OrderInfo {
    accountNumber: string,
    billingInfo: BillingInfo,
    itemOrders: OrderItem[],
    itemsQuantity: number,
    orderDate: Date,
    orderNumber: string,
    shipAmount: number,
    status: number,
    total: number,
    totalItems: number,
    shippingInfo: ShippingInfo,
    shippingMethod: ShippingMethod,
    taxTotal: number,
    shipCost: number,
    subTotal: number,
    discount: number
}

interface Address {
    address: string,
    address1: string,
    addressId: number,
    city: string,
    contact: string,
    country: string,
    mobileNumber: string,
    state: string,
    workNumExt: string,
    workNumber: string,
    zipCode: string
}

interface BillingInfo {
    company: string,
    address: Address
}

export interface OrderItem {
    description: string,
    imageUrl: string,
    itemId: number,
    itemNumber: string,
    itemOrderId: number,
    itemType: number,
    price: number,
    quantity: number,
    invoiceItemId?: number,
    serials?: Serial[],
    itemHubId: number,
    allowRma: boolean,
    taxable: boolean,
    taxAmount: number
}

export interface Serial {
    serialId: number,
    serialNo: string
}

export interface ShippingMethod {
    cost: number,
    isActive: boolean,
    name: string,
    shippingMethodId: number
}

export interface ShippingInfo {
    addressId: number,
    company: string,
    customerId: number,
    shippingInfoId: number
    address: Address
}

export interface CreditDetails {
    invoiceDate: Date,
    invoiceNumber: string,
    invoiceState: number,
    items: OrderItem[],
    paidAmount: number,
    shippingInfo: ShippingInfo,
    shippingInfoId: number,
    shippingMethod: string,
    shippingMethodId: number,
    total: number,
    subTotal: number,
    shipCost: number,
    taxTotal: number,
    discount: number
}
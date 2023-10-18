export interface IdValue {
    id: number,
    value: string,
}

export interface Product {
    categoryId: number,
    categoryName: string,
    color: string,
    colorId: number,
    isInStock: boolean,
    itemDescription: string,
    itemId: number,
    itemNumber: string,
    itemPrice: number,
    manufacturerId: number,
    manufacturerName: string,
    model: string,
    modelId: number,
    subCategoryId: number,
    subCategoryName: string,
    quantity: number,
    itemHubId: number,
    imageUrl: string,
    taxable: boolean,
    taxAmount: number
}

export interface ItemClass {
    itemClass: string,
    itemClassId: number
}

export interface ItemSubClass {
    itemClassId: number,
    itemSubClass: string,
    itemSubClassId: number
}

export interface Category extends ItemClass {
    children: ItemSubClass[]
}

export interface Filters {
    colors: IdValue[],
    manufacturers: IdValue[],
    models: IdValue[],
    classes: ItemClass[],
    subClasses: ItemSubClass[]
}
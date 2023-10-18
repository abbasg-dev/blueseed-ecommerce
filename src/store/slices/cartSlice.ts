import { createSlice, PayloadAction } from '@reduxjs/toolkit'
import { Product } from 'interfaces/products.model'

export interface CartState {
    items: Product[]
}

const initialState: CartState = {
    items: [],
}

export const cartSlice = createSlice({
    name: 'cart',
    initialState,
    reducers: {
        addItem: (state, action: PayloadAction<Product>) => {
            if (state.items.find(item => item.itemId === action.payload.itemId))
                state.items = state.items.map(item => {
                    if (item.itemId === action.payload.itemId)
                        return { ...item, quantity: item.quantity + action.payload.quantity }
                    return item
                })
            else
                state.items.push(action.payload)
        },
        removeItem: (state, action: PayloadAction<Product>) => {
            state.items = state.items.filter(item => item.itemId !== action.payload.itemId)
        },
        clearItems: (state) => {
            state.items = []
        },
        changeItemQuantity: (state, action: PayloadAction<Product>) => {
            state.items = state.items.map(item => {
                if (item.itemId === action.payload.itemId)
                    return { ...item, quantity: Number(action.payload.quantity) }
                return item
            })
        },
    },
})

export const { addItem, removeItem, clearItems, changeItemQuantity } = cartSlice.actions

export default cartSlice.reducer
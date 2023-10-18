import { createSlice, PayloadAction } from '@reduxjs/toolkit'
import { UserInfo } from 'interfaces/updates.model'

export interface UserInfoState {
    userInfo: UserInfo | null
}

const initialState: UserInfoState = {
    userInfo: null
}

export const userInfoSlice = createSlice({
    name: 'userInfo',
    initialState,
    reducers: {
        setInfo: (state, action: PayloadAction<UserInfo>) => {
            state.userInfo = action.payload
        },
    },
})

export const { setInfo } = userInfoSlice.actions

export default userInfoSlice.reducer
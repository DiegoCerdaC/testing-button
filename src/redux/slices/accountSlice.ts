import { createSlice } from "@reduxjs/toolkit";

const initialState = {
    isLoggedIn: false,
    idToken: "",
    info: {}
}

const accountSlice = createSlice({
    name: "accountSlice",
    initialState,
    reducers:{
        updateUserInfo: (state, action) => {
            state.isLoggedIn = true;
            state.idToken = action.payload.idToken
            state.info = {...action.payload.decodeIdToken}
        },
    },
})

export const {updateUserInfo} = accountSlice.actions
export default accountSlice.reducer
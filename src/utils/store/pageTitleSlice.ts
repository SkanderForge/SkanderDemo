import {createSlice, PayloadAction} from "@reduxjs/toolkit";
import {Config} from "@/config";

interface PageTitleState {
    title: string;
}

const initialState: PageTitleState = {
    title: ""
}

const pageTitleSlice = createSlice({
    initialState,
    name: 'pageTitle',
    reducers: {
        setTitle: (currentState, action: PayloadAction<string>) => {
            currentState.title = (action.payload) ? `${Config.AppName} - ${action.payload}` : Config.AppName;
            if (typeof document !== "undefined") {
                document.title = currentState.title;
            }
        }
    }
});
export const {setTitle} = pageTitleSlice.actions;
export default pageTitleSlice.reducer;
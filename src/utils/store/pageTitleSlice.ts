import {createSlice, PayloadAction} from "@reduxjs/toolkit";
import {AppName} from "@/constants";

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
            currentState.title = `${AppName} - ${action.payload}`; //Example: "Spider's Web - About us"
            if (typeof document !== "undefined") {
                document.title = currentState.title;
            }
        }
    }
});
export const {setTitle} = pageTitleSlice.actions;
export default pageTitleSlice.reducer;
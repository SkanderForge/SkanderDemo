import {createSlice, PayloadAction} from "@reduxjs/toolkit";

interface SearchQueryState {
    query: string;
    byActive: boolean,
    byPromo: boolean,
}

const initialState: SearchQueryState = {
    query: "",
    byActive: false,
    byPromo: false,
}

const searchQuerySlice = createSlice({
    initialState,
    name: 'searchQuery',
    reducers: {
        setQuery: (currentState, action: PayloadAction<string>) => {
            currentState.query = `${action.payload}`;
        },
        toggleByActive: (currentState, action: PayloadAction<boolean>) => {
            currentState.byActive = action.payload;
        },
        toggleByPromo: (currentState, action: PayloadAction<boolean>) => {
            currentState.byPromo = action.payload;
        }
    }
});
export const {setQuery, toggleByActive, toggleByPromo} = searchQuerySlice.actions;
export default searchQuerySlice.reducer;
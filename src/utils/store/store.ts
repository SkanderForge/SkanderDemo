import {configureStore} from "@reduxjs/toolkit";
import pageTitleSlice from "@/utils/store/pageTitleSlice";
import searchQuerySlice from "@/utils/store/searchQuerySlice";
import loaderSlice from "@/utils/store/loaderSlice";

export function createStore() {
    return configureStore({
        reducer: {
            pageTitle: pageTitleSlice,
            searchQuery: searchQuerySlice,
            loader: loaderSlice,
        }
    });
}

export const store = createStore();
// Auto type for useAppSelector
export type RootState = ReturnType<typeof store.getState>
export type AppDispatch = typeof store.dispatch

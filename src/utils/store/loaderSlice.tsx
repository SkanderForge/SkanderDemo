import {createSlice, PayloadAction} from "@reduxjs/toolkit";
import {renderToString} from "react-dom/server";
import Loader from "@/components/Loader";

interface LoaderState {
    visible: boolean;
    iconHtml: string;
}

const initialState: LoaderState = {
    visible: false,
    iconHtml: "",
};

const loaderSlice = createSlice({
    initialState,
    name: "loaderSlice",
    reducers: {
        showLoader: (currentState, action: PayloadAction<string>) => {
            const iconHtml = renderToString(<Loader/>);
            const element = document.querySelector(action.payload);
            let child = document.createElement("div");
            child.id = "loader";
            child.innerHTML = iconHtml;
            element?.appendChild(child);
            // @ts-ignore
            document.documentElement.style.overflow = "hide";
        },
        hideLoader: (currentState) => {
            document.getElementById("loader")?.remove();
            // @ts-ignore
            //document.documentElement.style.overflow="auto";
        },
        setStatus: (currentState, action: PayloadAction<string>) => {
            let statusHolder = document.getElementById("loader_text") as HTMLElement;
            console.log(statusHolder);
            statusHolder.innerText = action.payload;
        }
    },
});
export const {showLoader, hideLoader, setStatus} = loaderSlice.actions;
export default loaderSlice.reducer;
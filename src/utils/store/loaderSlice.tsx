import {createSlice, PayloadAction} from "@reduxjs/toolkit";
import {renderToString} from "react-dom/server";
import Loader from "@/components/Loader";

interface LoaderState {
    visible: boolean;
    iconHtml: string;
    currentElement?: HTMLElement,
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
            document.documentElement.style.overflow = "hide";
        },
        hideLoader: (currentState) => {
            let element = document.getElementById("loader");
            if (!element) throw new Error("Called hide loader before showing?");
            element.style.transition = 'opacity 1s';
            element.style.opacity = '0';
            setTimeout(() => {
                element?.remove();
            }, 1000)
        },
        setStatus: (currentState, action: PayloadAction<string>) => {
            let statusHolder = document.getElementById("loader_text") as HTMLElement;
            statusHolder.innerText = action.payload;
        },
        throwError: (currentState, action: PayloadAction<string>) => {
            let statusHolder = document.getElementById("loader_text") as HTMLElement;
            statusHolder.innerHTML = `Oopsie doopsie! We have an error.`
            statusHolder.innerHTML += `<br><span style="color:rgb(224,79,255)">${action.payload}</span>`;
            statusHolder.innerHTML += `<br>You will be redirected shortly...`;
            statusHolder.innerHTML += `<br>Does it persists? Contact us on our Discord!`;
            setTimeout(()=>{
                window.location.href = "/";
            },5000)
            throw new Error(action.payload);
        }
    },
});
export const {showLoader, hideLoader, setStatus,throwError} = loaderSlice.actions;
export default loaderSlice.reducer;
import React from 'react';
import ReactDOM from 'react-dom/client';
import reportWebVitals from './reportWebVitals';
import {RouterProvider,} from "react-router-dom";
import {Provider} from "react-redux";
import {store} from "@/utils/store/store";
import {ChakraProvider, extendTheme, ThemeConfig} from "@chakra-ui/react";
import "@fontsource/merriweather"
import {router} from "@/router";

const config: ThemeConfig = {
    initialColorMode: 'dark',
    useSystemColorMode: false,
}

const SkanderTheme = extendTheme({
    config,
    styles: {
        global: {
            html: {
                minWidth: "100vw",
                overflow: "hidden"
            },
            body: {
                fontFamily: "Merriweather,serif",
                minWidth: "100vw",
            },
        }
    },
    colors: {
        dark: {
            bg: "#201C27",
            text: "#ffffff",
            primary: "#4B1442",
            secondary: "#350e2e",
            50: "#f9f6f9",
            100: "#e8dde6",
            200: "#d5bfd1",
            300: "#be9cb8",
            400: "#b088a9",
            500: "#9f6d96",
            600: "#905685",
            700: "#7f3c73",
            800: "#732b66",
            900: "#5b154f"
        },
        light: {
            bg: "#1D264B",
            text: "whitesmoke",
            primary: "#4F86C5",
            secondary: "#386DA9",
            50: "#f4f8fb",
            100: "#d4e2f1",
            200: "#afc8e5",
            300: "#82a9d6",
            400: "#6897cd",
            500: "#4b80bc",
            600: "#3f6c9e",
            700: "#33567f",
            800: "#2b496b",
            900: "#1f354d"
        }
    },
})


const root = ReactDOM.createRoot(
    document.getElementById('root') as HTMLElement
);
root.render(
    <Provider store={store}>
        <ChakraProvider theme={SkanderTheme}>
            {/*<React.StrictMode>*/}
            <RouterProvider router={router}/>
            {/*</React.StrictMode>*/}
        </ChakraProvider>
    </Provider>
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();

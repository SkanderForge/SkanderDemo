import React from 'react';
import ReactDOM from 'react-dom/client';
import reportWebVitals from './reportWebVitals';
import {createBrowserRouter, RouterProvider,} from "react-router-dom";
import PageWrapper from "./routes/PageWrapper";
import MapDemo from "./routes/MapDemo";
import {Provider} from "react-redux";
import {store} from "@/utils/store/store";
import {ChakraProvider, extendTheme, ThemeConfig} from "@chakra-ui/react";
import "@fontsource/merriweather"
import About from "@/routes/About";


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
        }
    },
})


const router = createBrowserRouter([
    {
        path: "/",
        element: <PageWrapper/>,
        children: [
            {
                path: "/map",
                element: <MapDemo/>,
            },
            {
                path: "/about",
                element: <About/>
            }
        ],
    },
]);


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

import {createBrowserRouter} from "react-router-dom";
import PageWrapper from "@/routes/PageWrapper";
import MapDemo from "@/routes/MapDemo";
import About from "@/routes/About";
import React from "react";

export const routes = [
    {
        path: "/save/:id/map",
        element: <MapDemo/>,
        name: "Map demo"
    },
    {
        path: "/about",
        element: <About/>,
        name: "Labs"
    }
];
export const router = createBrowserRouter([
    {
        path: "/",
        element: <PageWrapper/>,
        children: routes
    },
]);
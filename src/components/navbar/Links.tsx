import React from 'react';
import {Stack} from "@chakra-ui/react";
import {Link} from "react-router-dom";
import {routes} from "@/router";

export default function Links() {
    return (
        <Stack spacing={6} direction='row' alignItems={"baseline"}>
            <Link key={"/"} to={"/"}>Home</Link>
            {routes.map((link) => {
                return <Link key={link.path} to={link.path}>{link.name}</Link>
            })}
        </Stack>
    )
}

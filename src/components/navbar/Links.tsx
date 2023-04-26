import React from 'react';
import {Stack} from "@chakra-ui/react";
import {Link} from "react-router-dom";

export default function Links() {
    return (
        <Stack spacing={6} direction='row' alignItems={"baseline"}>
            <Link to={"/"}>Home</Link>
            <Link to={"/about"}>Info</Link>
            <Link to={"/map"}>Map demo</Link>
        </Stack>
    )
}

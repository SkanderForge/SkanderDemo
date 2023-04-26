import React from 'react';
import {AppName} from "@/constants";
import {Box} from "@chakra-ui/react";

export default function AppLogo() {
    return (
        <Box fontWeight={"bold"} fontSize={"xl"} className={"font-nunito"}>{AppName}</Box>
    )
}
import React from 'react';
import {Config} from "@/config";
import {Box} from "@chakra-ui/react";

export default function AppLogo() {
    return (
        <Box fontWeight={"bold"} fontSize={"xl"} className={"font-nunito"}>{Config.AppName}</Box>
    )
}
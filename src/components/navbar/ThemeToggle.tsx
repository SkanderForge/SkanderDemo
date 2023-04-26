import React from 'react';
import {Box, Stack, useColorMode} from "@chakra-ui/react";
import {MoonIcon, SunIcon} from "@chakra-ui/icons";

export default function ThemeToggle() {
    const {colorMode, toggleColorMode} = useColorMode()
    return (
        <Stack spacing={6} cursor={"pointer"} direction='row' onClick={toggleColorMode} alignItems={"baseline"}>
            {colorMode === "dark" ? <MoonIcon/> : <SunIcon/>}
            <Box>{colorMode === "dark" ? "Follow the light" : "Thingie"}</Box>
        </Stack>
    )
}

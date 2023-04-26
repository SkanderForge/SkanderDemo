import React from 'react';
import {Button, useColorMode} from "@chakra-ui/react";

export default function LoginButton() {
    const {colorMode} = useColorMode()
    return (
        <Button variant={"outline"} colorScheme={colorMode}>Login</Button>
    )
}
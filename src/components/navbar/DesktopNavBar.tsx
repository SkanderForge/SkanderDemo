/**
 * OBSOLETE
 */

import React from 'react';
import {Flex, ResponsiveValue, Spacer, Stack} from "@chakra-ui/react";
import AppLogo from "@/components/navbar/AppLogo";
import SearchBar from "@/components/navbar/SearchBar";
import LoginButton from "@/components/navbar/LoginButton";
import {Property} from "csstype";
import ByActiveToggle from "@/components/navbar/ByActiveToggle";
import ThemeToggle from "@/components/navbar/ThemeToggle";

interface DesktopNavBarProps {
    displaySettings: ResponsiveValue<Property.Display>;
}

const DesktopNavBar: React.FC<DesktopNavBarProps> = ({displaySettings}) => {
    return (
        <Flex align="center"
              px={16}
              m={0}
              py={12}
              mb={3}
            //display={{base: "none", lg: "flex"}}
              display={displaySettings}
              backgroundColor={"white"}>

            <Stack alignItems={"center"} direction={"row"} spacing={{sm: "4em", lg: "12em"}}>
                <AppLogo/>
                <SearchBar/>
            </Stack>

            <Stack ml={3} spacing={7} direction='row'>
                <ByActiveToggle/>
                <ThemeToggle/>
            </Stack>

            <Spacer/>
            <LoginButton/>
        </Flex>
    )
}
export default DesktopNavBar;

import React from "react";

import {Flex, Grid, GridItem, useColorMode} from "@chakra-ui/react";
import AppLogo from "@/components/navbar/AppLogo";
import LoginButton from "@/components/navbar/LoginButton";
import ThemeToggle from "@/components/navbar/ThemeToggle";
import Links from "@/components/navbar/Links";

interface NavbarProps {
}

const NavBar: React.FC<NavbarProps> = () => {
    const {colorMode} = useColorMode()
    const bgColor = {light: "white", dark: "dark.primary"}

    return (
        <>
            <Flex align="center"
                  px={{base: 4, lg: 12}}
                  m={0}
                  py={{base: 2, lg: 6}}
                  mb={0}
                  fontWeight={"bold"}
                  bg={bgColor[colorMode]}
            >
                <Grid
                    templateColumns={{
                        base: "1fr 1fr",
                        lg: "repeat(12, 1fr)"
                    }}
                    templateRows={{
                        base: "1fr 1fr",
                        lg: "1fr"
                    }}
                    width={"100%"}
                    gap={3}
                    alignItems={"baseline"}
                    templateAreas={{
                        base: "'logo login' 'links themeswitch '",
                        lg: "'logo logo logo . link links links links . themeswitch themeswitch login'"
                    }}
                >
                    <GridItem gridArea={"logo"}><AppLogo/></GridItem>
                    <GridItem gridArea={"login"} style={{justifySelf: "end"}}><LoginButton/></GridItem>
                    <GridItem gridArea={"links"}><Links/></GridItem>
                    {/*<GridItem gridArea={"search"}><SearchBar/></GridItem>*/}
                    <GridItem gridArea={"themeswitch"} style={{justifySelf: "end"}}>
                        <ThemeToggle/>
                    </GridItem>
                </Grid>
            </Flex>
        </>
    );
};
export default NavBar;

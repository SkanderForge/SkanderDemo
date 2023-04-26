import React from "react";
import {Box, useColorModeValue} from "@chakra-ui/react";
import NavBar from "@/components/NavBar";
import {Outlet} from "react-router-dom";

const GenericPageWrapper: React.FC = () => {
    return (
        <>
            <Box backgroundColor={useColorModeValue("white", "dark.secondary")}
                //background={"linear-gradient(287deg, rgba(0,0,0,0.499124649859944) 0%, rgba(0,0,0,0) 100%)"}
                //background={"linear-gradient(107deg, rgba(69,13,47,1) 0%, rgba(203,63,147,1) 100%)"}
                 height={"auto"}
                 minHeight={"100vh"}
                 display={"flex"}
                 flexDirection={"column"}>
                <NavBar/>
                <Outlet/>
            </Box>
        </>
    );
};
export default GenericPageWrapper;
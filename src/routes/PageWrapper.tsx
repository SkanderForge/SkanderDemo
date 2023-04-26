import React, {useEffect} from "react";
import {Box, useColorModeValue} from "@chakra-ui/react";
import NavBar from "@/components/NavBar";
import {Outlet} from "react-router-dom";
import {useAppDispatch} from "@/utils/store/customHooks";
import {setTitle} from "@/utils/store/pageTitleSlice";
import {useLocation} from "react-router";
import {routes} from "@/router";

const GenericPageWrapper: React.FC<{ pageName?: string }> = ({pageName = ""}) => {
    const dispatch = useAppDispatch();
    dispatch(setTitle(pageName));


    const location = useLocation();

    useEffect(() => {
        let currRoute = routes.find((a) => {
            return a.path === location.pathname;
        })
        if (currRoute) dispatch(setTitle(currRoute.name));
    }, [dispatch, location]);


    return (
        <>
            <Box backgroundColor={useColorModeValue("light.secondary", "dark.secondary")}
                //background={"linear-gradient(287deg, rgba(0,0,0,0.499124649859944) 0%, rgba(0,0,0,0) 100%)"}
                //background={"linear-gradient(107deg, rgba(69,13,47,1) 0%, rgba(203,63,147,1) 100%)"}
                 height={"auto"}
                 minHeight={"100vh"}
                 display={"flex"}
                 color={useColorModeValue("light.text", "dark.text")}
                 flexDirection={"column"}>
                <NavBar/>
                <Outlet/>
            </Box>
        </>
    );
};
export default GenericPageWrapper;
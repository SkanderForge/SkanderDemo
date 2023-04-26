import React from "react";
import {Box, Flex} from "@chakra-ui/react";

interface LoaderProps {
}

const Loader: React.FC<LoaderProps> = () => {
    return (
        <Flex justify={"center"}>
            <Box style={{
                position: "absolute",
                top: 0,
                zIndex: 50,
                // backgroundColor: "rgb(24,26,152)",
                //background: "rgb(2,0,36)",
                background: "linear-gradient(162deg, rgba(2,0,36,1) 0%, rgba(9,19,121,1) 35%, rgba(218,79,192,1) 100%)",
                height: "100%",
                width: "100%",
                minHeight: "100vh",
                color: "white",
                fontSize: "50px"
            }}>
                <Box style={{
                    margin: "auto",
                    display: "flex",
                    justifyContent: "center",
                    alignItems: "center",
                    flexDirection: "column"
                }}>
                    <img src={"images/loader.gif"} alt={"Watch more anime"} style={{width: "15%"}}/>
                    <Box id={"loader_text"}>
                    </Box>
                </Box>
            </Box>
        </Flex>
    )
}

export default Loader;
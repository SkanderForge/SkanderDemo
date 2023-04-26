import React from 'react';
import {Input, InputGroup, InputRightElement} from "@chakra-ui/react";
import {SearchIcon} from "@chakra-ui/icons";
import {useAppDispatch} from "@/utils/store/customHooks";
import {setQuery} from "@/utils/store/searchQuerySlice";

export default function SearchBar() {

    const dispatch = useAppDispatch();
    const searchQueryUpdateHandler = (event: React.ChangeEvent<HTMLInputElement>) => {
        const query = event.target.value;
        dispatch(setQuery(query));
    };
    return (
        <InputGroup width={{base: "100%", md: "100%", xl: "24em"}}>
            <Input height={"3em"} onChange={searchQueryUpdateHandler} placeholder="Search"/>
            <InputRightElement><SearchIcon/></InputRightElement>
        </InputGroup>)
}

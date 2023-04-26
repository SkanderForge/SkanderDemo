import React from 'react';
import {Checkbox} from "@chakra-ui/react";
import {useAppDispatch} from "@/utils/store/customHooks";
import {toggleByActive} from "@/utils/store/searchQuerySlice";

export default function ByActiveToggle() {

    const dispatch = useAppDispatch();
    const activeToggleChangeHandler = (event: React.ChangeEvent<HTMLInputElement>) => {
        const value = event.target.checked;
        dispatch(toggleByActive(value));
    };
    return (
        <Checkbox size={"lg"} onChange={activeToggleChangeHandler}>Active</Checkbox>
    )
}
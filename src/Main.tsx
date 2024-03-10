import React, {ReactNode} from "react";
import {Box} from "@mui/material";

interface Props {
    children: ReactNode | ReactNode[];
}

export const Main = (props: Props) => {
    return <Box m={3}>
        {props.children}
    </Box>;
}

import {CircularProgress, Divider, Grid, ListItem, ListItemText} from "@mui/material";
import React from "react";
import {WorkerTestType} from "./WorkerPage";
import CheckBoxIcon from "@mui/icons-material/CheckBox";
import CheckBoxOutlineBlankIcon from "@mui/icons-material/CheckBoxOutlineBlank";

interface Props {
    testType: WorkerTestType;
    loadingTestType: WorkerTestType | null;
    finishedTestTypes: WorkerTestType[];
}

export const WorkerTestEntry = (props: Props) => {
    return (
        <>
            <Divider />
            <ListItem>
                <ListItemText primary={
                    <Grid container>
                        <Grid item xs={8}><span>{props.testType} </span></Grid>
                        <Grid item>
                            {props.loadingTestType === props.testType && <CircularProgress />}
                            {props.loadingTestType !== props.testType && (
                                props.finishedTestTypes.includes(props.testType) ? <CheckBoxIcon /> : <CheckBoxOutlineBlankIcon />
                            )}
                        </Grid>
                    </Grid>
                } />
            </ListItem>
            <Divider />
        </>
    );
}

import {WorkerTestService} from "../WorkerTestService";
import {Button, List, Paper, Stack, Typography} from "@mui/material";
import React, {useState} from "react";
import {WorkerTestEntry} from "./WorkerTestEntry";

interface Props {
    workerTestService: WorkerTestService;
    testIsRunning: boolean;
    setTestIsRunning: (value: boolean) => void;
}

export enum WorkerTestType {
    Instantiation = 'Instantiation',
    ComputationMainThread = 'ComputationMainThread',
    ComputationOneWorker = 'ComputationOneWorker',
    ComputationMultipleWorker = 'ComputationMultipleWorker',
    Transmission = 'Transmission'

}

export const WorkerPage = (props: Props) => {
    const [startButtonEnabled, setStartButtonEnabled] = useState<boolean>(true);

    const [loadingTestType, setLoadingTestType] = useState<WorkerTestType | null>(null);
    const [finishedTestTypes, setFinishedTestTypes] = useState<WorkerTestType[]>([]);

    const starteTest = async () => {
        setFinishedTestTypes([]);
        setStartButtonEnabled(false);
        props.setTestIsRunning(true);

        setLoadingTestType(WorkerTestType.Instantiation);
        await props.workerTestService.startInstantiationTest();
        setLoadingTestType(null);
        setFinishedTestTypes(current => [...current, WorkerTestType.Instantiation]);

        setLoadingTestType(WorkerTestType.ComputationMainThread);
        await new Promise(resolve => setTimeout(resolve, 1000))
        await props.workerTestService.startComputationMainThreadTest();
        setLoadingTestType(null);
        setFinishedTestTypes(current => [...current, WorkerTestType.ComputationMainThread]);

        setLoadingTestType(WorkerTestType.ComputationOneWorker);
        await props.workerTestService.startComputationOneWorkerTest();
        setLoadingTestType(null);
        setFinishedTestTypes(current => [...current, WorkerTestType.ComputationOneWorker]);

        setLoadingTestType(WorkerTestType.ComputationMultipleWorker);
        await props.workerTestService.startComputationMultipleWorkerTest();
        setLoadingTestType(null);
        setFinishedTestTypes(current => [...current, WorkerTestType.ComputationMultipleWorker]);

        setLoadingTestType(WorkerTestType.Transmission);
        await props.workerTestService.startTransmissionTest();
        await props.workerTestService.startTransmissionTest();
        await props.workerTestService.startTransmissionTest();
        await props.workerTestService.startTransmissionTest();
        setLoadingTestType(null);
        setFinishedTestTypes(current => [...current, WorkerTestType.Transmission]);
        props.setTestIsRunning(false);

        await props.workerTestService.publish();
    }


    return (
    <Stack spacing={2}>
        <Paper sx={{padding: 2}}>
            <Button variant='contained' disabled={props.testIsRunning || !startButtonEnabled} onClick={starteTest}>Starte Web Worker Test</Button>
        </Paper>
        <Paper sx={{padding: 2}}>
            <Stack>
                <h3>Web Worker Test</h3>
                <List component="nav">
                    <WorkerTestEntry testType={WorkerTestType.Instantiation} loadingTestType={loadingTestType} finishedTestTypes={finishedTestTypes} />
                    <WorkerTestEntry testType={WorkerTestType.ComputationMainThread} loadingTestType={loadingTestType} finishedTestTypes={finishedTestTypes} />
                    <WorkerTestEntry testType={WorkerTestType.ComputationOneWorker} loadingTestType={loadingTestType} finishedTestTypes={finishedTestTypes} />
                    <WorkerTestEntry testType={WorkerTestType.ComputationMultipleWorker} loadingTestType={loadingTestType} finishedTestTypes={finishedTestTypes} />
                    <WorkerTestEntry testType={WorkerTestType.Transmission} loadingTestType={loadingTestType} finishedTestTypes={finishedTestTypes} />
                </List>
            </Stack>
            <Typography>Hint: The application does not provide any feedback while the "ComputationMainThread" is running. Please do not close the window.</Typography>
        </Paper>
    </Stack>
    );
}


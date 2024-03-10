import React, {useState} from "react";
import {Main} from "../Main";
import {WorkerTestService} from "../WebWorkerTest/WorkerTestService";
import {WorkerPage} from "../WebWorkerTest/components/WorkerPage";


export const TestPage = () => {
    const [testIsRunning, setTestIsRunning] = useState<boolean>(false);

    const workerTestService = new WorkerTestService();

    return (
        <Main>
            <WorkerPage
                workerTestService={workerTestService}
                testIsRunning={testIsRunning}
                setTestIsRunning={setTestIsRunning}
            />
        </Main>
    );
}

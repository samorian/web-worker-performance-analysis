import {ComputationTestType, WebWorkerComputationTestEntry, WebWorkerTest} from ".//models/WebWorkerTest";
import {DateTime} from "luxon";
import {Globals} from "../Helper/globals";
import {Calculator} from "../Helper/Calculator";
import {wrap} from "comlink";
import {ComputationWorker} from "./workerFiles/ComputationWorker";
import {TransmissionWorker} from "./workerFiles/TransmissionWorker";
import {DataGenerator} from "../Helper/DataGenerator";

export interface TransmissionMessage {
    receivedRequestTime: number;
    data: Uint8Array;
}

const InstantiationWorkerCount = 100;

export class WorkerTestService {
    private _webWorkerTest: WebWorkerTest = {
        TimestampISO: DateTime.now().toISO(),
        UserAgent: navigator.userAgent,
        InstantiationTestEntries: [],
        ComputationTestEntries: [],
        TransmissionTestEntries: []
    };

    public async startInstantiationTest(): Promise<void> {
        const multipleWorkerInstantiation: number[] = [];
        const multipleWorker: Worker[] = [];

        for(let i = 0; i <= InstantiationWorkerCount; i++) {
            const stamp = performance.now();
            multipleWorker.push(new Worker(new URL('./workerFiles/InstantiationWorker.ts', import.meta.url)));
            multipleWorkerInstantiation.push(performance.now() - stamp);
        }

        multipleWorker.forEach((worker) => {
            worker.terminate();
        })

        const durationSum = multipleWorkerInstantiation.reduce((a, b) => a + b, 0);
        const durationAvg = durationSum / multipleWorkerInstantiation.length;

        console.log(`Instantiate ${InstantiationWorkerCount} Worker AVG Duration per Worker:`, durationAvg)

        this._webWorkerTest.InstantiationTestEntries.push({
            WorkerCount: 100,
            WorkerSize: 0,
            Duration: durationAvg
        })
        return Promise.resolve();
    }

    public async startComputationMainThreadTest(): Promise<void> {
        Globals.WorkerComputationPrimeCountLimits.forEach((limit) => {
            for(let i = 1; i < Globals.MaxWorkerComputationExecution; i++) {
                const computationTestMainThread = this._computationTestMainThread(i, limit);
                console.log('computationTestMainThread', computationTestMainThread)

                this._webWorkerTest.ComputationTestEntries.push(computationTestMainThread)
            }
        })
    }
    public async startComputationOneWorkerTest(): Promise<void> {
        for (const limit of Globals.WorkerComputationPrimeCountLimits) {
            for(let i = 1; i < Globals.MaxWorkerComputationExecution; i++) {
                const computationOneWorker = await this._computationTestOneWorker(i, limit);
                console.log('computationOneWorker', computationOneWorker)

                this._webWorkerTest.ComputationTestEntries.push(computationOneWorker)
            }
        }
    }

    public async startComputationMultipleWorkerTest(): Promise<void> {
        for (const limit of Globals.WorkerComputationPrimeCountLimits) {
            for(let i = 1; i < Globals.MaxWorkerComputationExecution; i++) {
                const computationMultipleWorker = await this._computationTestMultipleWorker(i, limit);
                console.log('computationMultipleWorker', computationMultipleWorker)

                this._webWorkerTest.ComputationTestEntries.push(computationMultipleWorker)
            }
        }
    }

    private _computationTestMainThread(executions: number, limit: number): WebWorkerComputationTestEntry {
        const timestampOverall = performance.now();
        const computationTimestamps: number[] = [];
        for(let i = 0; i < executions; i++) {
            const timestampPerComputation = performance.now();
            const result = Calculator.calculatePrimeCount(limit);
            computationTimestamps.push(performance.now() - timestampPerComputation);
        }
        const OverallComputationDuration = performance.now() - timestampOverall;
        const AvgDurationPerComputation = computationTimestamps.reduce((a, b) =>  a + b, 0) / computationTimestamps.length;
        return {
            ComputationTestType: ComputationTestType.MainThread,
            AvgDurationPerComputation,
            OverallComputationDuration,
            ComputationCount: executions,
            PrimeCountLimit: limit
        };
    }

    private async _computationTestOneWorker(executions: number, limit: number): Promise<WebWorkerComputationTestEntry> {
        const worker: Worker = new Worker(new URL('./workerFiles/ComputationWorker.ts', import.meta.url));
        const workerApi = wrap<ComputationWorker>(worker);

        const timestampOverall = performance.now();
        const computationTimestamps: number[] = [];
        for(let i = 0; i < executions; i++) {
            const timestampPerComputation = performance.now();
            const result = await workerApi.calculatePrimeCount(limit);
            computationTimestamps.push(performance.now() - timestampPerComputation);
        }
        const OverallComputationDuration = performance.now() - timestampOverall;
        const AvgDurationPerComputation = computationTimestamps.reduce((a, b) =>  a + b, 0) / computationTimestamps.length;

        worker.terminate();
        return {
            ComputationTestType: ComputationTestType.OneWorker,
            AvgDurationPerComputation,
            OverallComputationDuration,
            ComputationCount: executions,
            PrimeCountLimit: limit
        };
    }

    private async _promiseTimeWrapper<T>(promiseFunction: (args: any) => Promise<T>, args: any[]): Promise<{result: T, durationTime: number}> {
        const stamp = performance.now();
        const result = await promiseFunction(args.map(x => x));
        return {result, durationTime: performance.now() - stamp};
    }

    private async _computationTestMultipleWorker(executions: number, limit: number): Promise<WebWorkerComputationTestEntry> {
        const timestampOverall = performance.now();
        const computationTimestamps: number[] = [];

        const workerObjects: {worker: Worker, workerApi: any}[] = [];
        for(let i = 0; i < executions; i++) {
            const worker: Worker = new Worker(new URL('./workerFiles/ComputationWorker.ts', import.meta.url));
            workerObjects.push({worker, workerApi: wrap<ComputationWorker>(worker)});
        }

        const results = await Promise.all(workerObjects.map((workerObject) => this._promiseTimeWrapper(workerObject.workerApi.calculatePrimeCount, [limit])));

        results.forEach((result) => computationTimestamps.push(result.durationTime));

        workerObjects.forEach((workerObject) => workerObject.worker.terminate() );

        const OverallComputationDuration = performance.now() - timestampOverall;
        const AvgDurationPerComputation = computationTimestamps.reduce((a, b) =>  a + b, 0) / computationTimestamps.length;
        return {
            ComputationTestType: ComputationTestType.MultipleWorker,
            AvgDurationPerComputation,
            OverallComputationDuration,
            ComputationCount: executions,
            PrimeCountLimit: limit
        };
    }

    public async startTransmissionTest(): Promise<void> {
        const worker: Worker = new Worker(new URL('./workerFiles/TransmissionWorker.ts', import.meta.url));
        const workerApi = wrap<TransmissionWorker>(worker);
        await workerApi.sendBack(new Uint8Array());

        for (const value of Globals.WorkerTransmissionTestValues) {
            const stampBefore = Date.now();
            const {receivedRequestTime, data} = await workerApi.sendBack(DataGenerator.generateExperimentData(value ))
            const stampAfter = Date.now();
            this._webWorkerTest.TransmissionTestEntries.push({
                ArrayBufferSize: value,
                RequestDuration: receivedRequestTime - stampBefore,
                ReponseDuration: stampAfter - receivedRequestTime,
                RoundTripDuration: stampAfter - stampBefore
            })
            console.log(value, [receivedRequestTime - stampBefore, stampAfter - receivedRequestTime, stampAfter - stampBefore]);
        }

        worker.terminate();
    }

    public async publish(): Promise<void> {
        try {
            // Here you can publish your test data.
            console.log('Web Worker Testdaten erfolgreich übermittelt.', this._webWorkerTest)
        } catch (e) {
            console.error(e);
        }
    }
}

export interface WebWorkerTest {
    TimestampISO: string;
    UserAgent: string;
    InstantiationTestEntries: WebWorkerInstantiationTestEntry[];
    ComputationTestEntries: WebWorkerComputationTestEntry[];
    TransmissionTestEntries: WebWorkerTransmissionTestEntry[];
}

export interface WebWorkerInstantiationTestEntry {
    WorkerCount: number;
    WorkerSize: number;
    Duration: number;
}

export interface WebWorkerComputationTestEntry {
    ComputationTestType: ComputationTestType
    ComputationCount: number; // Number of Computation execution
    AvgDurationPerComputation: number;
    OverallComputationDuration: number;
    PrimeCountLimit: number;
}

export enum ComputationTestType {
    MainThread = 0,
    OneWorker = 1,
    MultipleWorker = 2
}

export interface WebWorkerTransmissionTestEntry {
    RequestDuration: number;
    ReponseDuration: number;
    RoundTripDuration: number;
    ArrayBufferSize: number;
}

import {expose} from "comlink";
import {Calculator} from "../../Helper/Calculator";

export interface IComputationWorker {
    value: number,
    calculatePrimeCount(limit: number): number;
}

const ComputationWorker: IComputationWorker = {
    value: 0,
    calculatePrimeCount: (limit: number) => Calculator.calculatePrimeCount(limit)
}

export type ComputationWorker = IComputationWorker;

expose(ComputationWorker)

export {} // If --isolatedModules in tsconfig.json is true.

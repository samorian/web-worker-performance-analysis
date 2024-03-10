import {expose} from "comlink";

export interface IInstantiationWorker {
    value: number;
    testFunction: () => void;
}

const InstantiationWorker: IInstantiationWorker = {
    value: 0,
    testFunction: () => {
        console.log('InstantiationWorker');
    }
}

export type InstantiationWorker = IInstantiationWorker;

expose(InstantiationWorker)

export {} // If --isolatedModules in tsconfig.json is true.

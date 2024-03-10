import {expose} from "comlink";
import {TransmissionMessage} from "../WorkerTestService";

export interface ITransmissionWorker {
    value: number;
    sendBack(arrayBuffer: Uint8Array): TransmissionMessage;
}

const TransmissionWorker: ITransmissionWorker = {
    value: 0,
    sendBack(arrayBuffer: Uint8Array): TransmissionMessage {
        const newBuffer = arrayBuffer.fill(2);
        return {receivedRequestTime: Date.now(), data: newBuffer}
    }
}

export type TransmissionWorker = ITransmissionWorker;

expose(TransmissionWorker)

export {} // If --isolatedModules in tsconfig.json is true.

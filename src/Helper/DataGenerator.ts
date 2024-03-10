export class DataGenerator {
    static generateExperimentData(kbValue: number): Uint8Array {
        const buffer = new ArrayBuffer(kbValue);
        const bufferArr = new Uint8Array(buffer);
        bufferArr.fill(1);
        return bufferArr;
    }
}
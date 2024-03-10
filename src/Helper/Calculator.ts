export class Calculator {
    public static calculatePrimeCount(limit: number): number {
        let count = 0;
        for(let i = 0; i <= limit; i++)
            if(this.isPrime(i))
                count++;
        return count;

    }
    public static isPrime(number: number): boolean {
        let isPrime = true;
        if (number === 1) return true;
        if (number > 1)
            for (let i = 2; i < number; i++)
                if (number % i === 0)
                    isPrime = false;
        return isPrime;
    }
}

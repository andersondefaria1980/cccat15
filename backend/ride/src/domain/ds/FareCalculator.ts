import {match} from "sinon";

abstract class FareCalculator {
    calculate(distance: number) {
        return +(distance * this.getFare()).toFixed(2);
    }
    abstract getFare(): number;
}

export class NormalFareCalculator extends FareCalculator {
    FARE: number = 2.1;
    getFare () {
        return this.FARE;
    }
}

export class OvernightFareCalculator extends FareCalculator {
    FARE: number = 3.9;
    getFare () {
        return this.FARE;
    }
}

export class SundayFareCalculator extends FareCalculator {
    FARE: number = 2.9;
    getFare () {
        return this.FARE;
    }
}

export default class FareCalculatorFactory {
    static create (date: Date) {
        const isSunday: boolean = date.getDay() === 0;
        const isOvernight: boolean = date.getHours() > 22 || date.getHours() < 6;
        if (isSunday) return new SundayFareCalculator();
        if (isOvernight) return new OvernightFareCalculator();
        return new NormalFareCalculator();
    }
}


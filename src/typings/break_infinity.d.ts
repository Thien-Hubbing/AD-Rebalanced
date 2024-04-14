export declare type DecimalSource = Decimal | number | string;
export declare type CompareResult = -1 | 0 | 1;
export declare type ExtDeciSource = Decimal | number | string | EternalDecimal;

/**
 * The Decimal's value is simply mantissa * 10^exponent.
 */
export default class Decimal {
    m: number;
    e: number;
    s: number;
    static fromMantissaExponent(mantissa: number, exponent: number): Decimal;
    static fromMantissaExponent_noNormalize(mantissa: number, exponent: number): Decimal;
    static fromDecimal(value: Decimal): Decimal;
    static fromNumber(value: number): Decimal;
    static fromString(value: string): Decimal;
    static fromValue(value: DecimalSource): Decimal;
    static fromValue_noAlloc(value: DecimalSource): Decimal;
    static abs(value: DecimalSource): Decimal;
    static neg(value: DecimalSource): Decimal;
    static negate(value: DecimalSource): Decimal;
    static negated(value: DecimalSource): Decimal;
    static sign(value: DecimalSource): number;
    static sgn(value: DecimalSource): number;
    static round(value: DecimalSource): Decimal;
    static floor(value: DecimalSource): Decimal;
    static ceil(value: DecimalSource): Decimal;
    static trunc(value: DecimalSource): Decimal;
    static add(value: DecimalSource, other: DecimalSource): Decimal;
    static plus(value: DecimalSource, other: DecimalSource): Decimal;
    static sub(value: DecimalSource, other: DecimalSource): Decimal;
    static subtract(value: DecimalSource, other: DecimalSource): Decimal;
    static minus(value: DecimalSource, other: DecimalSource): Decimal;
    static mul(value: DecimalSource, other: DecimalSource): Decimal;
    static multiply(value: DecimalSource, other: DecimalSource): Decimal;
    static times(value: DecimalSource, other: DecimalSource): Decimal;
    static div(value: DecimalSource, other: DecimalSource): Decimal;
    static divide(value: DecimalSource, other: DecimalSource): Decimal;
    static recip(value: DecimalSource): Decimal;
    static reciprocal(value: DecimalSource): Decimal;
    static reciprocate(value: DecimalSource): Decimal;
    static cmp(value: DecimalSource, other: DecimalSource): 0 | 1 | -1;
    static compare(value: DecimalSource, other: DecimalSource): 0 | 1 | -1;
    static eq(value: DecimalSource, other: DecimalSource): boolean;
    static equals(value: DecimalSource, other: DecimalSource): boolean;
    static neq(value: DecimalSource, other: DecimalSource): boolean;
    static notEquals(value: DecimalSource, other: DecimalSource): boolean;
    static lt(value: DecimalSource, other: DecimalSource): boolean;
    static lte(value: DecimalSource, other: DecimalSource): boolean;
    static gt(value: DecimalSource, other: DecimalSource): boolean;
    static gte(value: DecimalSource, other: DecimalSource): boolean;
    static max(value: DecimalSource, other: DecimalSource): Decimal;
    static min(value: DecimalSource, other: DecimalSource): Decimal;
    static clamp(value: DecimalSource, min: DecimalSource, max: DecimalSource): Decimal;
    static clampMin(value: DecimalSource, min: DecimalSource): Decimal;
    static clampMax(value: DecimalSource, max: DecimalSource): Decimal;
    static cmp_tolerance(value: DecimalSource, other: DecimalSource, tolerance: DecimalSource): 0 | 1 | -1;
    static compare_tolerance(value: DecimalSource, other: DecimalSource, tolerance: DecimalSource): 0 | 1 | -1;
    static eq_tolerance(value: DecimalSource, other: DecimalSource, tolerance: DecimalSource): boolean;
    static equals_tolerance(value: DecimalSource, other: DecimalSource, tolerance: DecimalSource): boolean;
    static neq_tolerance(value: DecimalSource, other: DecimalSource, tolerance: DecimalSource): boolean;
    static notEquals_tolerance(value: DecimalSource, other: DecimalSource, tolerance: DecimalSource): boolean;
    static lt_tolerance(value: DecimalSource, other: DecimalSource, tolerance: DecimalSource): boolean;
    static lte_tolerance(value: DecimalSource, other: DecimalSource, tolerance: DecimalSource): boolean;
    static gt_tolerance(value: DecimalSource, other: DecimalSource, tolerance: DecimalSource): boolean;
    static gte_tolerance(value: DecimalSource, other: DecimalSource, tolerance: DecimalSource): boolean;
    static log10(value: DecimalSource): number;
    static absLog10(value: DecimalSource): number;
    static pLog10(value: DecimalSource): number;
    static log(value: DecimalSource, base: number): number;
    static log2(value: DecimalSource): number;
    static ln(value: DecimalSource): number;
    static logarithm(value: DecimalSource, base: number): number;
    static pow10(value: number): Decimal;
    static pow(value: DecimalSource, other: number | Decimal): Decimal;
    static exp(value: DecimalSource): Decimal;
    static sqr(value: DecimalSource): Decimal;
    static sqrt(value: DecimalSource): Decimal;
    static cube(value: DecimalSource): Decimal;
    static cbrt(value: DecimalSource): Decimal;
    /**
     * If you're willing to spend 'resourcesAvailable' and want to buy something
     * with exponentially increasing cost each purchase (start at priceStart,
     * multiply by priceRatio, already own currentOwned), how much of it can you buy?
     * Adapted from Trimps source code.
     */
    static affordGeometricSeries(resourcesAvailable: DecimalSource, priceStart: DecimalSource, priceRatio: DecimalSource, currentOwned: number | Decimal): Decimal;
    /**
     * How much resource would it cost to buy (numItems) items if you already have currentOwned,
     * the initial price is priceStart and it multiplies by priceRatio each purchase?
     */
    static sumGeometricSeries(numItems: number | Decimal, priceStart: DecimalSource, priceRatio: DecimalSource, currentOwned: number | Decimal): Decimal;
    /**
     * If you're willing to spend 'resourcesAvailable' and want to buy something with additively
     * increasing cost each purchase (start at priceStart, add by priceAdd, already own currentOwned),
     * how much of it can you buy?
     */
    static affordArithmeticSeries(resourcesAvailable: DecimalSource, priceStart: DecimalSource, priceAdd: DecimalSource, currentOwned: DecimalSource): Decimal;
    /**
     * How much resource would it cost to buy (numItems) items if you already have currentOwned,
     * the initial price is priceStart and it adds priceAdd each purchase?
     * Adapted from http://www.mathwords.com/a/arithmetic_series.htm
     */
    static sumArithmeticSeries(numItems: DecimalSource, priceStart: DecimalSource, priceAdd: DecimalSource, currentOwned: DecimalSource): Decimal;
    /**
     * When comparing two purchases that cost (resource) and increase your resource/sec by (deltaRpS),
     * the lowest efficiency score is the better one to purchase.
     * From Frozen Cookies:
     * http://cookieclicker.wikia.com/wiki/Frozen_Cookies_(JavaScript_Add-on)#Efficiency.3F_What.27s_that.3F
     */
    static efficiencyOfPurchase(cost: DecimalSource, currentRpS: DecimalSource, deltaRpS: DecimalSource): Decimal;
    static randomDecimalForTesting(absMaxExponent: number): Decimal;
    /**
     * A number (double) with absolute value between [1, 10) OR exactly 0.
     * If mantissa is ever 10 or greater, it should be normalized
     * (divide by 10 and add 1 to exponent until it is less than 10,
     * or multiply by 10 and subtract 1 from exponent until it is 1 or greater).
     * Infinity/-Infinity/NaN will cause bad things to happen.
     */
    mantissa: number;
    /**
     * A number (integer) between -EXP_LIMIT and EXP_LIMIT.
     * Non-integral/out of bounds will cause bad things to happen.
     */
    exponent: number;
    constructor(value?: DecimalSource);
    /**
     * When mantissa is very denormalized, use this to normalize much faster.
     */
    normalize(): this | undefined;
    fromMantissaExponent(mantissa: number, exponent: number): this;
    /**
     * Well, you know what you're doing!
     */
    fromMantissaExponent_noNormalize(mantissa: number, exponent: number): this;
    fromDecimal(value: Decimal): this;
    fromNumber(value: number): this;
    fromString(value: string): this;
    fromValue(value?: DecimalSource): this;
    toNumber(): number;
    mantissaWithDecimalPlaces(places: number): number;
    toString(): string;
    toExponential(places: number): string;
    toFixed(places: number): string;
    toPrecision(places: number): string;
    valueOf(): string;
    toJSON(): string;
    toStringWithDecimalPlaces(places: number): string;
    abs(): Decimal;
    neg(): Decimal;
    negate(): Decimal;
    negated(): Decimal;
    sign(): number;
    sgn(): number;
    round(): Decimal;
    floor(): Decimal;
    ceil(): Decimal;
    trunc(): Decimal;
    add(value: DecimalSource): Decimal;
    plus(value: DecimalSource): Decimal;
    sub(value: DecimalSource): Decimal;
    subtract(value: DecimalSource): Decimal;
    minus(value: DecimalSource): Decimal;
    mul(value: DecimalSource): Decimal;
    multiply(value: DecimalSource): Decimal;
    times(value: DecimalSource): Decimal;
    div(value: DecimalSource): Decimal;
    divide(value: DecimalSource): Decimal;
    divideBy(value: DecimalSource): Decimal;
    dividedBy(value: DecimalSource): Decimal;
    recip(): Decimal;
    reciprocal(): Decimal;
    reciprocate(): Decimal;
    /**
     * -1 for less than value, 0 for equals value, 1 for greater than value
     */
    cmp(value: DecimalSource): 0 | 1 | -1;
    compare(value: DecimalSource): 0 | 1 | -1;
    eq(value: DecimalSource): boolean;
    equals(value: DecimalSource): boolean;
    neq(value: DecimalSource): boolean;
    notEquals(value: DecimalSource): boolean;
    lt(value: DecimalSource): boolean;
    lte(value: DecimalSource): boolean;
    gt(value: DecimalSource): boolean;
    gte(value: DecimalSource): boolean;
    max(value: DecimalSource): Decimal;
    min(value: DecimalSource): Decimal;
    clamp(min: DecimalSource, max: DecimalSource): Decimal;
    clampMin(min: DecimalSource): Decimal;
    clampMax(max: DecimalSource): Decimal;
    cmp_tolerance(value: DecimalSource, tolerance: DecimalSource): 0 | 1 | -1;
    compare_tolerance(value: DecimalSource, tolerance: DecimalSource): 0 | 1 | -1;
    /**
     * Tolerance is a relative tolerance, multiplied by the greater of the magnitudes of the two arguments.
     * For example, if you put in 1e-9, then any number closer to the
     * larger number than (larger number)*1e-9 will be considered equal.
     */
    eq_tolerance(value: DecimalSource, tolerance: DecimalSource): boolean;
    equals_tolerance(value: DecimalSource, tolerance: DecimalSource): boolean;
    neq_tolerance(value: DecimalSource, tolerance: DecimalSource): boolean;
    notEquals_tolerance(value: DecimalSource, tolerance: DecimalSource): boolean;
    lt_tolerance(value: DecimalSource, tolerance: DecimalSource): boolean;
    lte_tolerance(value: DecimalSource, tolerance: DecimalSource): boolean;
    gt_tolerance(value: DecimalSource, tolerance: DecimalSource): boolean;
    gte_tolerance(value: DecimalSource, tolerance: DecimalSource): boolean;
    log10(): number;
    absLog10(): number;
    pLog10(): number;
    log(base: number): number;
    log2(): number;
    ln(): number;
    logarithm(base: number): number;
    pow(value: number | Decimal): Decimal;
    pow_base(value: DecimalSource): Decimal;
    factorial(): Decimal;
    exp(): Decimal;
    sqr(): Decimal;
    sqrt(): Decimal;
    cube(): Decimal;
    cbrt(): Decimal;
    sinh(): Decimal;
    cosh(): Decimal;
    tanh(): Decimal;
    asinh(): number;
    acosh(): number;
    atanh(): number;
    /**
     * Joke function from Realm Grinder
     */
    ascensionPenalty(ascensions: number): Decimal;
    /**
     * Joke function from Cookie Clicker. It's 'egg'
     */
    egg(): Decimal;
    lessThanOrEqualTo(other: DecimalSource): boolean;
    lessThan(other: DecimalSource): boolean;
    greaterThanOrEqualTo(other: DecimalSource): boolean;
    greaterThan(other: DecimalSource): boolean;
}
/**
 * The value of the Decimal is sign * 10^10^10...^mag, with (layer) 10s. If the layer is not 0, then negative mag means it's the reciprocal of the corresponding number with positive mag.
 * Note: This is a break_eternity.js decimal file.
 * Use fixEternity(value) / breakEternity(value) to switch between break_eternity/infinity.js Decimals.
 * If you don't, expect a shi ton of errors.
 */
export default class EternalDecimal {
    static readonly dZero: EternalDecimal;
    static readonly dOne: EternalDecimal;
    static readonly dNegOne: EternalDecimal;
    static readonly dTwo: EternalDecimal;
    static readonly dTen: EternalDecimal;
    static readonly dNaN: EternalDecimal;
    static readonly dInf: EternalDecimal;
    static readonly dNegInf: EternalDecimal;
    static readonly dNumberMax: EternalDecimal;
    static readonly dNumberMin: EternalDecimal;
    private static fromStringCache;
    sign: number;
    mag: number;
    layer: number;
    constructor(value?: ExtDeciSource);
    get m(): number;
    set m(value: number);
    get e(): number;
    set e(value: number);
    get s(): number;
    set s(value: number);
    get mantissa(): number;
    set mantissa(value: number);
    get exponent(): number;
    set exponent(value: number);
    static fromComponents(sign: number, layer: number, mag: number): EternalDecimal;
    static fromComponents_noNormalize(sign: number, layer: number, mag: number): EternalDecimal;
    static fromMantissaExponent(mantissa: number, exponent: number): EternalDecimal;
    static fromMantissaExponent_noNormalize(mantissa: number, exponent: number): EternalDecimal;
    static fromDecimal(value: EternalDecimal): EternalDecimal;
    static fromNumber(value: number): EternalDecimal;
    static fromString(value: string): EternalDecimal;
    static fromValue(value: ExtDeciSource): EternalDecimal;
    /**
     * Converts a ExtDeciSource to a Decimal, without constructing a new Decimal
     * if the provided value is already a Decimal.
     *
     * As the return value could be the provided value itself, this function
     * returns a read-only Decimal to prevent accidental mutations of the value.
     * Use `new Decimal(value)` to explicitly create a writeable copy if mutation
     * is required.
     */
    static fromValue_noAlloc(value: ExtDeciSource): Readonly<Decimal>;
    static abs(value: ExtDeciSource): EternalDecimal;
    static neg(value: ExtDeciSource): EternalDecimal;
    static negate(value: ExtDeciSource): EternalDecimal;
    static negated(value: ExtDeciSource): EternalDecimal;
    static sign(value: ExtDeciSource): number;
    static sgn(value: ExtDeciSource): number;
    static round(value: ExtDeciSource): EternalDecimal;
    static floor(value: ExtDeciSource): EternalDecimal;
    static ceil(value: ExtDeciSource): EternalDecimal;
    static trunc(value: ExtDeciSource): EternalDecimal;
    static add(value: ExtDeciSource, other: ExtDeciSource): EternalDecimal;
    static plus(value: ExtDeciSource, other: ExtDeciSource): EternalDecimal;
    static sub(value: ExtDeciSource, other: ExtDeciSource): EternalDecimal;
    static subtract(value: ExtDeciSource, other: ExtDeciSource): EternalDecimal;
    static minus(value: ExtDeciSource, other: ExtDeciSource): EternalDecimal;
    static mul(value: ExtDeciSource, other: ExtDeciSource): EternalDecimal;
    static multiply(value: ExtDeciSource, other: ExtDeciSource): EternalDecimal;
    static times(value: ExtDeciSource, other: ExtDeciSource): EternalDecimal;
    static div(value: ExtDeciSource, other: ExtDeciSource): EternalDecimal;
    static divide(value: ExtDeciSource, other: ExtDeciSource): EternalDecimal;
    static recip(value: ExtDeciSource): EternalDecimal;
    static reciprocal(value: ExtDeciSource): EternalDecimal;
    static reciprocate(value: ExtDeciSource): EternalDecimal;
    static mod(value: ExtDeciSource, other: ExtDeciSource): EternalDecimal;
    static modulo(value: ExtDeciSource, other: ExtDeciSource): EternalDecimal;
    static modular(value: ExtDeciSource, other: ExtDeciSource): EternalDecimal;
    static cmp(value: ExtDeciSource, other: ExtDeciSource): CompareResult;
    static cmpabs(value: ExtDeciSource, other: ExtDeciSource): CompareResult;
    static compare(value: ExtDeciSource, other: ExtDeciSource): CompareResult;
    static isNaN(value: ExtDeciSource): boolean;
    static isFinite(value: ExtDeciSource): boolean;
    static eq(value: ExtDeciSource, other: ExtDeciSource): boolean;
    static equals(value: ExtDeciSource, other: ExtDeciSource): boolean;
    static neq(value: ExtDeciSource, other: ExtDeciSource): boolean;
    static notEquals(value: ExtDeciSource, other: ExtDeciSource): boolean;
    static lt(value: ExtDeciSource, other: ExtDeciSource): boolean;
    static lte(value: ExtDeciSource, other: ExtDeciSource): boolean;
    static gt(value: ExtDeciSource, other: ExtDeciSource): boolean;
    static gte(value: ExtDeciSource, other: ExtDeciSource): boolean;
    static max(value: ExtDeciSource, other: ExtDeciSource): EternalDecimal;
    static min(value: ExtDeciSource, other: ExtDeciSource): EternalDecimal;
    static minabs(value: ExtDeciSource, other: ExtDeciSource): EternalDecimal;
    static maxabs(value: ExtDeciSource, other: ExtDeciSource): EternalDecimal;
    static clamp(value: ExtDeciSource, min: ExtDeciSource, max: ExtDeciSource): EternalDecimal;
    static clampMin(value: ExtDeciSource, min: ExtDeciSource): EternalDecimal;
    static clampMax(value: ExtDeciSource, max: ExtDeciSource): EternalDecimal;
    static cmp_tolerance(value: ExtDeciSource, other: ExtDeciSource, tolerance: number): CompareResult;
    static compare_tolerance(value: ExtDeciSource, other: ExtDeciSource, tolerance: number): CompareResult;
    static eq_tolerance(value: ExtDeciSource, other: ExtDeciSource, tolerance: number): boolean;
    static equals_tolerance(value: ExtDeciSource, other: ExtDeciSource, tolerance: number): boolean;
    static neq_tolerance(value: ExtDeciSource, other: ExtDeciSource, tolerance: number): boolean;
    static notEquals_tolerance(value: ExtDeciSource, other: ExtDeciSource, tolerance: number): boolean;
    static lt_tolerance(value: ExtDeciSource, other: ExtDeciSource, tolerance: number): boolean;
    static lte_tolerance(value: ExtDeciSource, other: ExtDeciSource, tolerance: number): boolean;
    static gt_tolerance(value: ExtDeciSource, other: ExtDeciSource, tolerance: number): boolean;
    static gte_tolerance(value: ExtDeciSource, other: ExtDeciSource, tolerance: number): boolean;
    static pLog10(value: ExtDeciSource): EternalDecimal;
    static absLog10(value: ExtDeciSource): EternalDecimal;
    static log10(value: ExtDeciSource): EternalDecimal;
    static log(value: ExtDeciSource, base: ExtDeciSource): EternalDecimal;
    static log2(value: ExtDeciSource): EternalDecimal;
    static ln(value: ExtDeciSource): EternalDecimal;
    static logarithm(value: ExtDeciSource, base: ExtDeciSource): EternalDecimal;
    static pow(value: ExtDeciSource, other: ExtDeciSource): EternalDecimal;
    static pow10(value: ExtDeciSource): EternalDecimal;
    static root(value: ExtDeciSource, other: ExtDeciSource): EternalDecimal;
    static factorial(value: ExtDeciSource, _other?: never): EternalDecimal;
    static gamma(value: ExtDeciSource, _other?: never): EternalDecimal;
    static lngamma(value: ExtDeciSource, _other?: never): EternalDecimal;
    static exp(value: ExtDeciSource): EternalDecimal;
    static sqr(value: ExtDeciSource): EternalDecimal;
    static sqrt(value: ExtDeciSource): EternalDecimal;
    static cube(value: ExtDeciSource): EternalDecimal;
    static cbrt(value: ExtDeciSource): EternalDecimal;
    static tetrate(value: ExtDeciSource, height?: number, payload?: ExtDeciSource, linear?: boolean): EternalDecimal;
    static iteratedexp(value: ExtDeciSource, height?: number, payload?: EternalDecimal, linear?: boolean): EternalDecimal;
    static iteratedlog(value: ExtDeciSource, base?: ExtDeciSource, times?: number, linear?: boolean): EternalDecimal;
    static layeradd10(value: ExtDeciSource, diff: ExtDeciSource, linear?: boolean): EternalDecimal;
    static layeradd(value: ExtDeciSource, diff: number, base?: number, linear?: boolean): EternalDecimal;
    static slog(value: ExtDeciSource, base?: number, linear?: boolean): EternalDecimal;
    static lambertw(value: ExtDeciSource): EternalDecimal;
    static ssqrt(value: ExtDeciSource): EternalDecimal;
    static linear_sroot(value: ExtDeciSource, height: number): EternalDecimal;
    static pentate(value: ExtDeciSource, height?: number, payload?: ExtDeciSource, linear?: boolean): EternalDecimal;
    /**
     * If you're willing to spend 'resourcesAvailable' and want to buy something
     * with exponentially increasing cost each purchase (start at priceStart,
     * multiply by priceRatio, already own currentOwned), how much of it can you buy?
     * Adapted from Trimps source code.
     */
    static affordGeometricSeries(resourcesAvailable: ExtDeciSource, priceStart: ExtDeciSource, priceRatio: ExtDeciSource, currentOwned: ExtDeciSource): EternalDecimal;
    /**
     * How much resource would it cost to buy (numItems) items if you already have currentOwned,
     * the initial price is priceStart and it multiplies by priceRatio each purchase?
     */
    static sumGeometricSeries(numItems: ExtDeciSource, priceStart: ExtDeciSource, priceRatio: ExtDeciSource, currentOwned: ExtDeciSource): EternalDecimal;
    /**
     * If you're willing to spend 'resourcesAvailable' and want to buy something with additively
     * increasing cost each purchase (start at priceStart, add by priceAdd, already own currentOwned),
     * how much of it can you buy?
     */
    static affordArithmeticSeries(resourcesAvailable: ExtDeciSource, priceStart: ExtDeciSource, priceAdd: ExtDeciSource, currentOwned: ExtDeciSource): EternalDecimal;
    /**
     * How much resource would it cost to buy (numItems) items if you already have currentOwned,
     * the initial price is priceStart and it adds priceAdd each purchase?
     * Adapted from http://www.mathwords.com/a/arithmetic_series.htm
     */
    static sumArithmeticSeries(numItems: ExtDeciSource, priceStart: ExtDeciSource, priceAdd: ExtDeciSource, currentOwned: ExtDeciSource): EternalDecimal;
    /**
     * When comparing two purchases that cost (resource) and increase your resource/sec by (deltaRpS),
     * the lowest efficiency score is the better one to purchase.
     * From Frozen Cookies:
     * http://cookieclicker.wikia.com/wiki/Frozen_Cookies_(JavaScript_Add-on)#Efficiency.3F_What.27s_that.3F
     */
    static efficiencyOfPurchase(cost: ExtDeciSource, currentRpS: ExtDeciSource, deltaRpS: ExtDeciSource): EternalDecimal;
    static randomDecimalForTesting(maxLayers: number): EternalDecimal;
    static affordGeometricSeries_core(resourcesAvailable: EternalDecimal, priceStart: EternalDecimal, priceRatio: EternalDecimal, currentOwned: ExtDeciSource): EternalDecimal;
    static sumGeometricSeries_core(numItems: ExtDeciSource, priceStart: EternalDecimal, priceRatio: EternalDecimal, currentOwned: ExtDeciSource): EternalDecimal;
    static affordArithmeticSeries_core(resourcesAvailable: EternalDecimal, priceStart: EternalDecimal, priceAdd: EternalDecimal, currentOwned: EternalDecimal): EternalDecimal;
    static sumArithmeticSeries_core(numItems: EternalDecimal, priceStart: EternalDecimal, priceAdd: EternalDecimal, currentOwned: EternalDecimal): EternalDecimal;
    static efficiencyOfPurchase_core(cost: EternalDecimal, currentRpS: EternalDecimal, deltaRpS: EternalDecimal): EternalDecimal;
    normalize(): this;
    fromComponents(sign: number, layer: number, mag: number): this;
    fromComponents_noNormalize(sign: number, layer: number, mag: number): this;
    fromMantissaExponent(mantissa: number, exponent: number): this;
    fromMantissaExponent_noNormalize(mantissa: number, exponent: number): this;
    fromDecimal(value: EternalDecimal): this;
    fromNumber(value: number): this;
    fromString(value: string): EternalDecimal;
    fromValue(value: ExtDeciSource): EternalDecimal;
    toNumber(): number;
    mantissaWithDecimalPlaces(places: number): number;
    magnitudeWithDecimalPlaces(places: number): number;
    toString(): string;
    toExponential(places: number): string;
    toFixed(places: number): string;
    toPrecision(places: number): string;
    valueOf(): string;
    toJSON(): string;
    toStringWithDecimalPlaces(places: number): string;
    abs(): EternalDecimal;
    neg(): EternalDecimal;
    negate(): EternalDecimal;
    negated(): EternalDecimal;
    sgn(): number;
    round(): this | EternalDecimal;
    floor(): this | EternalDecimal;
    ceil(): this | EternalDecimal;
    trunc(): this | EternalDecimal;
    add(value: ExtDeciSource): this | EternalDecimal;
    plus(value: ExtDeciSource): EternalDecimal;
    sub(value: ExtDeciSource): EternalDecimal;
    subtract(value: ExtDeciSource): EternalDecimal;
    minus(value: ExtDeciSource): EternalDecimal;
    mul(value: ExtDeciSource): EternalDecimal;
    multiply(value: ExtDeciSource): EternalDecimal;
    times(value: ExtDeciSource): EternalDecimal;
    div(value: ExtDeciSource): EternalDecimal;
    divide(value: ExtDeciSource): EternalDecimal;
    divideBy(value: ExtDeciSource): EternalDecimal;
    dividedBy(value: ExtDeciSource): EternalDecimal;
    recip(): EternalDecimal;
    reciprocal(): EternalDecimal;
    reciprocate(): EternalDecimal;
    mod(value: ExtDeciSource): EternalDecimal;
    modulo(value: ExtDeciSource): EternalDecimal;
    modular(value: ExtDeciSource): EternalDecimal;
    /**
     * -1 for less than value, 0 for equals value, 1 for greater than value
     */
    cmp(value: ExtDeciSource): CompareResult;
    cmpabs(value: ExtDeciSource): CompareResult;
    compare(value: ExtDeciSource): CompareResult;
    isNan(): boolean;
    isFinite(): boolean;
    eq(value: ExtDeciSource): boolean;
    equals(value: ExtDeciSource): boolean;
    neq(value: ExtDeciSource): boolean;
    notEquals(value: ExtDeciSource): boolean;
    lt(value: ExtDeciSource): boolean;
    lte(value: ExtDeciSource): boolean;
    gt(value: ExtDeciSource): boolean;
    gte(value: ExtDeciSource): boolean;
    max(value: ExtDeciSource): EternalDecimal;
    min(value: ExtDeciSource): EternalDecimal;
    maxabs(value: ExtDeciSource): EternalDecimal;
    minabs(value: ExtDeciSource): EternalDecimal;
    clamp(min: ExtDeciSource, max: ExtDeciSource): EternalDecimal;
    clampMin(min: ExtDeciSource): EternalDecimal;
    clampMax(max: ExtDeciSource): EternalDecimal;
    cmp_tolerance(value: ExtDeciSource, tolerance: number): CompareResult;
    compare_tolerance(value: ExtDeciSource, tolerance: number): CompareResult;
    /**
     * Tolerance is a relative tolerance, multiplied by the greater of the magnitudes of the two arguments.
     * For example, if you put in 1e-9, then any number closer to the
     * larger number than (larger number)*1e-9 will be considered equal.
     */
    eq_tolerance(value: ExtDeciSource, tolerance: number): boolean;
    equals_tolerance(value: ExtDeciSource, tolerance: number): boolean;
    neq_tolerance(value: ExtDeciSource, tolerance: number): boolean;
    notEquals_tolerance(value: ExtDeciSource, tolerance: number): boolean;
    lt_tolerance(value: ExtDeciSource, tolerance: number): boolean;
    lte_tolerance(value: ExtDeciSource, tolerance: number): boolean;
    gt_tolerance(value: ExtDeciSource, tolerance: number): boolean;
    gte_tolerance(value: ExtDeciSource, tolerance: number): boolean;
    pLog10(): EternalDecimal;
    absLog10(): EternalDecimal;
    log10(): EternalDecimal;
    log(base: ExtDeciSource): EternalDecimal;
    log2(): EternalDecimal;
    ln(): EternalDecimal;
    logarithm(base: ExtDeciSource): EternalDecimal;
    pow(value: ExtDeciSource): EternalDecimal;
    pow10(): EternalDecimal;
    pow_base(value: ExtDeciSource): EternalDecimal;
    root(value: ExtDeciSource): EternalDecimal;
    factorial(): EternalDecimal;
    gamma(): EternalDecimal;
    lngamma(): EternalDecimal;
    exp(): EternalDecimal;
    sqr(): EternalDecimal;
    sqrt(): EternalDecimal;
    cube(): EternalDecimal;
    cbrt(): EternalDecimal;
    tetrate(height?: number, payload?: ExtDeciSource, linear?: boolean): EternalDecimal;
    iteratedexp(height?: number, payload?: EternalDecimal, linear?: boolean): EternalDecimal;
    iteratedlog(base?: ExtDeciSource, times?: number, linear?: boolean): EternalDecimal;
    slog(base?: ExtDeciSource, iterations?: number, linear?: boolean): EternalDecimal;
    slog_internal(base?: ExtDeciSource, linear?: boolean): EternalDecimal;
    static slog_critical(base: number, height: number): number;
    static tetrate_critical(base: number, height: number): number;
    static critical_section(base: number, height: number, grid: number[][], linear?: boolean): number;
    layeradd10(diff: ExtDeciSource, linear?: boolean): EternalDecimal;
    layeradd(diff: number, base: ExtDeciSource, linear?: boolean): EternalDecimal;
    lambertw(): EternalDecimal;
    ssqrt(): EternalDecimal;
    linear_sroot(degree: number): EternalDecimal;
    pentate(height?: number, payload?: ExtDeciSource, linear?: boolean): EternalDecimal;
    sin(): this | EternalDecimal;
    cos(): EternalDecimal;
    tan(): this | EternalDecimal;
    asin(): this | EternalDecimal;
    acos(): EternalDecimal;
    atan(): this | EternalDecimal;
    sinh(): EternalDecimal;
    cosh(): EternalDecimal;
    tanh(): EternalDecimal;
    asinh(): EternalDecimal;
    acosh(): EternalDecimal;
    atanh(): EternalDecimal;
    /**
     * Joke function from Realm Grinder
     */
    ascensionPenalty(ascensions: ExtDeciSource): EternalDecimal;
    /**
     * Joke function from Cookie Clicker. It's 'egg'
     */
    egg(): EternalDecimal;
    lessThanOrEqualTo(other: ExtDeciSource): boolean;
    lessThan(other: ExtDeciSource): boolean;
    greaterThanOrEqualTo(other: ExtDeciSource): boolean;
    greaterThan(other: ExtDeciSource): boolean;
}

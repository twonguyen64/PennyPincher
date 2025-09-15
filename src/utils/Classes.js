
export class PaymentPlan {
    /**
     * The payement plan for a Goal object
     * @param {number} freqInDays - The frequency of payments in days.
     * @param {string} freqStr - String representation of freqInDays. Either 'Weekly', 'Biweekly' or 'Monthly'.
     * @param {number} paymentAmount - The amount of each payment.
     * @param {number} numberOfPayments - The total number of payments required.
     */
    constructor(freqInDays, freqStr, paymentAmount, endDateString, numberOfPayments, extraTimePercentage) {
        this.freqInDays = freqInDays
        this.freqStr = freqStr
        this.paymentAmount = paymentAmount
        this.endDateString = endDateString
        this.numberOfPayments = numberOfPayments
        this.extraTimePercentage = extraTimePercentage
    }
}
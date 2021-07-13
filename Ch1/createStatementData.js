class PerformanceCalculator {
    play;
    performance;

    constructor(performance, play) {
        this.performance = performance;
        this.play = play;
    }

    get amount() {
        let result = 0;
        switch (this.play.type) {
            case "tragedy":
                result = 40000;
                if (this.performance.audience > 30) {
                    result += 1000 * (this.performance.audience - 30);
                }
                break;
            case "comedy":
                result = 30000;
                if (this.performance.audience > 20) {
                    result += 10000 + 500 * (this.performance.audience - 20);
                }
                result += 300 * this.performance.audience;
                break;
            default:
                throw new Error(`unknown type: ${(this.play.type)}`);
        }
        return result;
    }

    get volumeCredits() {
        let result = Math.max(this.performance.audience - 30, 0);
        if ("comedy" === this.play.type) result += Math.floor(this.performance.audience / 5);
        return result;
    }
}

function createPerformanceCalculator(performance, play) {
    return new PerformanceCalculator(performance, play);
}

function createStatementData(invoice, plays) {
    const statementData = {};
    statementData.customer = invoice.customer;
    statementData.performances = invoice.performances.map(enrichPerformance);
    statementData.totalAmount = totalAmount(statementData);
    statementData.totalVolumeCredits = totalVolumeCredits(statementData);
    return statementData;

    function enrichPerformance(performance) {
        const calculator = createPerformanceCalculator(performance, playFor(performance));
        const result = Object.assign({}, performance);
        result.play = calculator.play
        result.amount = calculator.amount;
        result.volumeCredits = calculator.volumeCredits;
        return result;
    }

    function totalVolumeCredits(data) {
        return data.performances.reduce((accumulator, aPerformance) => accumulator + aPerformance.volumeCredits, 0);
    }

    function totalAmount(data) {
        return data.performances.reduce((accumulator, aPerformance) => accumulator + aPerformance.amount, 0);
    }

    function playFor(perf) {
        return plays[perf.playID];
    }
}

module.exports = createStatementData;
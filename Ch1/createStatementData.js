class PerformanceCalculator {
    play;
    performance;

    constructor(performance, play) {
        this.performance = performance;
        this.play = play;
    }

    get amount() {
    }

    get volumeCredits() {
    }
}

class ComedyCalculator extends PerformanceCalculator {
    get amount() {
        let result = 30000;
        if (this.performance.audience > 20) {
            result += 10000 + 500 * (this.performance.audience - 20);
        }
        result += 300 * this.performance.audience;
        return result;
    }

    get volumeCredits() {
        let result = Math.max(this.performance.audience - 30, 0);
        result += Math.floor(this.performance.audience / 5);
        return result;
    }
}

class TragedyCalculator extends PerformanceCalculator {
    get amount() {
        let result = 40000;
        if (this.performance.audience > 30) {
            result += 1000 * (this.performance.audience - 30);
        }
        return result;
    }

    get volumeCredits() {
        return Math.max(this.performance.audience - 30, 0);
    }
}

function createPerformanceCalculator(performance, play) {
    switch (play.type) {
        case 'tragedy':
            return new TragedyCalculator(performance, play);
        case 'comedy':
            return new ComedyCalculator(performance, play);
        default:
            throw new Error(`unknown type: ${play.type}`);


    }
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
function usdFormat(number) {
    return new Intl.NumberFormat("en-US",
        {
            style: "currency", currency: "USD",
            minimumFractionDigits: 2
        }).format(number / 100);
}

function renderPlainText(statement) {
    let result = `Statement for ${statement.customer}\n`;
    for (let perf of statement.performances) {
        result += `  ${(perf.play.name)}: ${usdFormat(perf.amount)} (${perf.audience} seats)\n`;
    }
    result += `Amount owed is ${(usdFormat(statement.totalAmount))}\n`;
    result += `You earned ${(statement.totalVolumeCredits)} credits\n`;
    return result;

}


class PerformanceCalculator {
    constructor(performance) {
        this.performance = performance;
    }

    get amount() {
    }

    get volumeCredits() {

    }
}

class TragedyCalculator extends PerformanceCalculator {
    constructor(performance) {
        super(performance);
    }

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

class ComedyCalculator extends PerformanceCalculator {
    constructor(performance) {
        super(performance);
    }

    get amount() {
        let result = 30000;
        if (this.performance.audience > 20) {
            result += 10000 + 500 * (this.performance.audience - 20);
        }
        result += 300 * this.performance.audience;
        return result;
    }

    get volumeCredits() {
        return Math.max(this.performance.audience - 30, 0) + Math.floor(this.performance.audience / 5);
    }
}

function createPerformanceCalculator(performance, play) {
    switch (play.type) {
        case "tragedy":
            return new TragedyCalculator(performance);
        case "comedy":
            return new ComedyCalculator(performance);
        default:
            throw new Error(`unknown type: ${play.type}`);
    }
}

function createStatementData(invoice, plays) {
    let result = {};
    result.customer = invoice.customer;
    result.performances = invoice.performances.map((aPerformance) => {
        const performanceCalculator = createPerformanceCalculator(aPerformance, playFor(aPerformance));

        const result = Object.assign({}, aPerformance);
        result.play = playFor(result);
        result.amount = performanceCalculator.amount;
        result.volumeCredits = performanceCalculator.volumeCredits;
        return result;
    });
    result.totalAmount = getTotalAmount(result);
    result.totalVolumeCredits = getTotalVolumeCredits(result);
    return result;

    function playFor(perf) {
        return plays[perf.playID];
    }

    function getTotalAmount(data) {
        return data.performances.reduce((total, current) => total + current.amount, 0)
    }


    function getTotalVolumeCredits(data) {
        return data.performances.reduce((total, current) => total + current.volumeCredits, 0);
    }
}

function statement(invoice, plays) {
    return renderPlainText(createStatementData(invoice, plays));

}

module.exports = statement;
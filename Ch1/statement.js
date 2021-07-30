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
}

class TragedyCalculator extends PerformanceCalculator {
    constructor(performance) {
        super(performance);
    }

    get amount() {
        let tempResult = 40000;
        if (this.performance.audience > 30) {
            tempResult += 1000 * (this.performance.audience - 30);
        }
        return tempResult;
    }
    calculateTragedyCredits() {
        return Math.max(this.performance.audience - 30, 0);
    }

}

class ComedyCalculator extends PerformanceCalculator {
    constructor(performance) {
        super(performance);
    }

    get amount() {
        let tempResult = 30000;
        if (this.performance.audience > 20) {
            tempResult += 10000 + 500 * (this.performance.audience - 20);
        }
        tempResult += 300 * this.performance.audience;
        return tempResult;
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
        result.volumeCredits = volumeCreditsFor(result);
        return result;
    });
    result.totalAmount = getTotalAmount(result);
    result.totalVolumeCredits = getTotalVolumeCredits(result);
    return result;

    function playFor(perf) {
        return plays[perf.playID];
    }
    function volumeCreditsFor(perf) {
        let result = 0;
        switch (perf.play.type) {
            case "tragedy":
                result = new TragedyCalculator(perf).calculateTragedyCredits();
                break;
            case "comedy":
                result = Math.max(perf.audience - 30, 0);
                result += Math.floor(perf.audience / 5);
                break;
        }
        return result;
    }

    function getTotalAmount(data) {
        let totalAmount = 0;
        for (let perf of data.performances) {
            totalAmount += perf.amount;
        }
        return totalAmount;
    }


    function getTotalVolumeCredits(data) {
        let volumeCredits = 0;
        for (let perf of data.performances) {
            volumeCredits += perf.volumeCredits;
        }
        return volumeCredits;
    }
}

function statement(invoice, plays) {
    return renderPlainText(createStatementData(invoice, plays));

}

module.exports = statement;
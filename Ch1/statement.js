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

class TragedyCalculator {
    constructor(performance) {
        this.performance = performance;
    }

    calculateTragedyAmount() {
        let tempResult = 40000;
        if (this.performance.audience > 30) {
            tempResult += 1000 * (this.performance.audience - 30);
        }
        return tempResult;
    }

}

function createStatementData(invoice, plays) {
    let result = {};
    result.customer = invoice.customer;
    result.performances = invoice.performances.map((aPerformance) => {
        const result = Object.assign({}, aPerformance);
        result.play = playFor(result);
        result.amount = amountFor(result);
        result.volumeCredits = volumeCreditsFor(result);
        return result;
    });
    result.totalAmount = getTotalAmount(result);
    result.totalVolumeCredits = getTotalVolumeCredits(result);
    return result;

    function playFor(perf) {
        return plays[perf.playID];
    }
    function amountFor(perf) {
        let result = 0;
        switch (perf.play.type) {
            case "tragedy":
                result = new TragedyCalculator(perf).calculateTragedyAmount();
                break;
            case "comedy":
                result = 30000;
                if (perf.audience > 20) {
                    result += 10000 + 500 * (perf.audience - 20);
                }
                result += 300 * perf.audience;
                break;
            default:
                throw new Error(`unknown type: ${perf.play.type}`);
        }
        return result;
    }

    function volumeCreditsFor(perf) {
        let result = Math.max(perf.audience - 30, 0);
        if ("comedy" === perf.play.type) result += Math.floor(perf.audience / 5);
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
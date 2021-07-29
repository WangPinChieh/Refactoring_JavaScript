function renderPlainText(statement, plays) {
    let result = `Statement for ${statement.customer}\n`;
    for (let perf of statement.performances) {
        result += `  ${(perf.play.name)}: ${usdFormat(perf.amount)} (${perf.audience} seats)\n`;
    }
    result += `Amount owed is ${(usdFormat(getTotalAmount()))}\n`;
    result += `You earned ${(getTotalVolumeCredits())} credits\n`;
    return result;

    function usdFormat(number) {
        return new Intl.NumberFormat("en-US",
            {
                style: "currency", currency: "USD",
                minimumFractionDigits: 2
            }).format(number / 100);
    }

    function getTotalAmount() {
        let totalAmount = 0;
        for (let perf of statement.performances) {
            totalAmount += perf.amount;
        }
        return totalAmount;
    }

    function getTotalVolumeCredits() {
        let volumeCredits = 0;
        for (let perf of statement.performances) {
            volumeCredits += volumeCreditsFor(perf);
        }
        return volumeCredits;
    }


    function volumeCreditsFor(perf) {
        let result = Math.max(perf.audience - 30, 0);
        if ("comedy" === perf.play.type) result += Math.floor(perf.audience / 5);
        return result;
    }
}

function createStatementData(invoice, plays) {
    let result = {};
    result.customer = invoice.customer;
    result.performances = invoice.performances.map((aPerformance) => {
        const result = Object.assign({}, aPerformance);
        result.play = playFor(result);
        result.amount = amountFor(result);
        return result;
    });
    return result;

    function playFor(perf) {
        return plays[perf.playID];
    }

    function amountFor(perf) {
        let result = 0;
        switch (perf.play.type) {
            case "tragedy":
                result = 40000;
                if (perf.audience > 30) {
                    result += 1000 * (perf.audience - 30);
                }
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
}

function statement(invoice, plays) {
    const statementData = createStatementData(invoice, plays);
    return renderPlainText(statementData, plays);

}

module.exports = statement;
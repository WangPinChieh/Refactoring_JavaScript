function renderPlainText(invoice, plays) {
    let result = `Statement for ${invoice.customer}\n`;
    for (let perf of invoice.performances) {
        result += `  ${playFor(perf).name}: ${usdFormat(amountFor(perf))} (${perf.audience} seats)\n`;
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

    function playFor(perf) {
        return plays[perf.playID];
    }

    function getTotalAmount() {
        let totalAmount = 0;
        for (let perf of invoice.performances) {
            totalAmount += amountFor(perf);
        }
        return totalAmount;
    }

    function getTotalVolumeCredits() {
        let volumeCredits = 0;
        for (let perf of invoice.performances) {
            volumeCredits += volumeCreditsFor(perf);
        }
        return volumeCredits;
    }


    function amountFor(perf) {
        let result = 0;
        switch (playFor(perf).type) {
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
                throw new Error(`unknown type: ${playFor(perf).type}`);
        }
        return result;
    }

    function volumeCreditsFor(perf) {
        let result = Math.max(perf.audience - 30, 0);
        if ("comedy" === playFor(perf).type) result += Math.floor(perf.audience / 5);
        return result;
    }
}

function createStatementData(invoice, plays) {
    let result = {};
    result.customer = invoice.customer;
    result.performances = invoice.performances;
    return result;
}

function statement(invoice, plays) {
    const statementData = createStatementData(invoice, plays);
    return renderPlainText(statementData, plays);

}

module.exports = statement;
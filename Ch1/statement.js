function statement(invoice, plays) {
    let totalAmount = 0;
    let volumeCredits = 0;
    let result = `Statement for ${invoice.customer}\n`;
    const format = new Intl.NumberFormat("en-US",
        {
            style: "currency", currency: "USD",
            minimumFractionDigits: 2
        }).format;

    function playFor(perf) {
        return plays[perf.playID];
    }

    for (let perf of invoice.performances) {
        totalAmount += amountFor(perf);
    }
    for (let perf of invoice.performances) {
        volumeCredits += volumeCreditsFor(perf);
    }
    for (let perf of invoice.performances) {
        result += `  ${playFor(perf).name}: ${format(amountFor(perf) / 100)} (${perf.audience} seats)\n`;
    }

    result += `Amount owed is ${format(totalAmount / 100)}\n`;
    result += `You earned ${volumeCredits} credits\n`;
    return result;

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

module.exports = statement;
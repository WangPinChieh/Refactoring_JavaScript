function statement(invoice, plays) {
    let totalAmount = 0;
    let volumeCredits = 0;
    let result = `Statement for ${invoice.customer}\n`;
    const format = new Intl.NumberFormat("en-US",
        {
            style: "currency", currency: "USD",
            minimumFractionDigits: 2
        }).format;

    for (let perf of invoice.performances) {
        const play = plays[perf.playID];
        totalAmount += amountFor(play, perf);
        volumeCredits += volumeCreditsFor(perf, play);
        result += `  ${play.name}: ${format(amountFor(play, perf) / 100)} (${perf.audience} seats)\n`;
    }
    result += `Amount owed is ${format(totalAmount / 100)}\n`;
    result += `You earned ${volumeCredits} credits\n`;
    return result;

    function amountFor(play, perf) {
        let result = 0;

        switch (play.type) {
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
                throw new Error(`unknown type: ${play.type}`);
        }
        return result;
    }

    function volumeCreditsFor(perf, play) {
        let result = Math.max(perf.audience - 30, 0);
        if ("comedy" === play.type) result += Math.floor(perf.audience / 5);
        return result;
    }

}

module.exports = statement;
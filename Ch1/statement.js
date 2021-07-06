function renderPlainText(data) {
    let result = `Statement for ${data.customer}\n`;
    for (let perf of data.performances) {
        result += `  ${perf.play.name}: ${(format(perf.amount / 100))} (${perf.audience} seats)\n`;
    }
    result += `Amount owed is ${(format(data.totalAmount / 100))}\n`;
    result += `You earned ${(data.totalVolumeCredits)} credits\n`;
    return result;


    function format(number) {
        return new Intl.NumberFormat("en-US",
            {
                style: "currency", currency: "USD",
                minimumFractionDigits: 2
            }).format(number);
    }

}

function statement(invoice, plays) {
    const statementData = {};
    statementData.customer = invoice.customer;
    statementData.performances = invoice.performances.map(enrichPerformance);
    statementData.totalAmount = totalAmount(statementData);
    statementData.totalVolumeCredits = totalVolumeCredits(statementData);
    return renderPlainText(statementData)

    function enrichPerformance(performance) {
        const result = Object.assign({}, performance);
        result.play = playFor(result)
        result.amount = amountFor(result);
        result.volumeCredits = volumeCreditsFor(result);
        return result;
    }

    function totalVolumeCredits(data) {
        let result = 0;
        for (let perf of data.performances) {
            result += perf.volumeCredits;
        }
        return result;
    }

    function totalAmount(data) {
        return data.performances.reduce((accumulator, aPerformance) => accumulator + aPerformance.amount, 0);
    }

    function volumeCreditsFor(perf) {
        let result = Math.max(perf.audience - 30, 0);
        if ("comedy" === perf.play.type) result += Math.floor(perf.audience / 5);
        return result;
    }

    function amountFor(aPerformance) {
        let result = 0;
        switch (playFor(aPerformance).type) {
            case "tragedy":
                result = 40000;
                if (aPerformance.audience > 30) {
                    result += 1000 * (aPerformance.audience - 30);
                }
                break;
            case "comedy":
                result = 30000;
                if (aPerformance.audience > 20) {
                    result += 10000 + 500 * (aPerformance.audience - 20);
                }
                result += 300 * aPerformance.audience;
                break;
            default:
                throw new Error(`unknown type: ${(playFor(aPerformance).type)}`);
        }
        return result;
    }


    function playFor(perf) {
        return plays[perf.playID];
    }
}


module.exports = statement;
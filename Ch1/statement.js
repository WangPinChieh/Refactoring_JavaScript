const createStatementData = require('./createStatementData');

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
    return renderPlainText(createStatementData(invoice, plays))
}

module.exports = statement;
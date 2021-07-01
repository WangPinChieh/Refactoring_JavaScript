const statement = require('./statement');
describe('Statement', function () {
    function statementShouldBe(expected) {
        expect(statement(this.invoice, this.plays)).toBe(expected);
    }

    let plays = {};

    let invoice = {};

    function givenPlays(plays) {
        this.plays = plays;
    }
    function givenInvoice(invoice) {
        this.invoice = invoice
    }

    it('should be', function () {
        givenPlays({
            "hamlet": {"name": "Hamlet", "type": "tragedy"},
            "as-like": {"name": "As You Like It", "type": "comedy"},
            "othello": {"name": "Othello", "type": "tragedy"}
        });
        givenInvoice({
            "customer": "BigCo",
            "performances": [
                {
                    "playID": "hamlet",
                    "audience": 55
                },
                {
                    "playID": "as-like",
                    "audience": 35
                },
                {
                    "playID": "othello",
                    "audience": 40
                }
            ]
        });
        statementShouldBe("Statement for BigCo\n  Hamlet: $650.00 (55 seats)\n  As You Like It: $580.00 (35 seats)\n  Othello: $500.00 (40 seats)\nAmount owed is $1,730.00\nYou earned 47 credits\n");
    });
});

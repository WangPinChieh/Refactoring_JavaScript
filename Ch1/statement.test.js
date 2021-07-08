const statement = require('./statement');
describe('Statement', function () {


    let _plays = {};
    let _invoice = {};
    beforeEach(() => {
        _plays = {};
        _invoice = {};
    });

    function statementShouldBe(expected) {
        expect(statement.statement(_invoice, _plays)).toBe(expected);
    }


    function givenPlays(plays) {
        _plays = plays;
    }

    function givenInvoice(invoice) {
        _invoice = invoice
    }

    it('statement should be', function () {
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
    it('htmlStatement should be', function () {

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
        expect(statement.htmlStatement(_invoice, _plays)).toBe('<h1>Statement for BigCo</h1>\n<table>\n<tr><th>play</th><th>seats</th><th>cost</th></tr> <tr><td>Hamlet</td><td>55</td><td>$650.00</td></tr>\n <tr><td>As You Like It</td><td>35</td><td>$580.00</td></tr>\n <tr><td>Othello</td><td>40</td><td>$500.00</td></tr>\n</table>\n<p>Amount owed is <em>$1,730.00</em></p>\n<p>You earned <em>47</em> credits</p>\n');
    });


});

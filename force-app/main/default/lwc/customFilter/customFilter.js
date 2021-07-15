export class CustomFilter extends LightningElement {
    records = []

    constructor(records) {
        this.records = records;
        console.info('%c Filter Initiated ', 'background: #000000; color: #bada55', JSON.parse(JSON.stringify(this.records)));
    }

    /**
     * Returns a filtered list based on the operator and the expected value
     * @param {string} Column Name of the field to be checked
     * @param {string} Operator Type of operator to be used for check {ex: 'equals', 'notEquals'}
     * @param {Any} Expected This is the search value
     */
    _CustomFilter({ Column, Operator, Expected }) {
        return this.records.filter(item => {
            switch (Operator) {
                case 'equals':
                    return this.equals(Expected, item[Column])

                case 'notEquals': 
                    return this.notEquals(Expected, item[Column])

                case 'endsWith':
                    return this.endsWith(Expected, item[Column])

                case 'startsWith':
                    console.log('starts with');

                    return this.startsWith(Expected, item[Column])

                case 'empty':
                    return this.isEmpty(item[Column])

                case 'contains':
                    return this.contains(Expected, item[Column])

                default:
                    break;
            }
        })
    }


    /**
     * check wheather two values are same
     * @param {Any} expected expected value
     * @param {Any} actual actual value in the records
     */
    equals(expected, actual) {
        return expected == actual;
    }

    /**
     * check wheather two values are not equal
     * @param {Any} expected expected value
     * @param {Any} actual actual value in the records
     */
    notEquals(expected, actual) {
        return expected != actual;
    }

    /**
     * @param {Any} expected expected value
     * @param {Any} actual actual value in the records
     */
    startsWith(expected, actual) {
        return actual.startsWith(expected);
    }

    /**
     * @param {Any} expected expected value
     * @param {Any} actual actual value in the records
     */
    endsWith(expected, actual) {
        return actual.endsWith(expected);
    }

    /**
     * check is the field is empty or not
     * @param {Any} actual actual value in the records
     */
    isEmpty(actual) {
        if (actual) {
            return actual.length > 0 ? false : true
        } else {
            return true
        }
    }

    contains(expected, actual) {
        return actual.indexOf(expected) > 0 ? true : false
    }
}

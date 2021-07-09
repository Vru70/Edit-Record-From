import { LightningElement, api, track } from 'lwc';

export default class Filter extends LightningElement {
    @api alldata; // column data
    @api filedsList; // list fields with data-types
    @track filterState = false; // toggle Button

    isOperatorDisabled = true;
    isValueDisabled = true;

    valueType = 'text';
    get resourceOptions() {
        return [
            { label: 'Resource1', value: 'Resource1', type: 'text' },
            { label: 'Resource3', value: 'Resource3', type: 'number' },
            { label: 'Resource2', value: 'Resource2', type: 'date' },
        ];
    }

    get operatorOptions() {
        return [
            { label: 'Operator1', value: 'Operator1', type: 'text' },
            { label: 'Operator3', value: 'Operator3', type: 'number' },
            { label: 'Operator2', value: 'Operator2', type: 'date' },
        ];
    }

    handleResourceChange(event) {
        if (event.target.value != null) {
            this.isOperatorDisabled = false;
        }
    }

    handleOperatorChange(event) {
        if (event.target.value != null) {
            this.isValueDisabled = false;
        }
    }

    onChangeValue(event) {
        console.log('Value:', JSON.stringify(event.target.value));
    }

    handleFilter() { // toggle Button Function
        this.filterState = !this.filterState;
    }

    closePopover() { // close using X button
        this.filterState = false;
    }


}

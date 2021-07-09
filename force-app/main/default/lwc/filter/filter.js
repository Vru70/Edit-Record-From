import { LightningElement, api, track } from 'lwc';

export default class Filter extends LightningElement {
    @api alldata; // column data
    @api filedsList; // list fields with data-types
    @track filterState = false; // toggle Button

    isOperatorDisabled = true;
    isValueDisabled = true;

    valueType = 'text';

    filterCriteriaList = [
        { id: 1, resource: 'Resource1', operator: 'Operator1', value: 'Value1' },
        { id: 2, resource: 'Resource2', operator: 'Operator2', value: 'Value2' },
        { id: 3, resource: 'Resource3', operator: 'Operator3', value: 'Value3' },
        { id: 4, resource: 'Resource4', operator: 'Operator4', value: 'Value4' }
    ];

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
        if (event.target.value == 'Operator2') {
            this.isValueDisabled = false;
            this.valueType = 'date';
        } else {
            this.valueType = 'text';
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

    deleteFilter() {

    }

    onAddFilter() // onclick Button
    {

    }

    onRemoveAll() // onclick Button
    {

    }
}

import { LightningElement, api, track } from 'lwc';

export default class Filter extends LightningElement {
    @api alldata; // column data
    @api filedsList; // list fields with data-types

    @track filterState = false; // toggle Button

    @track resourceValue;
    @track operatorValue;
    @track userInputSearchValue;

    isOperatorDisabled = true;
    isValueDisabled = true;

    valueType = 'text';

    @track filterCriteriaList = [];// Filter values

    connectedCallback() {
        console.log('filedsList:', this.filedsList);
    }

    get resourceOptions() { //Resource == DataTable Column values
        return this.filedsList;
    }

    get operatorOptions() { //Operator eg, Starts With , end with , lessthan  etc
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
        this.resourceValue = event.target.value;
        console.log('this.resourceValue:', JSON.stringify(this.resourceValue));
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
        this.operatorValue = event.target.value;
        console.log('this.operatorValue:', JSON.stringify(this.operatorValue));
    }

    onChangeInputValue(event) {
        this.userInputSearchValue = event.target.value
        console.log('Value:', JSON.parse(JSON.stringify(this.userInputSearchValue)));
    }

    handleFilter() { // toggle Button Function
        this.filterState = !this.filterState;
    }

    closePopover() { // close using X button
        this.filterState = false;
    }

    deleteFilter(event) {
        let idToDelete = event.target.name;
        console.log('ID:', JSON.stringify(idToDelete));
        let filterCriteriaList = this.filterCriteriaList;
        let filterCriteriaListIndex;
        for (let i = 0; i < filterCriteriaList.length; i++) {
            if (idToDelete === filterCriteriaList[i].id) {
                filterCriteriaListIndex = i;
                console.log('index value:', filterCriteriaListIndex);
            }
        }
        filterCriteriaList.splice(filterCriteriaListIndex, 1);
        console.log('list after splicing', filterCriteriaList);
        console.log('delete handler called');
    }

    onAddFilter() // onclick Button
    {
        let filterVlaues = {};
        filterVlaues.id = this.idHandler();
        filterVlaues.resource = this.resourceValue;
        filterVlaues.operator = this.operatorValue;
        filterVlaues.value = this.userInputSearchValue;
        this.filterCriteriaList.push(filterVlaues);
        console.log('this.filterCriteriaList:', this.filterCriteriaList);
    }

    idHandler() {
        let len = this.filterCriteriaList.length;
        console.log('len:', len);
        return len + 1;
    }

    onRemoveAll() // onclick Button
    {
        this.filterCriteriaList = [];
    }
    
    getValueType()
    {

    }

    resetDefValues() {
        // diable drop box
        this.isOperatorDisabled = true;
        this.isValueDisabled = true;

        // clear all value
        this.resourceValue = null;
        this.operatorValue = null;
        this.userInputSearchValue = null;


    }

    disableBoxOpt() {

    }

}

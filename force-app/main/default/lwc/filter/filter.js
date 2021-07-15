import { LightningElement, api, track } from 'lwc';

export default class Filter extends LightningElement {

    @track filterCriteriaList = [];// Filter values 
    @api filedsList; // list fields with data-types 
    //eg. { label: "Account Name", fieldName: "Name", type: "string" }

    @track filterState = false; // toggle Button

    @track resourceValue;
    @track operatorValue;
    @track resourceName;
    @track operatorName;
    @track userInputSearchValue;
    @track valueType; // eg, text , date ,email,etc

    isOperatorDisabled = true;
    isValueDisabled = true;

    trackFielterId = 0;

    // operatorOptions
    operatorOption = []; // Actualy return by get method
    stringOption = [
        { label: 'equals', value: 'equals' },
        { label: 'not equal to', value: 'notequalto' },
        { label: 'contains', value: 'contains' },
        { label: 'starts with', value: 'startswith' },
        { label: 'ends with', value: 'endswith' }
    ];

    connectedCallback() {
        console.log('filedsList:', JSON.parse(JSON.stringify(this.filedsList)));
    }

    get resourceOptions() { //Resource == DataTable Column values
        return this.filedsList;
    }

    get operatorOptions() { //Operator eg, Starts With , end with , lessthan  etc
        switch (this.valueType) {
            case 'string':
            case 'url':
            case 'email':
                this.operatorOption = this.stringOption;
                break;
            case 'double':
                alert('This is double');
                break;
            case 'picklist':
                alert('This is picklist');
                break;
            case 'datetime':
                alert('This is datetime');
                break;
            case 'time':
                alert('This is time');
                break;
            case 'date':
                alert('This is date');
                break;
            case 'currency':
                alert('This is currency');
                break;
            case 'phone':
                alert('This is phone');
                break;
            default:
                this.operatorOption = this.stringOption;
                break;
        }
        return this.operatorOption;
    }

    handleResourceChange(event) {
        if (event.target.value != null) {
            this.isOperatorDisabled = false;
        }
        this.resourceValue = event.target.value;
        this.resourceName = this.filedsList.find(opt => opt.value === event.target.value).label;
        console.log('this.resourceValue:', JSON.stringify(this.resourceValue));
        console.log('this.resourceName:', JSON.stringify(this.resourceName));
        this.getValueType();
    }

    handleOperatorChange(event) {
        if (event.target.value != null) {
            this.isValueDisabled = false;
        }

        this.operatorValue = event.target.value;
        this.operatorName = this.operatorOption.find(opt => opt.value === event.target.value).label;
        console.log('this.operatorValue:', JSON.stringify(this.operatorValue));
    }

    onChangeInputValue(event) {
        let temp = event.target.value;
        this.userInputSearchValue = temp.toLowerCase();
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
        this.handlefilterCriteriaListChange(); // will pass filterCriteriaList value to parent
    }

    onAddFilter() // onclick Button
    {
        // adding component to filterCriteriaList list
        let filterVlaues = {};
        filterVlaues.id = this.trackFielterId + 1;
        filterVlaues.resource = this.resourceValue;
        filterVlaues.operator = this.operatorValue;
        filterVlaues.resourceName = this.resourceName;
        filterVlaues.operatorName = this.operatorName;
        filterVlaues.value = this.userInputSearchValue;
        this.filterCriteriaList.push(filterVlaues);
        console.log('this.filterCriteriaList:', this.filterCriteriaList);

        this.handlefilterCriteriaListChange(); // will pass filterCriteriaList value to parent
    }

    onRemoveAll() // onclick Button
    {
        this.filterCriteriaList = [];
        this.handlefilterCriteriaListChange(); // will pass filterCriteriaList value to parent
    }

    getValueType() {
        let field = this.filedsList.filter(key => key.value === this.resourceValue);
        let dataType = JSON.parse(JSON.stringify(field[0]));
        this.valueType = dataType.type;
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

    onEditFilter(event) // will edit added condition from List
    {
        console.log('event.currentTarget.id:', event.currentTarget.id);
        console.log('event.currentTarget.dataset.id:', event.currentTarget.dataset.id);
        console.log('event.Target.id:', event.target.id);
        console.log('event.Target.dataset.id:', event.target.dataset.id);
    }

    handlefilterCriteriaListChange() {
        console.log('inside handlefilterCriteriaListChange');
        // Creates the event with the data.
        const selectedEvent = new CustomEvent("filtercriteriachange", {
            detail: this.filterCriteriaList
        });

        //.
        this.dispatchEvent(selectedEvent);
        console.log(' Dispatches the event');
    }
}

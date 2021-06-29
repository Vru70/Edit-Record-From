/**
 * @author            : Vrushabh Uprikar
 * @last modified on  : 06-29-2021
 * @last modified by  : Vrushabh Uprikar
 * Modifications Log 
 * Ver   Date         Author             Modification
 * 1.0   06-25-2021   Vrushabh Uprikar   Initial Version
**/
import { LightningElement, wire, api, track } from 'lwc';
import { refreshApex } from '@salesforce/apex';
import getAccs from '@salesforce/apex/SearchReplaceController.getAccs';
import updateRecords from '@salesforce/apex/SearchReplaceController.updateRecords';

const columns = [{
    label: 'Name',
    fieldName: 'Name',
    type: 'text',
},
{
    label: 'Id',
    fieldName: 'Id',
    type: 'text'
},
{
    label: 'Phone',
    fieldName: 'Phone',
    type: 'text'
},
{
    label: 'Account Number',
    fieldName: 'AccountNumber',
    type: 'text'
}
];
export default class SearchReplace_datatable extends LightningElement {
    @track value;
    @track error;
    @track data;
    @track searchKey = '';
    @track replacetext = [];


    @track data = [];
    @track columns;

    @track fieldOption = '';

    connectedCallback() {
        this.callData();
    }

    callData() {
        getAccs()
            .then((data) => {
                this.data = data;
                this.columns = columns;
                this.error = undefined;
            })
            .catch(error => {
                this.error = error;
                this.data = undefined;
            });
    }

    replaceValue() {
        let data_to_replace = this.data;
        data_to_replace.forEach(element => {
            updateRecords({
                Record_Id: element.Id,
                Replace_text: this.replacetext,
                Replace_field: this.fieldOption
            });
        });
        refreshApex(this.data_to_replace);
    }

    searchDataTable() {
        var searchString = this.searchKey
        var allRecords = this.data;
        var searchResults = [];
        searchResults = allRecords.filter(key => key[this.fieldOption] == searchString)
        this.data = searchResults;

    }

    handleKeyChange(event) {
        this.searchKey = event.target.value;
        this.searchDataTable();
    }

    handleReplace() {
        console.log('replace text:', this.replacetext)
        this.replaceValue();
    }

    handelonchange(event) {
        this.replacetext = event.target.value;
    }

    // Fields

    get FieldsOptions() {
        return [
            { label: 'Name', value: 'Name' },
            { label: 'Phone', value: 'Phone' },
            { label: 'Account Number', value: 'AccountNumber' },
        ];
    }


    handleChangeFields(event) {
        this.fieldOption = event.target.value;
    }

}

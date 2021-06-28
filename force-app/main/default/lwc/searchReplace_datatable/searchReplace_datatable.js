/**
 * @author            : Vrushabh Uprikar
 * @last modified on  : 06-28-2021
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

    connectedCallback() {
        this.callData();
    }

    callData() {
        getAccs()
            .then((data) => {
                this.data = data;
                console.log('fetched data', data);
                //this.endingRecord = this.pageSize;
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
            console.log('value of id:', element.Id);
            updateRecords({
                Record_Id: element.Id,
                Replace_text: this.replacetext
            });
        });
        this.callData();
        console.log('OUTPUT : ', JSON.stringify(data_to_replace));
        refreshApex(this.data_to_replace);
    }

    searchDataTable() {
        var searchString = this.searchKey
        console.log('search key :', searchString)
        var allRecords = this.data;
        console.log('allRecords', allRecords)
        var searchResults = [];

        searchResults = allRecords.filter(key => key.Name == searchString)
        this.data = searchResults;
        console.log('search result' + searchResults);
    }

    handleKeyChange(event) {
        this.searchKey = event.target.value;
        console.log('initial search key' + JSON.stringify(this.searchKey));
        this.searchDataTable();
    }

    handleReplace() {
        console.log('replace text:', this.replacetext)
        this.replaceValue();
    }

    handelonchange(event) {
        this.replacetext = event.target.value;
    }

}

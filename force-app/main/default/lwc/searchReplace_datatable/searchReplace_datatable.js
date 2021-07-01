/**
 * @author            : Vrushabh Uprikar
 * @last modified on  : 07-01-2021
 * @last modified by  : Vrushabh Uprikar
 * Modifications Log 
 * Ver   Date         Author             Modification
 * 1.0   06-25-2021   Vrushabh Uprikar   Initial Version
**/
import { LightningElement, wire, api, track } from 'lwc';
import { refreshApex } from '@salesforce/apex';
import { ShowToastEvent } from 'lightning/platformShowToastEvent';
import getFieldsAndRecords from '@salesforce/apex/SearchReplaceController.getFieldsAndRecords';
import updateRecords from '@salesforce/apex/SearchReplaceController.updateRecords';

export default class SearchReplace_datatable extends LightningElement {

    @track error;
    @track searchKey = '';
    @track replacetext = [];

    @track allData = []; // Datatable
    @track columns;

    @track fieldOption = '';
    @track fieldOptionJSON; // list of fields option for combobox
    @track FieldsValue; // default value of combobox


    @api SFDCobjectApiName;
    @api fieldSetName;


    @track isSearchFlag = false;

    connectedCallback() {
        getFieldsAndRecords({
            strObjectApiName: this.SFDCobjectApiName,
            strfieldSetName: this.fieldSetName
        })
            .then(data => {

                let objStr = JSON.parse(data);

                let listOfFields = JSON.parse(Object.values(objStr)[1]);

                //retrieve listOfRecords from the map
                let listOfRecords = JSON.parse(Object.values(objStr)[0]);

                let items = []; //local array to prepare columns
                this.fieldOptionJSON = [];
                listOfFields.map(element => {

                    items = [...items, {
                        label: element.label,
                        fieldName: element.fieldPath
                    }];

                    //fileds for ComboBox
                    this.fieldOptionJSON = [...this.fieldOptionJSON, {
                        label: element.label,
                        value: element.fieldPath
                    }];

                });

                this.FieldsValue = this.fieldOptionJSON[0].value;
                var xx = JSON.stringify(listOfRecords);
                this.allData = JSON.parse(xx);
                this.columns = items;
                this.error = undefined;
            })
            .catch(error => {
                this.error = error;
                console.log('error', error);
                this.allData = undefined;
            });

    }

    handelonchange(event) {
        this.replacetext = event.target.value;
    }

    handleReplace() { // onClick Replace
        console.log('replace text:', this.replacetext);
        if (this.isSearchFlag && (this.replacetext != '' || this.replacetext == null)) {
            let data_to_replace = this.allData;
            data_to_replace.forEach(element => {
                updateRecords({
                    Record_Id: element.Id,
                    Replace_text: this.replacetext,
                    Replace_field: this.fieldOption
                });
            });
            refreshApex(this.data_to_replace);
        } else {
            let evt = new ShowToastEvent({
                title: 'Warning',
                message: 'Replace text should not be empty',
                variant: 'warning',
                mode: 'dismissable'
            });
            this.dispatchEvent(evt);
        }
    }

    searchDataTable() {
        var searchString = this.searchKey
        var allRecords = this.allData;
        var searchResults = [];
        searchResults = allRecords.filter(key => key[this.fieldOption] == searchString)
        this.allData = searchResults;

    }

    handleKeyChange(event) {
        this.searchKey = event.target.value;
        this.isSearchFlag = true;
        this.searchDataTable();
    }

    get FieldsOptions() { // combobox option set
        return this.fieldOptionJSON;
    }


    handleChangeFields(event) { // on chnage of combobox value
        this.fieldOption = event.target.value;
    }

}

/**
 * @author            : Vrushabh Uprikar
 * @last modified on  : 06-30-2021
 * @last modified by  : Vrushabh Uprikar
 * Modifications Log 
 * Ver   Date         Author             Modification
 * 1.0   06-25-2021   Vrushabh Uprikar   Initial Version
**/
import { LightningElement, wire, api, track } from 'lwc';
import { refreshApex } from '@salesforce/apex';
import getFieldsAndRecords from '@salesforce/apex/SearchReplaceController.getFieldsAndRecords';
import updateRecords from '@salesforce/apex/SearchReplaceController.updateRecords';

export default class SearchReplace_datatable extends LightningElement {
    @track value;
    @track error;
    @track data;
    @track searchKey = '';
    @track replacetext = [];

    @track allData = [];
    @track columns;

    @track fieldOption = '';
    @track fieldOptionJSON;

    @api SFDCobjectApiName;
    @api fieldSetName;

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

                var xx = JSON.stringify(listOfRecords);
                this.allData = JSON.parse(xx);
                this.columns = items;
                console.log('this.columns:', JSON.stringify(this.columns));
                console.log('this.fieldOptionJSON:', JSON.stringify(this.fieldOptionJSON));
                this.error = undefined;
            })
            .catch(error => {
                this.error = error;
                console.log('error', error);
                this.allData = undefined;
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


    get FieldsOptions() {
        return this.fieldOptionJSON;
    }


    handleChangeFields(event) {
        this.fieldOption = event.target.value;
        console.log('this.fieldOption :', JSON.stringify(event.target.value));
    }

}

/**
 * @author            : Vrushabh Uprikar
 * @last modified on  : 07-01-2021
 * @last modified by  : Vrushabh Uprikar
 * Modifications Log 
 * Ver   Date         Author             Modification
 * 1.0   06-25-2021   Vrushabh Uprikar   Initial Version
**/
import { LightningElement, wire, api, track } from 'lwc';
import { getRecordNotifyChange } from 'lightning/uiRecordApi';
import { ShowToastEvent } from 'lightning/platformShowToastEvent';
import getFieldsAndRecords from '@salesforce/apex/SearchReplaceController.getFieldsAndRecords';
import updateRecords from '@salesforce/apex/SearchReplaceController.updateRecords';

export default class SearchReplace_datatable extends LightningElement {

    error;
    @track searchKey = '';
    @track replacetext = [];

    @track allData = []; // Datatable
    allDataOrgCopy = []; // DatatableOrignalCpy
    @track columns;

    @track fieldOption = '';
    @track fieldOptionJSON; // list of fields option for combobox
    @track FieldsValue; // default value of combobox

    @api SFDCobjectApiName;
    @api fieldSetName;

    isSearchFlag = false;

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
                this.fieldOption = this.fieldOptionJSON[0].value;
                var xx = JSON.stringify(listOfRecords);
                this.allData = JSON.parse(xx);
                this.allDataOrgCopy = JSON.parse(xx);
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

        if (this.isSearchFlag && (this.replacetext != '' || this.replacetext == null)) {
            this.isSearchFlag = false;
            let data_to_replace = this.allData;

            data_to_replace.forEach(element => {
                updateRecords({
                    strObjectApiName: this.SFDCobjectApiName,
                    Record_Id: element.Id,
                    Replace_text: this.replacetext,
                    Replace_field: this.fieldOption
                })
                    .then(result => {
                        console.log('result:', result);
                        if (result == 'Success') {
                            const evt = new ShowToastEvent({
                                title: 'Success',
                                message: 'Rename Sucessful',
                                variant: 'success',
                                mode: 'dismissable'
                            });
                            this.dispatchEvent(evt);
                        } else {
                            const evt = new ShowToastEvent({
                                title: 'Error',
                                message: result,
                                variant: 'error',
                                mode: 'dismissable'
                            });
                            this.dispatchEvent(evt);
                        }
                    })
                    .catch((error) => {
                        console.log('error:', error);
                        const evt = new ShowToastEvent({
                            title: 'Error',
                            message: error,
                            variant: 'error',
                            mode: 'dismissable'
                        });
                        this.dispatchEvent(evt);
                    });

                getRecordNotifyChange([{ recordId: element.Id }]);
            });

            setTimeout(() => {
                this.connectedCallback();
            }, 1900);

        }
        else {
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
        var allRecords = this.allDataOrgCopy;
        var searchResults = [];
        searchResults = allRecords.filter(key => key[this.fieldOption].includes(searchString));
        this.allData = searchResults;
    }

    handleKeyChange(event) {

        this.searchKey = event.target.value;

        if (this.searchKey !== null) {
            this.isSearchFlag = true;
            this.searchDataTable();
        }
        if (this.searchKey == null || this.searchKey == '') {
            this.allData = this.allDataOrgCopy;
        }
    }

    get FieldsOptions() { // combobox option set
        return this.fieldOptionJSON;
    }

    handleChangeFields(event) { // on chnage of combobox value
        this.fieldOption = event.target.value;
    }

}

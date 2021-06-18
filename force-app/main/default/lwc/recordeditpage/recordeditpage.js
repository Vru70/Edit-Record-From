import { api, LightningElement, track } from 'lwc';

import getSObjectRecords from '@salesforce/apex/getRecordDataList.getSObjectRecords';
import setSObjectRecords from '@salesforce/apex/getRecordDataList.setSObjectRecords';
import { ShowToastEvent } from 'lightning/platformShowToastEvent';

export default class Recordeditpage extends LightningElement {
    @api recordId;              // collectes record Id 

    @api SFDCobjectApiName;     //  Object API Name eg. Account , Contact
    @api fieldSetName;          //  Name of FieldSet

    @track fieldnames;          // List of Field from FieldSet
    @track flagChanged = false; // flag for Input value changes
    @track error;               // Collected error from backend
    @track data;                // Collected data from backend

    @track variant = '';        // Toast variant
    @track title = '';          // Toast title
    @track message = '';        // Toast message

    @track loaded = true;       // Loader Flag

    fieldName;

    connectedCallback() {
        getSObjectRecords({
            SFDCobjectApiName: this.SFDCobjectApiName,
            fieldSetName: this.fieldSetName
        })
            .then((data) => {

                this.fieldnames = data;
                this.error = undefined;
                this.loaded = false;
            })
            .catch(error => {
                this.error = error;
                this.fieldnames = undefined;
                this.variant = 'error';
                this.message = '' + error;
                this.title = 'Error in Loading SObject Record';
                this.dispatchEvent(
                    new ShowToastEvent({
                        title: this.title,
                        message: this.message,
                        variant: this.variant,
                    }),
                );
                console.log('error in loading', error);
            })
    }

    handleChnage(event) {
        // console.log('Changed : ', JSON.stringify(event.target.fieldName));
        this.flagChanged = true;
    }

    handleFocusOut(event) {
        if (this.flagChanged) {
            this.fieldName = event.target.fieldName;
            this.flagChanged = false;
            console.log('fieldName :' + JSON.stringify(event.target.fieldName) + ' Value: ' + JSON.stringify(event.target.value));

            let fieldData = {};
            fieldData['Id'] = this.recordId;
            fieldData[this.fieldName] = event.target.value;
            console.log('New OBJ'+JSON.stringify(fieldData));
            setSObjectRecords({
                fieldData: JSON.stringify(fieldData),
                SFDCobjectApiName: this.SFDCobjectApiName
            })
                .then((data) => {
                    console.log('data aftr saving : ', data);
                    if (data === 'Success') {
                        this.variant = 'success';
                        var msgVar = JSON.stringify(this.fieldName).replace('__c', '');
                        msgVar = msgVar.replace('_', ' ');
                        this.message = msgVar + ' Saved Successfully';
                        this.title = 'Success';
                        this.dispatchEvent(
                            new ShowToastEvent({
                                title: this.title,
                                message: this.message,
                                variant: this.variant,
                            }),
                        );
                    } else {
                        this.variant = 'error';
                        this.message = '' + JSON.stringify(data);
                        this.title = 'Error in Saving SObject Record';
                        this.dispatchEvent(
                            new ShowToastEvent({
                                title: this.title,
                                message: this.message,
                                variant: this.variant,
                            }),
                        );
                    }
                })
                .catch(error => {
                    console.log('error in saving', error);
                    this.variant = 'error';
                    this.message = '' + JSON.stringify(error);
                    this.title = 'Error in Saving SObject Record';
                    this.dispatchEvent(
                        new ShowToastEvent({
                            title: this.title,
                            message: this.message,
                            variant: this.variant,
                        }),
                    );
                })
        }
    }
}
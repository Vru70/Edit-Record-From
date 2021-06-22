import { api, LightningElement, track } from 'lwc';

import getSObjectRecords from '@salesforce/apex/getRecordDataList.getSObjectRecords';
import setSObjectRecords from '@salesforce/apex/getRecordDataList.setSObjectRecords';
import { ShowToastEvent } from 'lightning/platformShowToastEvent';
import { NavigationMixin } from 'lightning/navigation';

export default class Recordeditpage extends NavigationMixin(LightningElement) {
    @api recordId;              // collectes record Id 

    @api SFDCobjectApiName;     //  Object API Name eg. Account , Contact
    @api fieldSetName;          //  Name of FieldSet
    @api formType;              // form Type eg, Edit , Inline Edit

    @track NewForm = false;
    @track EditForm = false;
    @track InlineEditForm = false;
    @track ReadOnlyForm = false;

    @track fieldnames;          // List of Field from FieldSet
    @track flagChanged = false; // flag for Input value changes
    @track error;               // Collected error from backend
    @track data;                // Collected data from backend

    @track variant = '';        // Toast variant
    @track title = '';          // Toast title
    @track message = '';        // Toast message

    @track loaded = true;       // Loader Flag

    fieldName;
    @api newId;
    connectedCallback() {
        if (this.formType == 'New') {
            this.NewForm = true;
            this.EditForm = false;
            this.InlineEditForm = false;
            this.ReadOnlyForm = false;

        } else if (this.formType == 'Edit') {
            this.NewForm = false;
            this.EditForm = true;
            this.InlineEditForm = false;
            this.ReadOnlyForm = false;

        } else if (this.formType == 'InlineEdit') {
            this.NewForm = false;
            this.EditForm = false;
            this.InlineEditForm = true;
            this.ReadOnlyForm = false;

        } else if (this.formType == 'ReadOnly') {
            this.NewForm = false;
            this.EditForm = false;
            this.InlineEditForm = false;
            this.ReadOnlyForm = true;

        }

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

            let fieldData = {}; // New JSON Object for Sending Data BackEnd  
            fieldData['Id'] = this.recordId;
            fieldData[this.fieldName] = event.target.value;
            console.log('New OBJ' + JSON.stringify(fieldData));
            setSObjectRecords({
                fieldData: JSON.stringify(fieldData),
                SFDCobjectApiName: this.SFDCobjectApiName
            })
                .then((data) => {
                    console.log('data aftr saving : ', data);
                    if (data === 'Success') {

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

    handleSubmit(event) {
        console.log('onsubmit event recordEditForm' + event.detail.fields);
    }
    handleSuccess(event) {
        this.newId = event.detail.id;
        console.log('onsuccess event recordEditForm', this.newId);
        this.handleSubmitNew();
    }

    handleSubmitNew() {
        console.log('IN handleSubmitNew' + this.newId + '  ' + this.SFDCobjectApiName);
        // View a custom object record.
        this[NavigationMixin.Navigate]({
            type: 'standard__recordPage',
            attributes: {
                recordId: this.newId,
                objectApiName: this.SFDCobjectApiName, // objectApiName is optional
                actionName: 'view'
            }
        });
    }
}
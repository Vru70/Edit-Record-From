import { api, LightningElement, track } from 'lwc';

import getSObjectRecords from '@salesforce/apex/getRecordDataList.getSObjectRecords';
import setSObjectRecords from '@salesforce/apex/getRecordDataList.setSObjectRecords';
import { ShowToastEvent } from 'lightning/platformShowToastEvent';

export default class Recordeditpage extends LightningElement
{
    @api recordId; // collectes record Id 

    @api SFDCobjectApiName; // collect Object API name
    @api fieldSetName; // set fieldset name 

    @track fieldnames;
    @track flagChanged = false;
    error;
    // Tost variable
    variant = '';
    title = '';
    message = '';

    connectedCallback()
    {
        getSObjectRecords({
            SFDCobjectApiName: this.SFDCobjectApiName,
            fieldSetName: this.fieldSetName
        })
            .then((data) => {

                this.fieldnames = data;
                this.error = undefined;
            })
            .catch(error => {
                this.error = error;
                this.fieldnames = undefined;
                this.variant = 'error';
                this.message = '' + error;
                this.title = 'Error in Loading SObject Record';
                showToast();
                console.log('error in loading', error);
            })
    }

    handleChnage(event)
    {
        // console.log('Changed : ', JSON.stringify(event.target.fieldName));
        this.flagChanged = true;
    }

    handleFocusOut(event)
    {
        if (this.flagChanged)
        {
            this.flagChanged = false;
            //console.log('fieldName :' + JSON.stringify(event.target.fieldName) + ' Value: ' + JSON.stringify(event.target.value));
            setSObjectRecords({
                fieldName: event.target.fieldName,
                fieldValue: event.target.value,
                recordId: this.recordId,
                SFDCobjectApiName: this.SFDCobjectApiName
            })
            .then((data) => {
                console.log('data aftr saving : ', data);
                if (data === 'Success')
                {
                    this.variant = 'success';
                    this.message = 'Saved Successfully';
                    this.title = 'Saved Successfully';
                    showToast();
                } else
                {
                    this.variant = 'error';
                    this.message = '' + data;
                    this.title = 'Error in Saving SObject Record';
                    showToast();                        
                }
                
            })
            .catch(error => {
                this.variant = 'error';
                this.message = '' + error;
                this.title = 'Error in Saving SObject Record';
                showToast();
                console.log('error in saving', error);
            })
        }
    }

    showToast()
    {
        const evt = new ShowToastEvent({
            title: this.title,
            message: this.message,
            variant: this.variant,
            mode: 'dismissable'
        });
        this.dispatchEvent(evt);
    }
}
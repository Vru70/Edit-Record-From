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

    //loader
    @track loaded = true;

    connectedCallback()
    {
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
                    this.message = JSON.stringify(fieldValue) +' Saved Successfully';
                    this.title = 'Success';
                    this.dispatchEvent(
                        new ShowToastEvent({
                            title: this.title,
                            message: this.message,
                            variant: this.variant,
                        }),
                    );
                } else
                {
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
                console.log('error in saving', error);
            })
        }
    }

}
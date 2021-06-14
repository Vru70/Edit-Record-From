import { api, LightningElement, track } from 'lwc';

import getSObjectRecords from '@salesforce/apex/getRecordDataList.getSObjectRecords';

export default class Recordeditpage extends LightningElement
{
    @api recordId; // collectes record Id 

    @api SFDCobjectApiName; // collect Object API name
    @api fieldSetName; // set fieldset name 

    @track fieldnames;

    connectedCallback()
    {
        getSObjectRecords({
            SFDCobjectApiName: this.SFDCobjectApiName,
            fieldSetName: this.fieldSetName
        })
            .then((data) => {
            
            this.fieldnames = data;
        })
        .catch(error => {
            this.error = error;
            console.log('error', error);
        })
    }

    handleChange(event)
    {


    }
}
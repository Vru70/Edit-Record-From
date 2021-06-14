import { api, LightningElement, track } from 'lwc';

import getSObjectRecords from '@salesforce/apex/getRecordDataList.getSObjectRecords';

export default class Recordeditpage extends LightningElement
{
    @api recordId; // collectes record Id 

    @api SFDCobjectApiName; // collect Object API name
    @api fieldSetName; // set fieldset name 

   // @track inputField = 'Name';
    @track fieldnames='';

    connectedCallback()
    {
        console.log('this.SFDCobjectApiName - :', this.SFDCobjectApiName);
        console.log('this.fieldSetName - :', this.fieldSetName);
        getSObjectRecords({
            SFDCobjectApiName: this.SFDCobjectApiName,
            fieldSetName: this.fieldSetName
        })
        .then((data) => {
            
            this.fieldnames = data;
            console.log('data=>:', JSON.stringify(data));

            console.log('this.fieldnames=>:', JSON.stringify(this.fieldnames));
            
        })
        .catch(error => {
            this.error = error;
            console.log('error', error);
        })

        console.log('recordId:', this.recordId);
    }
}
import { api, LightningElement, track } from 'lwc';
import getSObjectRecords from '@salesforce/apex/getRecordDataList.getSObjectRecords';

export default class Recordeditpage extends LightningElement {
    @api recordId; // collectes record Id 

    @api SFDCobjectApiName; // collect Object API name 
    @api fieldSetName; // set fieldset name 

    @track fieldsList;
    @track inputField = 'Name';


    connectedCallback()
    {
        getSObjectRecords({
            strObjectApiName: this.SFDCobjectApiName,
            strfieldSetName: this.fieldSetName
        })
            .then((data) => {
            /*
            //get the entire map
            let objStr = JSON.parse(data);
             retrieve listOfFields from the map,
            here order is reverse of the way it has been inserted in the map 
            let listOfFields = JSON.parse(Object.values(objStr)[1]);

            let items = []; //local array to prepare columns

            listOfFields.map(element =>
            {
                items = [...items, {
                    fieldName: element.fieldPath
                }];
            });

            this.columns = items;*/
            //
                this.fieldsList = data;
                console.log('this.fieldsList:', JSON.stringify(this.fieldsList));
            
        })
        .catch(error => {
            this.error = error;
            console.log('error', error);
           
        })

        console.log('recordId:', recordId);
    }
}
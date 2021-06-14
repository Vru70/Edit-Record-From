import { api, LightningElement, track} from 'lwc';

export default class RecordList extends LightningElement
{
    @track dataList;
    columnsList;


    @api SFDCobjectApiName;
    @api fieldSetName;


    handleRowAction()
    {

    }

}
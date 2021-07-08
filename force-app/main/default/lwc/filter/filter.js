import { LightningElement, api, track } from 'lwc';

export default class Filter extends LightningElement {
    @api alldata;
    @api filedsList;
    @api sObjectAPIName;
    @track filterState = false;

    handleFilter() {
        this.filterState = !this.filterState;
    }
    closePopover() {
        this.filterState = false;
    }
}

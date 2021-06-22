import { track, LightningElement } from 'lwc';
import getLoadingdata from '@salesforce/apex/loadingController.getLoadingdata';
export default class InfiniteLoading extends LightningElement {

    dataList;
    Offset;
    @track columns = [{
        label: 'Name',
        fieldName: 'Name',
        type: 'text'
    },
    {
        label: 'Email',
        fieldName: 'Email',
        type: 'email'
    },
    {
        label: 'City',
        fieldName: 'MailingCity',
        type: 'text'
    },
    ];

    contactList = [];
    limitSize = 10;
    offset = 0;
    error;

    @track title;
    totalRecordCount;

    connectedCallback() {
        this.loadData();
    }

    loadData() {
        return getLoadingdata({ limitSize: this.limitSize, offset: this.offset })
            .then(data => {
                let newRecords = [...this.contactList, ...data];
                this.contactList = newRecords;
                this.title = 'Total Loaded Records '+this.contactList.length;
                this.error = undefined;
            })
            .catch(error => {
                this.error = error;
                console.log('Error at loadData ' + error);
                this.contactList = undefined;
            });
    }

    loadMoreData(event) {
        //console.log('Loadmore fired');
        const { target } = event;
        target.isLoading = true;
        this.offset = this.offset + 10;
        this.loadData()
            .then(() => {
                target.isLoading = false;
            });
    }
}
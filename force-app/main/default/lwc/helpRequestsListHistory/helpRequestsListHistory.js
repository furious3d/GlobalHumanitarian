import { LightningElement } from 'lwc';
import findCases from '@salesforce/apex/HelpRequestController.findCases';
import pubSub from 'c/pubSub';

export default class HelpRequestListHistory extends LightningElement {
    itemsList = [];
    contactId;
    noItemsLoaded = true;
    noItemsFound = false;

    connectedCallback() {
        pubSub.subscribe('ContactIDUpdate', (params) => {
            this.contactId = params;
            this.loadHistory();
        });
    }

    loadHistory () {
        this.noItemsLoaded = true;
        this.noItemsFound = false;
        if (this.contactId != null) {
            findCases({'contactID': this.contactId})
            .then(res => {
                this.itemsList = res;
                this.noItemsLoaded = false;

                if (res.length == 0) {
                    this.noItemsFound = true;
                }
            })
            .catch(err => {
                console.error(err.body);
            });
        }
    }
}
import { LightningElement } from 'lwc';
import findCases from '@salesforce/apex/HelpRequestController.findCases';
import pubSub from 'c/pubSub';

export default class HelpRequestListHistory extends LightningElement {
    itemsList = [];
    contactId;

    loadHistory ()
    {
        if (this.contactId != null)
        {
            findCases({'contactID': this.contactId})
            .then(res => {
                this.itemsList = res;
                console.log (res);
            })
            .catch(err => {
                console.error(err.body);
            });
        }
    }
    connectedCallback()
    {
        pubSub.subscribe('ContactIDUpdate', function (params){
            this.contactId = params;
            this.loadHistory();
        });
    }
}
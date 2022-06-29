import { LightningElement } from 'lwc';

export default class HelpRequestListHistory extends LightningElement {
    staSubHistory = []

    loadHistory ()
    {
        findCases ()
        .then(res => {
            this.staSubHistory = res;
            console.log (res);
        });
    }
}
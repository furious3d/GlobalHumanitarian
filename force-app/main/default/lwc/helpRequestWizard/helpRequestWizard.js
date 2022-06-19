import { LightningElement, api } from 'lwc';
import saveRequest from '@salesforce/apex/HelpRequestController.saveRequest';
import getRequestTypes from '@salesforce/apex/HelpRequestController.getRequestTypes';
import btnSendRequest from '@salesforce/label/c.btnSendRequest';
import textheading from '@salesforce/label/c.textheading';
import firstName from '@salesforce/label/c.firstName';
import lastName from '@salesforce/label/c.lastName';
import Email from '@salesforce/label/c.Email';

export default class HelpRequestWizard extends LightningElement {
    @api showCountryProp;
    fieldsValues = {};
    labels = {
        btnSendRequest,
        textheading,
        firstName,
        lastName,
        Email
    };

    typesofassistance=[];
    saved = false;
    erSaved=false;
    disabledButton=false;

    loadData ()
    {
        getRequestTypes()
        .then(res => {
            this.typesofassistance = res;
            console.log (res);
        });
    }

    connectedCallback()
    {
        this.loadData ();
    }

    handleFieldChange(event) {
        const val = event.target.value;
        const name = event.target.name;

        this.fieldsValues[name] = val;
    }
    
    handleSave() {
        this.disabledButton=true;
        const formData = 
        {
            firstname: this.fieldsValues.firstName,
            lastname: this.fieldsValues.lastName,
            email: this.fieldsValues.email,
            type: this.fieldsValues.type
        };
        
        saveRequest({jsonData: JSON.stringify(formData)})
        .then(res => {
            console.log('Success!');
            this.saved=true;
            this.disabledButton=false;
            setTimeout (() => this.saved=false, 5000);
        })
        .catch(err => {
            console.error(err.body);
            this.erSaved=true;
            this.disabledButton=false;
            setTimeout (() => this.erSaved=false, 5000);
        });
    }
   
}
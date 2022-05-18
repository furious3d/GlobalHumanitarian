import { LightningElement, api } from 'lwc';
import saveRequest from '@salesforce/apex/HelpRequestController.saveRequest';
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
    typesofassistance=getRequestTypes();
    handleFieldChange(event) {
        const val = event.target.value;
        const name = event.target.name;

        this.fieldsValues[name] = val;
    }

    handleSave() {
        const formData = {
            firstname: this.fieldsValues.firstName,
            lastname: this.fieldsValues.lastName,
            email: this.fieldsValues.email,
            type: this.fieldsValues.type
        };

        saveRequest({jsonData: JSON.stringify(formData)})
        .then(res => {
            console.log('Success!');
        })
        .catch(err => {
            console.error(err.body);
        });
    }
}
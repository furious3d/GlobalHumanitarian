import { LightningElement, api } from 'lwc';
import saveRequest from '@salesforce/apex/HelpRequestController.saveRequest';
import btnSendRequest from '@salesforce/label/c.btnSendRequest';

export default class HelpRequestWizard extends LightningElement {
    @api showCountryProp;
    fieldsValues = {};
    labels = {
        btnSendRequest
    };

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
            console.log(err.getMessage());
        });
    }
}
import { LightningElement, api } from 'lwc';
import saveRequest from '@salesforce/apex/HelpRequestController.saveRequest'

export default class HelpRequestWizard extends LightningElement {
    @api showCountryProp;
    fieldsValues = {};

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

        //console.log(formData);
        //console.log(JSON.stringify(formData));
        
        saveRequest({jsonData: JSON.stringify(formData)})
        .then(res => {
            console.log('Success!');
        })
        .catch(err => {
            console.log(err.getMessage());
        });
    }
}
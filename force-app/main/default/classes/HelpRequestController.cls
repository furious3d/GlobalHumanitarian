public with sharing class HelpRequestController {
    public static List <Contact> findContacts (String firstName, String lastName, String email){
        List <Contact> foundContacts=[SELECT FirstName, LastName, Email  
            FROM Contact
            WHERE (FirstName = :firstName AND LastName = :lastName)
                OR Email = :email];
        return foundContacts;
    }
    
    public static String formatedDate (){
        Date myDate = Date.today();
        List <String> months = new List <String> {'JAN', 'FEB', 'MAR', 'APR', 'MAY', 'JUN', 'JUL', 'AUG', 'SEP', 'OCT', 'NOV', 'DEC'};
        String day = String.valueOf(myDate.day());
        String month = months.get((myDate.month())-1);
        String year = String.valueOf(myDate.year());
        String dateString = day + '-' + month + '-' + year;
        return dateString;
    }

    @AuraEnabled
    public static Case saveRequest(String jsonData) {
        Map<String, Object> data = new Map<String, Object>();
        
        try {
            data = (Map<String, Object>) JSON.deserializeUntyped(jsonData);
        } catch(Exception ex) {
            throw new AuraHandledException('Invalid JSON data');
        }

        try {
            String firstName = (String) data.get('firstname');
            String lastName = (String) data.get('lastname');
            String eMail = (String) data.get ('email');
            String RequesterName = firstName + ' ' + lastName;
            String formDateString = formatedDate();

            List <Contact> exsistingContacts = findContacts(firstName, lastName, eMail);
            Contact caseContact;
            if (exsistingContacts.isEmpty()) {
                caseContact = new Contact();
                caseContact.FirstName = firstName;
                caseContact.LastName = lastName;
                caseContact.Email = eMail;
                insert caseContact;
            }
            else {
                caseContact = exsistingContacts.get(0);
            }

            Case newCase = new Case();
            newCase.ContactId = caseContact.Id;
            newCase.Type = (String) data.get('type');
            newCase.Subject = newCase.Type + ' request from ' + RequesterName + ' by ' + formDateString;
            
            insert newCase;

            return newCase;
        } catch(Exception ex) {
            throw new AuraHandledException('Failed to save date into Database');
        }
    }

    @AuraEnabled
    public static List <Map<String, String>> getRequestTypes() {
        List <Map<String, String>> typesMap = new List <Map<String, String>>();

        Schema.DescribeFieldResult fieldResult = Case.Type.getDescribe();
        List<Schema.PicklistEntry> ple = fieldResult.getPicklistValues();

        for( Schema.PicklistEntry pickListVal : ple){
            Map<String, String> option=new Map<String, String>();
            option.put('Value', pickListVal.getValue());
            option.put('Label', pickListVal.getLabel());
            typesMap.add(option);
        }

        return typesMap;
    }
}


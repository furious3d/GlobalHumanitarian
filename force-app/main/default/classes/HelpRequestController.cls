public with sharing class HelpRequestController {
    @AuraEnabled
    public static List <Contact> findContacts (){
        List <Contact> foundContacts=[SELECT FirstName, LastName, Email  
        FROM Contact
        WHERE FirstName = :data.get('firstname') AND LastName = :data.get('lastname') 
            OR Email = :data.get('email')];
        return foundContacts;
    }
    
    @AuraEnabled
    public static String formatedDate (){
        Date myDate = Date.today();
        List <String> months = new List <String> {
            'JAN', 'FEB', 'MAR', 'APR', 'MAY', 'JUN', 'JUL', 'AUG', 'SEP', 'OCT', 'NOV', 'DEC'
        };
        String day = (String) myDate.day();
        String month = month.get(myDate.month()-1);
        String year = (String) myDate.year();
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
            String RequesterName = firstName + ' ' + lastName;
            String formDateString = formatedDate();
            Case newCase = new Case();
            newCase.ContactId = caseContact.Id;
            newCase.Type = (String) data.get('type');
            newCase.Subject = newCase.Type + ' request from ' + RequesterName + ' by ' + formDateString;
            
            insert newCase;

            List <Contact> exsistingContacts = findContacts();
            if (exsistingContacts.isEmpty()) {
                Contact caseContact = new Contact();
                caseContact.FirstName = firstName;
                caseContact.LastName = lastName;
                caseContact.Email = (String) data.get('email');
                insert caseContact;
            }

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


public with sharing class HelpRequestController {
    @AuraEnabled
    public static Case saveRequest(String jsonData) {
        Map<String, Object> data = new Map<String, Object>();
        
        try {
            data = (Map<String, Object>) JSON.deserializeUntyped(jsonData);
        } catch(Exception ex) {
            throw new AuraHandledException('Invalid JSON data');
        }

        try {
            Contact caseContact = new Contact();
            caseContact.FirstName = (String) data.get('firstname');
            caseContact.LastName = (String) data.get('lastname');
            caseContact.Email = (String) data.get('email');

            insert caseContact;
            
            Case newCase = new Case();
            newCase.ContactId = caseContact.Id;
            newCase.Type = (String) data.get('type');

            insert newCase;

            return newCase;
        } catch(Exception ex) {
            throw new AuraHandledException('Failed to save date into Database');
        }
    }


    @AuraEnabled
    public static Map<String, String> getRequestTypes() {
        Map<String, String> typesMap = new Map<String, String>();

        Schema.DescribeFieldResult fieldResult = Case.Type.getDescribe();
		List<Schema.PicklistEntry> ple = fieldResult.getPicklistValues();

		for( Schema.PicklistEntry pickListVal : ple){
			typesMap.put(pickListVal.getValue(), pickListVal.getLabel());
		}

        return typesMap;
    }
}

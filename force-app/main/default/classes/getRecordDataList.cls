public with sharing class getRecordDataList 
{
    @AuraEnabled (cacheable=true)
    public static List<String> getSObjectRecords(String SFDCobjectApiName, String fieldSetName)
    {
        List<String> fields = new List<String>();     
        if(!String.isEmpty(SFDCobjectApiName) && !String.isEmpty(fieldSetName))
        {
            //get fields from FieldSet
            SObject sObj = (SObject)(Type.forName('Schema.'+ SFDCobjectApiName).newInstance()); //  Create new sObj
                
            List<Schema.FieldSetMember> lstFSMember = 
            sObj.getSObjectType().getDescribe().fieldSets.getMap().get(fieldSetName).getFields(); // Collecting all fields from fildSet
                
            for(Schema.FieldSetMember f : lstFSMember) 
            {
                fields.add(String.valueOf(f.getFieldPath())); 
            }

            return fields;
        }
        return null;
    }  
    
    @AuraEnabled
    public static String setSObjectRecords(String fieldName, String fieldValue, String recordId, String SFDCobjectApiName)
    {
        if(!String.isEmpty(fieldName) && !String.isEmpty(recordId) && !String.isEmpty(SFDCobjectApiName))
        {
            System.debug('fieldName: ' + fieldName);
            System.debug('fieldValue: ' + fieldValue);
            System.debug('recordId: ' + recordId);
            System.debug('SFDCobjectApiName: ' + SFDCobjectApiName);
            SObject sObj = (SObject)(Type.forName('Schema.'+ SFDCobjectApiName).newInstance()); //  Create new sObj
            //sObj.Id = recordId;
            sObj.put('Id',recordId); // sObject.put(fieldName,Value)
            sObj.put(fieldName,fieldValue);
            try 
            {
                UPDATE sObj;
                System.debug(' :Success: ');
                return 'Success'; 
            } catch(Exception e) 
            {
                System.debug(e.getMessage());
                return ''+e.getMessage(); 
            }
        }
        return 'Fields should not be empty';
    }  
}

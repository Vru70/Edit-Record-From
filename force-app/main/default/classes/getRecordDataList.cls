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
            SObject sObj = (SObject)(Type.forName('Schema.'+ SFDCobjectApiName).newInstance());     //  Create new sObj
            
            Schema.SObjectType objectType = Schema.getGlobalDescribe().get(SFDCobjectApiName);      // Object schema 
            Map<String, SObjectField> fieldMap = objectType.getDescribe().fields.getMap();          // map to het field
            Schema.SobjectField theField = fieldMap.get(fieldName);                                 
            Schema.DisplayType fieldType = theField.getDescribe().getType();                        // Collecting field type

            sObj.put('Id',recordId);                                                                // sObject.put(fieldName,Value)

            if(String.valueOf(fieldType) == 'DATE')
            {
                Date dateVAL = Date.valueOf(fieldValue);
                sObj.put(fieldName,dateVAL);
            }else 
            {
                sObj.put(fieldName,fieldValue);
            }
                     
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
        return 'Something Went Wrong';
    }  
}

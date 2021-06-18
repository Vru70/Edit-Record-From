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
    public static String setSObjectRecords(String fieldData, String SFDCobjectApiName)
    {
        Type t = Type.forName(SFDCobjectApiName);                               // Eg., conatct 
        if(!String.isEmpty(fieldData) && !String.isEmpty(SFDCobjectApiName))
        {
            SObject sObj = (SObject)JSON.deserialize(fieldData,t); 
            System.debug('fieldData : '+fieldData);                                    // '{\"id\":\"0032w00000X6KgxAAF\",\"FirstName\":\"SonuTest1\"}'
            try 
            {
                UPDATE sObj;
                System.debug(' ::Success:: ');
                return 'Success'; 
            } catch(Exception e) 
            {
                System.debug('Error in Update : '+e.getMessage());
                return ''+e.getMessage(); 
            }
        }
        return 'Something Went Wrong';
    }  
}

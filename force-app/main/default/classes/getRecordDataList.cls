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
                fields.add(String.valueOf(f)); 
            }

            return fields;
        }
        return null;
    }  
    
}

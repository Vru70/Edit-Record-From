public with sharing class getRecordDataList 
{
    @AuraEnabled (cacheable=true)
    public static String getSObjectRecords(String SFDCobjectApiName, String fieldSetName)
    {
        System.debug('SFDCobjectApiName '+SFDCobjectApiName);
        System.debug('fieldSetName '+fieldSetName);
        String fields='';     
        if(!String.isEmpty(SFDCobjectApiName) && !String.isEmpty(fieldSetName))
        {
            //get fields from FieldSet
            SObject sObj = (SObject)(Type.forName('Schema.'+ SFDCobjectApiName).newInstance()); //  Create new sObj
                
            List<Schema.FieldSetMember> lstFSMember = 
            sObj.getSObjectType().getDescribe().fieldSets.getMap().get(fieldSetName).getFields(); // Collecting all fields from fildSet
                
            for(Schema.FieldSetMember f : lstFSMember) //Use of Schema.FieldSetMember to get the fields from Field Set.
            {
                fields += f.getFieldPath() + ', '; // getFieldPath() of FieldSetMember gives the fieldAPI
            }
            System.debug('fields '+fields);  
            return fields;
        }
        return null;
    }  
    
}

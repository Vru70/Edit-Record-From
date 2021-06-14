public with sharing class getRecordDataList 
{
    @AuraEnabled (cacheable=true)
    public static String getSObjectRecords(String strObjectApiName, String strfieldSetName)
    {
       Map<String, String> returnMap = new Map<String,String>();
        if(!String.isEmpty(strObjectApiName) && !String.isEmpty(strfieldSetName))
        {
            //get fields from FieldSet
            SObject sObj = (SObject)(Type.forName('Schema.'+ strObjectApiName).newInstance()); //  Create new sObj
            List<Schema.FieldSetMember> lstFSMember = 
                sObj.getSObjectType().getDescribe().fieldSets.getMap().get(strfieldSetName).getFields(); // Collecting all fields from fildSet

            return JSON.serialize(lstFSMember);
        }
        return null; // will return null if ObjectApi and FieldSet not found
    }
    
}

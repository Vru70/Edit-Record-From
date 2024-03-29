/**
 * @author            : Vrushabh Uprikar
 * @last modified on  : 07-01-2021
 * @last modified by  : Vrushabh Uprikar
 * Modifications Log 
 * Ver   Date         Author             Modification
 * 1.0   06-25-2021   Vrushabh Uprikar   Initial Version
**/
public class SearchReplaceController 
{
    @AuraEnabled(cacheable=false)
   public static String getFieldsAndRecords(String strObjectApiName, String strfieldSetName) 
   {
        Map<String, String> returnMap = new Map<String,String>();
        if(!String.isEmpty(strObjectApiName) && !String.isEmpty(strfieldSetName))
        {
            //get fields from FieldSet
            SObject sObj = (SObject)(Type.forName('Schema.'+ strObjectApiName).newInstance()); //  Create new sObj
            List<Schema.FieldSetMember> lstFSMember = 
                sObj.getSObjectType().getDescribe().fieldSets.getMap().get(strfieldSetName).getFields(); // Collecting all fields from fildSet

            //prepare SOQL query based on fieldAPIs	
            String query = 'SELECT ';
            for(Schema.FieldSetMember f : lstFSMember) //Use of Schema.FieldSetMember to get the fields from Field Set.
            {
                query += f.getFieldPath() + ', '; // getFieldPath() of FieldSetMember gives the fieldAPI which has been used to build SOQL query.
            }
            query += 'Id FROM ' + strObjectApiName ;
            query += ' LIMIT 50 '; 
        
	        //execute query
            List<SObject> lstRecords = Database.query(query);
            
            //prepare a map which will hold fieldList and recordList and return it
            returnMap.put('FIELD_LIST', JSON.serialize(lstFSMember));
            returnMap.put('RECORD_LIST', JSON.serialize(lstRecords));
            return JSON.serialize(returnMap);
        }
        return null; // will return null if ObjectApi and FieldSet not found
   }

   @AuraEnabled
    public static String updateRecords(String strObjectApiName, String Record_Id, String Replace_text, String Replace_field, String field_type){
        if(!String.isEmpty(Record_Id) && !String.isEmpty(Replace_text))
        {
            //get fields from FieldSet
            SObject sObj = (SObject)(Type.forName('Schema.'+ strObjectApiName).newInstance()); //  Create new sObj
			sObj.Id = Record_Id;
            if(field_type == 'double')
            {
                Decimal myDecimal = decimal.valueOf(Replace_text);
                sObj.put(Replace_field,myDecimal);
            }else {
                sObj.put(Replace_field,Replace_text);
            }
			                               
            try 
            {
                update sObj;
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

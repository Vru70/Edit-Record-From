/**
 * @author            : Vrushabh Uprikar
 * @last modified on  : 06-29-2021
 * @last modified by  : Vrushabh Uprikar
 * Modifications Log 
 * Ver   Date         Author             Modification
 * 1.0   06-25-2021   Vrushabh Uprikar   Initial Version
**/
public class SearchReplaceController 
{
    @AuraEnabled(cacheable=true)
   public static List<Account> getAccs() 
   {
       String query = 'SELECT Id,Name,Phone,AccountNumber FROM Account LIMIT 20';
       return Database.query(query);
   }

   @AuraEnabled
    public static String updateRecords(String Record_Id, String Replace_text, String Replace_field){
        if(!String.isEmpty(Record_Id) && !String.isEmpty(Replace_text))
        {
            Account Acc = new Account();
			Acc.Id = Record_Id;
			Acc.put(Replace_field,Replace_text);                                
            try 
            {
                update Acc;
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

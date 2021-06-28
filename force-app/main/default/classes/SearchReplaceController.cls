/**
 * @author            : Vrushabh Uprikar
 * @last modified on  : 06-28-2021
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
       system.debug('query---'+query);
       //if ( searchKey != null && searchKey != '' ) {
         //  String key = '%' + searchKey + '%';
           //query += ' WHERE Name LIKE :key';
       return Database.query(query);
   }

   @AuraEnabled
    public static String updateRecords(String Record_Id, String Replace_text){
        if(!String.isEmpty(Record_Id) && !String.isEmpty(Replace_text))
        {
            Account Acc = new Account();
			Acc.Id = Record_Id;
			Acc.Name = Replace_text;                                 
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

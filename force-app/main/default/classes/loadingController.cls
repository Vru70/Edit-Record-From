public with sharing class loadingController 
{
    @AuraEnabled(cacheable=true)
    public static List<Contact> getLoadingdata(Integer limitSize, Integer offset)
    {
        List<Contact> accountList = [SELECT Id,Name,Email,City
                                     FROM Contact
                                     ORDER BY Name
                                     LIMIT :limitSize
                                     OFFSET :offset
                                     ];
        return accountList;
    }
}

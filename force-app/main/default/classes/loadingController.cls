public with sharing class loadingController 
{
    @AuraEnabled(cacheable=true)
    public static List<Contact> getLoadingdata(Integer limitSize, Integer offset)
    {
        List<Contact> ContactList = [SELECT Id,Name,Email,MailingCity
                                     FROM Contact
                                     ORDER BY Name
                                     LIMIT :limitSize
                                     OFFSET :offset
                                     ];
        return ContactList;
    }
}

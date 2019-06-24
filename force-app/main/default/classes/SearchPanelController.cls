public with sharing class SearchPanelController {
    public class PicklistOption {
        @AuraEnabled
        public String label { get; set; }
        
        @AuraEnabled
        public String value { get; set; }
        
        public PicklistOption( String label, String value ) {
            this.label = label;
            this.value = value;
        }
    }

    @AuraEnabled
    public static String getProductFamilies(){
        List<PicklistOption> options = new List<PicklistOption>();
        for ( PicklistEntry entry : Product2.Family.getDescribe().getPicklistValues()) {
            options.add( new PicklistOption( entry.getLabel(), entry.getValue() ) );
        }
        return JSON.serialize(options);
    }

    @AuraEnabled
    public static User[] getUsers(String name, String title){
        User[] users = new List<User>();
        String whereClause = ' WHERE IsActive = true';
        String[] criteria = new List<String>();

        if(String.isEmpty(name) == false){
            criteria.add('Name LIKE \'%' + name + '%\'');
        }
        if(String.isEmpty(title) == false){
            criteria.add('Title LIKE \'%' + title + '%\'');
        }
        if (criteria.size() > 0) {
            whereClause += ' AND ' + String.join( criteria, ' AND ' );

            users = Database.query('SELECT Alias, Name, FullPhotoUrl FROM User' + whereClause);
        }
        return users;
    }

    @AuraEnabled
    public static Product2[] getProducts(String name, String code, String family){
        Product2[] products = new List<Product2>();
        String whereClause = ' WHERE IsActive = true';
        String[] criteria = new List<String>();

        if(String.isEmpty(name) == false){
            criteria.add('Name LIKE \'%' + name + '%\'');
        }
        if(String.isEmpty(code) == false){
            criteria.add('ProductCode LIKE \'%' + code + '%\'');
        }
        if(String.isEmpty(family) == false){
            criteria.add('Family = :family');
        }
        if (criteria.size() > 0) {
            whereClause += ' AND ' + String.join( criteria, ' AND ' );

            products = Database.query('SELECT Picture__c, ProductCode FROM Product2' + whereClause);
        }

        return products;
    }
}

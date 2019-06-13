public with sharing class ProductController {
    @AuraEnabled(cacheable=true)
    public static Product2[] getByNameCodeFamily(String name, String code, String family){
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

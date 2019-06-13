public with sharing class OpportunityController {
    private static Map<String, String> operationMapping = new Map<String, String>{
        'greaterOrEquals' => '>=',
        'lessOrEquals' => '<='
    };

    public class OpportunityWrapper{
        @AuraEnabled
        public String opportunityName {get; set;}
        @AuraEnabled
        public String accountName {get; set;}
        @AuraEnabled
        public Date closeDate {get; set;}
        @AuraEnabled
        public String confidence {get; set;}
        @AuraEnabled
        public Decimal amount {get; set;}
    }

    public class OpportunityFilterWrapper{
        @AuraEnabled
        public string fieldApiName {get; set;}

        @AuraEnabled
        public string operation {get; set;}

        @AuraEnabled
        public String value {get; set;}
    }

    public class OpportunityRelatedFilterWrapper{
        @AuraEnabled
        public string recordId {get; set;}

        @AuraEnabled
        public string sObjectName {get; set;}
    }

    @AuraEnabled
    public static String filter(List<OpportunityFilterWrapper> opportunityFilters, List<OpportunityRelatedFilterWrapper> opportunityRelatedFilters) {
        List<OpportunityWrapper> wrappers = new List<OpportunityWrapper>();
        String query = 'SELECT Name, Account.Name, Probability, CloseDate, Amount FROM Opportunity';

        if(opportunityFilters.size() > 0 || opportunityRelatedFilters.size() > 0){
            query += ' WHERE ';
        }

        for(OpportunityFilterWrapper filter : opportunityFilters){
            query += filter.fieldApiName + ' ' + operationMapping.get(filter.operation) + ' ' + filter.value + ' AND ';
        }
        if(opportunityFilters.size() > 0 && opportunityRelatedFilters.size() == 0){
            query = query.removeEnd(' AND ');
        }

        Map<String, List<String>> filtersRelatedBySObjectName = new Map<String, List<String>>();
        for(OpportunityRelatedFilterWrapper filter : opportunityRelatedFilters){
            if(filtersRelatedBySObjectName.containsKey(filter.sObjectName) == false){
                filtersRelatedBySObjectName.put(filter.sObjectName, new List<String>());
            } 
            filtersRelatedBySObjectName.get(filter.sObjectName).add(filter.recordId);
        }
        if(filtersRelatedBySObjectName.containsKey('User')){
            List<String> ownersIds = filtersRelatedBySObjectName.get('User');
            query += 'OwnerId IN :ownersIds';
        }else{
            query = query.removeEnd(' AND ');
            query = query.removeEnd(' WHERE ');
        }

        Map<Id, Opportunity> opportunitiesById = new Map<Id, Opportunity>((List<Opportunity>)Database.query(query));

        if(filtersRelatedBySObjectName.containsKey('Product2')){
            Set<Id> opportunitiesIds = new Set<Id>();
            for(OpportunityLineItem item : [SELECT OpportunityId 
                                            FROM OpportunityLineItem 
                                            WHERE OpportunityId IN :opportunitiesById.keySet() 
                                            AND Product2Id IN :filtersRelatedBySObjectName.get('Product2')]){
                opportunitiesIds.add(item.OpportunityId);
            }
            for(Id opportunityId : opportunitiesById.keySet()){
                if(opportunitiesIds.contains(opportunityId) == false){
                    opportunitiesById.remove(opportunityId);
                }
            }
        }

        for(Opportunity opp : opportunitiesById.values()){
            OpportunityWrapper wrapper = new OpportunityWrapper();
            wrapper.opportunityName = opp.Name;
            wrapper.accountName = opp.Account.Name;
            wrapper.closeDate = opp.CloseDate;
            wrapper.confidence = opp.Probability != null ? String.valueOf(opp.Probability / 100) : null;
            wrapper.amount = opp.Amount;
            wrappers.add(wrapper);
        }
        return JSON.serialize(wrappers);
    }
}

({
  doInit: function(component, event, helper) {
    component.set("v.columns", [
      { label: "Opportunity name", fieldName: "opportunityName", type: "text" },
      { label: "Account name", fieldName: "accountName", type: "text" },
      { label: "Close date", fieldName: "closeDate", type: "date-local" },
      { label: "Type", fieldName: "type", type: "text" },
      { label: "Stage", fieldName: "stage", type: "text" },
      { label: "Confidence", fieldName: "confidence", type: "percentage" },
      {
        label: "Amount",
        fieldName: "amount",
        type: "currency",
        typeAttributes: { currencyCode: "EUR", maximumSignificantDigits: 5 }
      }
    ]);
  },

  handleFilter: function(component, event, helper) {
    var opportunityFilter = event.getParam("opportunityFilter");
    var opportunityFilters = component.get("v.opportunityFilters");

    var indexFilter = opportunityFilters.findIndex(filter => filter.fieldApiName == opportunityFilter.fieldApiName && filter.operation == opportunityFilter.operation);
    if(indexFilter !== -1){
      if(opportunityFilter.value == ''){
        opportunityFilters.splice(indexFilter, 1);
      }else{
        opportunityFilters[indexFilter] = opportunityFilter;
      }
    }else{
      opportunityFilters.push(opportunityFilter);
    }
    component.set("v.opportunityFilters", opportunityFilters);

    helper.filterOpportunities(component);
  },

  handleFilterRelated: function(component, event, helper) {
    var opportunityFilter = event.getParam("opportunityFilter");
    var opportunityRelatedFilters = component.get("v.opportunityRelatedFilters");

    var indexFilter = opportunityRelatedFilters.findIndex(filter => filter.recordId == opportunityFilter.recordId);
    if(indexFilter !== -1){
      if(opportunityFilter.selected){
        opportunityRelatedFilters[indexFilter] = opportunityFilter;
      }else{
        opportunityRelatedFilters.splice(indexFilter, 1);
      }
    }else{
      opportunityRelatedFilters.push(opportunityFilter);
    }
    component.set("v.opportunityRelatedFilters", opportunityRelatedFilters);

    helper.filterOpportunities(component);
  }
});

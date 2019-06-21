import { LightningElement, track, wire } from "lwc";
import { CurrentPageReference } from "lightning/navigation";
import { registerListener, unregisterAllListeners } from "c/pubsub";
import filterOpportunities from "@salesforce/apex/OpportunityController.filter";

export default class SearchResultsNew extends LightningElement {
  @wire(CurrentPageReference) pageRef;
  opportunityFilters = [];
  opportunityRelatedFilters = [];
  @track opportunities;
  @track errorOpps;
  @track columns;

  connectedCallback() {
    registerListener(
      "filterRelatedOpportunities",
      this.handleFilterRelatedOpportunities,
      this
    );
    registerListener(
      "filterOpportunities",
      this.handleFilterOpportunities,
      this
    );

    this.columns = [
      { label: "Opportunity name", fieldName: "opportunityName", type: "text" },
      { label: "Account name", fieldName: "accountName", type: "text" },
      { label: "Close date", fieldName: "closeDate", type: "date-local" },
      { label: "Confidence", fieldName: "confidence", type: "percentage" },
      {
        label: "Amount",
        fieldName: "amount",
        type: "currency",
        typeAttributes: { currencyCode: "EUR", maximumSignificantDigits: 5 }
      }
    ];
  }

  disconnectedCallback() {
    unregisterAllListeners(this);
  }

  handleFilterRelatedOpportunities(opportunityRelatedFilter) {
    var indexFilter = this.opportunityRelatedFilters.findIndex(filter => filter.recordId == opportunityRelatedFilter.recordId);
    if(indexFilter !== -1){
      if(opportunityRelatedFilter.selected){
        this.opportunityRelatedFilters[indexFilter] = opportunityRelatedFilter;
      }else{
        this.opportunityRelatedFilters.splice(indexFilter, 1);
      }
    }else{
        this.opportunityRelatedFilters.push(opportunityRelatedFilter);
    }

    this.filterOpportunities();
  }

  handleFilterOpportunities(opportunityFilter) {
    var indexFilter = this.opportunityFilters.findIndex(
      filter =>
        filter.fieldApiName == opportunityFilter.fieldApiName &&
        filter.operation == opportunityFilter.operation
    );
    if(indexFilter !== -1){
      if(opportunityFilter.value == ''){
        this.opportunityFilters.splice(indexFilter, 1);
      }else{
        this.opportunityFilters[indexFilter] = opportunityFilter;
      }
    } else {
      this.opportunityFilters.push(opportunityFilter);
    }

    this.filterOpportunities();
  }

  filterOpportunities() {
    filterOpportunities({
      opportunityFilters: this.opportunityFilters,
      opportunityRelatedFilters: this.opportunityRelatedFilters
    })
      .then(result => {
        this.opportunities = JSON.parse(result);
        this.errorOpps = undefined;
      })
      .catch(error => {
        this.errorOpps = error;
        this.opportunities = undefined;
      });
  }
}

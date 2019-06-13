({
  filterOpportunities: function(component) {
    var action = component.get("c.getOpportunities");
    action.setParams({
      opportunityFilters: JSON.stringify(component.get("v.opportunityFilters")),
      opportunityRelatedFilters: JSON.stringify(component.get("v.opportunityRelatedFilters"))
    });
    action.setCallback(this, function(response) {
      var state = response.getState();
      if (state === "SUCCESS") {
        var result = response.getReturnValue();
        component.set("v.data", JSON.parse(result));
      } else if (state === "INCOMPLETE") {
      } else if (state === "ERROR") {
        var errors = response.getError();
        if (errors) {
          if (errors[0] && errors[0].message) {
            console.log("Error message: " + errors[0].message);
          }
        } else {
          console.log("Unknown error");
        }
      }
    });
    $A.enqueueAction(action);
  }
});

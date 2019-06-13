({
  handleChange: function(component, event, helper) {
    var changedEvent = component.getEvent("customInputChanged");
    changedEvent.setParams({
      opportunityFilter: {
        value: component.find("custom-input").get("v.value"),
        fieldApiName: component.get("v.fieldApiName"),
        operation: component.get("v.operation")
      }
    });
    changedEvent.fire();
  }
});

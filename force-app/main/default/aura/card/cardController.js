({
  handleClick: function(component, event, helper) {
    component.set("v.selected", !component.get("v.selected"));

    var selectedEvent = component.getEvent("selectedEvent");
    selectedEvent.setParams({
      recordId: component.get("v.recordId"),
      selected: component.get("v.selected")
    });
    selectedEvent.fire();
  }
});

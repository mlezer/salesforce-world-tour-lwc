({
  raiseFilterOpportunitiesEvent: function(component, attributeChanged, value) {
    var filterOpportunitiesEvent = $A.get("e.c:filterOpportunitiesEvent");
    filterOpportunitiesEvent.setParams({
      attributeChanged: attributeChanged,
      value: value
    });
    filterOpportunitiesEvent.fire();
  }
});

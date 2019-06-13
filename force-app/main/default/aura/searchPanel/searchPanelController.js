({
  doInit: function(component, event, helper) {
    var action = component.get("c.getProductFamilies");
    action.setCallback(this, function(response) {
      var state = response.getState();
      if (state === "SUCCESS") {
        var resultJson = response.getReturnValue();
        component.set("v.productFamilies", JSON.parse(resultJson));
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
  },

  filterProducts: function(component, event, helper) {
    var action = component.get("c.getProducts");
    action.setParams({
      name: component.get("v.productName"),
      code: component.get("v.productCode"),
      family: component.get("v.selectedProductFamily")
    });
    action.setCallback(this, function(response) {
      var state = response.getState();
      if (state === "SUCCESS") {
        var result = response.getReturnValue();
        component.set("v.products", result);
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
  },

  filterUsers: function(component, event, helper) {
    var action = component.get("c.getUsers");
    action.setParams({
      name: component.get("v.ownerName"),
      title: component.get("v.ownerTitle")
    });
    action.setCallback(this, function(response) {
      var state = response.getState();
      if (state === "SUCCESS") {
        var result = response.getReturnValue();
        component.set("v.users", result);
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
  },

  handleSelectedProduct: function(component, event, helper) {
    var filterOpportunitiesEvent = $A.get(
      "e.c:filterOpportunitiesRelatedEvent"
    );
    filterOpportunitiesEvent.setParams({
      opportunityFilter: {
        recordId: event.getParam("recordId"),
        sObjectName: "Product2",
        selected: event.getParam("selected")
      }
    });
    filterOpportunitiesEvent.fire();
  },

  handleSelectedOwner: function(component, event, helper) {
    var filterOpportunitiesEvent = $A.get(
      "e.c:filterOpportunitiesRelatedEvent"
    );
    filterOpportunitiesEvent.setParams({
      opportunityFilter: {
        recordId: event.getParam("recordId"),
        sObjectName: "User",
        selected: event.getParam("selected")
      }
    });
    filterOpportunitiesEvent.fire();
  },

  filterOpportunities: function(component, event, helper) {
    var filterOpportunitiesEvent = $A.get("e.c:filterOpportunitiesEvent");
    filterOpportunitiesEvent.setParams({
      opportunityFilter: event.getParam("opportunityFilter")
    });
    filterOpportunitiesEvent.fire();
  }
});

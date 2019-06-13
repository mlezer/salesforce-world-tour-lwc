import { LightningElement, wire, track } from "lwc";
import { getPicklistValues } from "lightning/uiObjectInfoApi";
import { getObjectInfo } from "lightning/uiObjectInfoApi";
import { CurrentPageReference } from "lightning/navigation";
import { fireEvent } from "c/pubsub";
import PRODUCT_OBJECT from "@salesforce/schema/Product2";
import FAMILY_FIELD from "@salesforce/schema/Product2.Family";
import getProductsByNameCodeFamily from "@salesforce/apex/ProductController.getByNameCodeFamily";
import getUsersByNameAndTitle from "@salesforce/apex/UserController.getByNameAndTitle";

export default class SearchPanelNew extends LightningElement {
  productName;
  productFamily;
  productCode;
  ownerName;
  ownerTitle;
  @track errorUsers;
  @track errorProducts;
  @track products;
  @track users;

  @wire(CurrentPageReference) pageRef;

  @wire(getObjectInfo, { objectApiName: PRODUCT_OBJECT })
  productObjectInfo;

  @wire(getPicklistValues, {
    recordTypeId: "$productObjectInfo.data.defaultRecordTypeId",
    fieldApiName: FAMILY_FIELD
  })
  productFamilies;

  handleChangeProductFamily(event) {
    this.productFamily = event.target.value;
    this.filterProducts();
  }
  handleChangeProductName(event) {
    this.productName = event.target.value;
    this.filterProducts();
  }
  handleChangeProductCode(event) {
    this.productCode = event.target.value;
    this.filterProducts();
  }
  handleChangeOwnerName(event) {
    this.ownerName = event.target.value;
    this.filterUsers();
  }
  handleChangeOwnerTitle(event) {
    this.ownerTitle = event.target.value;
    this.filterUsers();
  }

  filterProducts() {
    getProductsByNameCodeFamily({
      name: this.productName,
      code: this.productCode,
      family: this.productFamily
    })
      .then(result => {
        this.products = result;
        this.errorProducts = undefined;
      })
      .catch(error => {
        this.errorProducts = error;
        this.products = undefined;
      });
  }

  filterUsers() {
    getUsersByNameAndTitle({
      name: this.ownerName,
      title: this.ownerTitle
    })
      .then(result => {
        this.users = result;
        this.errorUsers = undefined;
      })
      .catch(error => {
        this.errorUsers = error;
        this.users = undefined;
      });
  }

  handleSelectedProduct(event) {
    const details = event.detail;
    fireEvent(this.pageRef, "filterRelatedOpportunities", {
      recordId: details.recordId,
      sObjectName: "Product2",
      selected: details.selected
    });
  }

  handleSelectedOwner(event) {
    const details = event.detail;
    fireEvent(this.pageRef, "filterRelatedOpportunities", {
      recordId: details.recordId,
      sObjectName: "User",
      selected: details.selected
    });
  }

  filterOpportunities(event){
    fireEvent(this.pageRef, "filterOpportunities", event.detail);
  }
}

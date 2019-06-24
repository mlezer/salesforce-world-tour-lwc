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
  @track productName = '';
  @track productFamily = '';
  @track productCode = '';
  @track ownerName = '';
  @track ownerTitle = '';

  @wire(CurrentPageReference) pageRef;

  @wire(getObjectInfo, { objectApiName: PRODUCT_OBJECT })
  productObjectInfo;

  @wire(getPicklistValues, {
    recordTypeId: "$productObjectInfo.data.defaultRecordTypeId",
    fieldApiName: FAMILY_FIELD
  })
  productFamilies;

  @wire(getProductsByNameCodeFamily, {name: '$productName', code: '$productCode', family: '$productFamily'})
  products;

  @wire(getUsersByNameAndTitle, {name: '$ownerName', title: '$ownerTitle'})
  users;

  handleChangeProductFamily(event) {
    this.productFamily = event.target.value;
  }
  handleChangeProductName(event) {
    this.productName = event.target.value;
  }
  handleChangeProductCode(event) {
    this.productCode = event.target.value;
  }
  handleChangeOwnerName(event) {
    this.ownerName = event.target.value;
  }
  handleChangeOwnerTitle(event) {
    this.ownerTitle = event.target.value;
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

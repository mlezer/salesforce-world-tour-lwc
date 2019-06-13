import { LightningElement, api } from "lwc";

export default class CustomInputNew extends LightningElement {
  @api fieldApiName;
  @api operation;
  @api type = "text";
  @api label;

  handleChange(event) {
    this.dispatchEvent(
      new CustomEvent("customchange", {
        detail: {
          value: event.target.value,
          fieldApiName: this.fieldApiName,
          operation: this.operation
        }
      })
    );
  }
}

import { LightningElement, api, track } from 'lwc';

export default class CardNew extends LightningElement {
    @track selected = false;
    @api imgSrc;
    @api title;
    @api recordId;
  
    get className() {
      return "card" + (this.selected ? " selected" : "");
    }
  
    handleClick() {
      this.selected = !this.selected;
  
      this.dispatchEvent(
        new CustomEvent("cardselected", { detail: {recordId: this.recordId, selected: this.selected}})
      );
    }
}
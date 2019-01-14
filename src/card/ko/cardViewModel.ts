import * as ko from "knockout";
import template from "./card.html";
import { Component } from "@paperbits/common/ko/decorators";

@Component({
    selector: "card",
    template: template,
    injectable: "card"
})
export class CardViewModel {
    public widgets: KnockoutObservableArray<Object>;
    public styles: KnockoutObservable<Object>;

    constructor() {
        this.widgets = ko.observableArray<Object>();
        this.styles = ko.observable<Object>();
    }
}

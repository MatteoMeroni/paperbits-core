import * as ko from "knockout";
import template from "./placeholder.html";
import { Component } from "@paperbits/knockout/decorators";

@Component({
    selector: "paperbits-placeholder",
    template: template,
    injectable: "placeholderWidget",
})
export class PlaceholderViewModel {
    public title: KnockoutObservable<string>;

    constructor(title: string) {
        this.title = ko.observable<string>(title);
    }
}


import * as ko from "knockout";
import * as Utils from "@paperbits/common";
import * as Objects from "@paperbits/common/objects";
import template from "./carouselEditor.html";
import { ViewManager } from "@paperbits/common/ui";
import { Component, Param, Event, OnMounted } from "@paperbits/common/ko/decorators";
import { CarouselModel } from "../carouselModel";
import { GridModel } from "../../grid-layout-section";
import {
    BackgroundStylePluginConfig,
    TypographyStylePluginConfig,
    MarginStylePluginConfig,
    SizeStylePluginConfig,
    BoxStylePluginConfig
} from "@paperbits/styles/contracts";
import { ChangeRateLimit } from "@paperbits/common/ko/consts";
import { EventManager } from "@paperbits/common/events/eventManager";
import { CommonEvents } from "@paperbits/common/events";

@Component({
    selector: "carousel-editor",
    template: template
})
export class CarouselEditor {
    public readonly stickTo: ko.Observable<string>;
    public readonly background: ko.Observable<BackgroundStylePluginConfig>;
    public readonly typography: ko.Observable<TypographyStylePluginConfig>;
    public readonly box: ko.Observable<BoxStylePluginConfig>;
    public readonly sizeConfig: ko.Observable<SizeStylePluginConfig>;
    public readonly stretch: ko.Observable<boolean>;


    private gridModel: GridModel;

    constructor(
        private readonly viewManager: ViewManager,
        private readonly eventManager: EventManager
    ) {
        this.stickTo = ko.observable<string>("none");
        this.stretch = ko.observable<boolean>(false);
        this.background = ko.observable<BackgroundStylePluginConfig>();
        this.typography = ko.observable<TypographyStylePluginConfig>();
        this.sizeConfig = ko.observable<SizeStylePluginConfig>();
        this.box = ko.observable<BoxStylePluginConfig>();
    }

    @Param()
    public model: CarouselModel;

    @Event()
    public onChange: (model: CarouselModel) => void;

    @OnMounted()
    public async initialize(): Promise<void> {
        this.updateObservables();
        this.stickTo.extend(ChangeRateLimit).subscribe(this.applyChanges);
        this.stretch.extend(ChangeRateLimit).subscribe(this.applyChanges);
        this.background.extend(ChangeRateLimit).subscribe(this.applyChanges);
        this.typography.extend(ChangeRateLimit).subscribe(this.applyChanges);
        this.box.extend(ChangeRateLimit).subscribe(this.applyChanges);
        this.sizeConfig.extend(ChangeRateLimit).subscribe(this.applyChanges);
        this.eventManager.addEventListener(CommonEvents.onViewportChange, this.updateObservables);
    }

    private updateObservables(): void {
        const viewport = this.viewManager.getViewport();

        if (this.model.styles) {
            if (this.model.styles.instance) {
                const carouselStyles = this.model.styles.instance;

                if (carouselStyles) {
                    this.background(carouselStyles.background);
                    this.typography(carouselStyles.typography);
                }
            }
        }

        // this.gridModel = <GridModel>this.model.widgets[0];
        // const gridStyles = this.gridModel.styles;
        const containerSizeStyles = Objects.getObjectAt<SizeStylePluginConfig>(`instance/size/${viewport}`, this.model.styles);
        const marginStyles = Objects.getObjectAt<MarginStylePluginConfig>(`instance/margin/${viewport}`, this.model.styles);

        this.box({ margin: marginStyles });
        this.sizeConfig(containerSizeStyles);
    }

    /**
     * Collecting changes from the editor UI and invoking callback method.
     */
    private applyChanges(): void {
        const viewport = this.viewManager.getViewport();
        this.model.styles = this.model.styles || {};

        if (this.model.styles.instance && !this.model.styles.instance.key) {
            this.model.styles.instance.key = Utils.randomClassName();
        }

        // const gridStyles = this.gridModel.styles;

        const containerSizeStyles: SizeStylePluginConfig = this.sizeConfig();
        Objects.setValue(`instance/size/${viewport}`, this.model.styles, containerSizeStyles);

        const marginStyle = this.box().margin;

        Objects.cleanupObject(marginStyle);
        Objects.setValue(`instance/margin/${viewport}`, this.model.styles, marginStyle);
        Objects.setValue(`instance/stickTo/${viewport}`, this.model.styles, this.stickTo());
        Objects.setValue(`instance/size/${viewport}/stretch`, this.model.styles, this.stretch());

        this.onChange(this.model);

        console.log(this.model.styles.instance);
    }

    public onBackgroundUpdate(background: BackgroundStylePluginConfig): void {
        Objects.setValue("instance/background", this.model.styles, background);
        this.applyChanges();
    }

    public onTypographyUpdate(typography: TypographyStylePluginConfig): void {
        Objects.setValue("instance/typography", this.model.styles, typography);
        this.applyChanges();
    }

    public onBoxUpdate(pluginConfig: BoxStylePluginConfig): void {
        this.box(pluginConfig);
    }

    public onSizeUpdate(sizeConfig: SizeStylePluginConfig): void {
        this.sizeConfig(sizeConfig);
    }
}
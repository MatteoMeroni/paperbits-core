import * as Utils from "@paperbits/common/utils";
import { ColumnViewModel } from "./columnViewModel";
import { IViewModelBinder } from "@paperbits/common/widgets";
import { IWidgetBinding } from "@paperbits/common/editing";
import { ColumnModel } from "../columnModel";
import { ViewModelBinderSelector } from "../../ko/viewModelBinderSelector";
import { PlaceholderViewModel } from "../../placeholder/ko/placeholderViewModel";
import { ColumnHandlers } from "../columnHandlers";
import { IEventManager } from "@paperbits/common/events";

export class ColumnViewModelBinder implements IViewModelBinder<ColumnModel, ColumnViewModel> {
    constructor(
        private readonly viewModelBinderSelector: ViewModelBinderSelector,
        private readonly eventManager: IEventManager
    ) { }

    private toTitleCase(str: string): string {
        return str.charAt(0).toUpperCase() + str.slice(1);
    }

    private getAlignmentClass(styles: Object, alignmentString: string, targetBreakpoint: string): void {
        if (!alignmentString) {
            return;
        }

        const alignment = alignmentString.split(" ");
        const vertical = alignment[0];
        const horizontal = alignment[1];

        const x = styles["alignX"] || {};
        const y = styles["alignY"] || {};

        x[targetBreakpoint] = `utils/content/alignHorizontally${this.toTitleCase(horizontal)}`;
        y[targetBreakpoint] = `utils/content/alignVertically${this.toTitleCase(vertical)}`;

        styles["alignX"] = x;
        styles["alignY"] = y;
    }

    public modelToViewModel(model: ColumnModel, columnViewModel?: ColumnViewModel): ColumnViewModel {
        if (!columnViewModel) {
            columnViewModel = new ColumnViewModel();
        }

        const widgetViewModels = model.widgets
            .map(widgetModel => {
                const widgetViewModelBinder = this.viewModelBinderSelector.getViewModelBinderByModel(widgetModel);
                const widgetViewModel = widgetViewModelBinder.modelToViewModel(widgetModel);

                return widgetViewModel;
            });

        if (widgetViewModels.length === 0) {
            widgetViewModels.push(new PlaceholderViewModel("Column"));
        }

        const styles = {};


        columnViewModel.widgets(widgetViewModels);

        if (model.size) {
            model.size = Utils.optimizeBreakpoints(model.size);
            columnViewModel.sizeXs(model.size.xs);
            columnViewModel.sizeSm(model.size.sm);
            columnViewModel.sizeMd(model.size.md);
            columnViewModel.sizeLg(model.size.lg);
            columnViewModel.sizeXl(model.size.xl);
        }

        if (model.alignment) {
            model.alignment = Utils.optimizeBreakpoints(model.alignment);

            columnViewModel.alignmentXs(model.alignment.xs);
            columnViewModel.alignmentSm(model.alignment.sm);
            columnViewModel.alignmentMd(model.alignment.md);
            columnViewModel.alignmentLg(model.alignment.lg);
            columnViewModel.alignmentXl(model.alignment.xl);

            // this.getAlignmentClass(styles, model.alignment.xs, "xs");
            // this.getAlignmentClass(styles, model.alignment.sm, "sm");
            // this.getAlignmentClass(styles, model.alignment.md, "md");
            // this.getAlignmentClass(styles, model.alignment.lg, "lg");
            // this.getAlignmentClass(styles, model.alignment.xl, "xl");
        }

        if (model.alignment) {
            model.alignment = Utils.optimizeBreakpoints(model.alignment);

            columnViewModel.alignmentXs(model.alignment.xs);
            columnViewModel.alignmentSm(model.alignment.sm);
            columnViewModel.alignmentMd(model.alignment.md);
            columnViewModel.alignmentLg(model.alignment.lg);
            columnViewModel.alignmentXl(model.alignment.xl);
        }

        if (model.offset) {
            model.offset = Utils.optimizeBreakpoints(model.offset);

            columnViewModel.offsetXs(model.offset.xs);
            columnViewModel.offsetSm(model.offset.sm);
            columnViewModel.offsetMd(model.offset.md);
            columnViewModel.offsetLg(model.offset.lg);
            columnViewModel.offsetXl(model.offset.xl);
        }

        if (model.order) {
            model.order = Utils.optimizeBreakpoints(model.order);
            columnViewModel.orderXs(model.order.xs);
            columnViewModel.orderSm(model.order.sm);
            columnViewModel.orderMd(model.order.md);
            columnViewModel.orderLg(model.order.lg);
            columnViewModel.orderXl(model.order.xl);
        }

        columnViewModel.overflowX(model.overflowX);
        columnViewModel.overflowY(model.overflowY);


        // columnViewModel.styles(styles); TODO: Enable when all CSS switched to styling system


        const binding: IWidgetBinding = {
            name: "column",
            displayName: "Column",

            flow: "inline",
            model: model,
            editor: "layout-column-editor",
            handler: ColumnHandlers,

            /**
             * editor: LayoutColumnEditor,
             * contextMenu: ColumnContextMenu,
             * type: "inline"
             */

            applyChanges: () => {
                this.modelToViewModel(model, columnViewModel);
                this.eventManager.dispatchEvent("onContentUpdate");
            }
        };

        columnViewModel["widgetBinding"] = binding;

        return columnViewModel;
    }

    public canHandleModel(model: ColumnModel): boolean {
        return model instanceof ColumnModel;
    }
}
import { IInjectorModule, IInjector } from "@paperbits/common/injection";
import { CarouselRuntimeModule } from "./carousel/carousel.runtime.module";
import { TabsRuntimeModule } from "./tabs/tabs.runtime.module";
import { MapRuntimeModule } from "./map";
import { SearchRuntimeModule } from "./search/search.runtime.module";


export class CoreRuntimeModule implements IInjectorModule {
    public register(injector: IInjector): void {
        injector.bindModule(new CarouselRuntimeModule());
        injector.bindModule(new TabsRuntimeModule());
        injector.bindModule(new MapRuntimeModule());
        injector.bindModule(new SearchRuntimeModule());
    }
}

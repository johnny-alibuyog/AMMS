import { FrameworkConfiguration, PLATFORM } from "aurelia-framework";

export function configure(config: FrameworkConfiguration) {
  config.globalResources([
    PLATFORM.moduleName("./elements/breadcrumbs"),
    PLATFORM.moduleName("./elements/dropdown"),
    PLATFORM.moduleName("./elements/pagination"),
    PLATFORM.moduleName("./elements/tool-bar/tool-bar"),
    PLATFORM.moduleName("./elements/tool-bar/add-tool"),
    PLATFORM.moduleName("./elements/tool-bar/list-tool"),
    PLATFORM.moduleName("./elements/tool-bar/tile-tool"),
    PLATFORM.moduleName("./elements/tool-bar/dropdown-menu-tool"),
    PLATFORM.moduleName("./value-converters/currency-value-converter"),
    PLATFORM.moduleName("./value-converters/instruction-filter-value-converter"),
  ]);
}

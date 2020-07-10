import { FrameworkConfiguration, PLATFORM } from "aurelia-framework";

export function configure(config: FrameworkConfiguration) {
  config.globalResources([
    PLATFORM.moduleName("./elements/breadcrumbs/breadcrumbs"),
    PLATFORM.moduleName("./elements/breadcrumbs/custom-breadcrumbs"),
    PLATFORM.moduleName("./elements/datepicker/custom-datepicker"),
    PLATFORM.moduleName("./elements/dropdown/dropdown"),
    PLATFORM.moduleName("./elements/pagination/pagination"),
    PLATFORM.moduleName("./elements/toast/toast"),
    PLATFORM.moduleName("./elements/tool-bar/tool-bar"),
    PLATFORM.moduleName("./elements/tool-bar/add-tool"),
    PLATFORM.moduleName("./elements/tool-bar/list-tool"),
    PLATFORM.moduleName("./elements/tool-bar/tile-tool"),
    PLATFORM.moduleName("./elements/tool-bar/dropdown-menu-tool"),
    PLATFORM.moduleName("./value-converters/currency-value-converter"),
    PLATFORM.moduleName("./value-converters/date-time-value-converter"),
    PLATFORM.moduleName("./value-converters/enum-key-value-value-converter"),
    PLATFORM.moduleName("./value-converters/instruction-filter-value-converter"),
    PLATFORM.moduleName("./value-converters/lookup-name-value-converter"),
  ]);
}

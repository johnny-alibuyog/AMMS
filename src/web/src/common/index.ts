import { FrameworkConfiguration, PLATFORM } from "aurelia-framework";

export function configure(config: FrameworkConfiguration) {
  config.globalResources([
    PLATFORM.moduleName("./elements/dropdown"),
    PLATFORM.moduleName("./elements/pagination"),
    PLATFORM.moduleName("./elements/command-bar/command-bar"),
    PLATFORM.moduleName("./elements/command-bar/add-command"),
    PLATFORM.moduleName("./elements/command-bar/list-command"),
    PLATFORM.moduleName("./elements/command-bar/tile-command"),
    PLATFORM.moduleName("./elements/command-bar/menu-command"),
    PLATFORM.moduleName("./value-converters/currency-value-convert")
  ]);
}

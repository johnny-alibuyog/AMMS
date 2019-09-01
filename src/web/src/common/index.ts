import { FrameworkConfiguration, PLATFORM } from "aurelia-framework";

export function configure(config: FrameworkConfiguration) {
  config.globalResources([
    PLATFORM.moduleName("./elements/dropdown"),
    PLATFORM.moduleName("./elements/command-bar"),
    PLATFORM.moduleName("./value-converters/currency-value-convert")
  ]);
}

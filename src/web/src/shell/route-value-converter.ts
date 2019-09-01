import { NavModel } from "aurelia-router";

export class GroupedRouteValueConverter {
  public toView(navModels: NavModel[]): Map<string, NavModel[]> {
    let groups = new Map<string, NavModel[]>();
    for (let model of navModels) {
      let keys = (() => {
        if (model.settings.group instanceof Array)
          return model.settings.group as string[];
        else if (
          typeof model.settings.group === "string" ||
          model.settings.group instanceof String
        )
          return [model.settings.group as string];
        else return ["Misc"]; //[model.title];
      })();

      for (let key of keys) {
        let routes = groups.get(key);
        if (!routes) {
          groups.set(key, (routes = []));
        }
        routes.push(model);
      }
    }
    return groups;
  }
}

export class GroupedRouteSizeValueConverter {
  public toView(navModels: NavModel[]): number {
    const groupedRoutes = new GroupedRouteValueConverter().toView(navModels);
    return groupedRoutes.size;
  }
}

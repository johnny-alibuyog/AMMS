import { NavModel } from 'aurelia-router';

export class GroupedRouteValueConverter {
  public toView(navModels: NavModel[]): Map<string, NavModel[]> {
    let groups = new Map<string, NavModel[]>();

    const parseGroupNames = (model: NavModel) => {
      if (model.settings.group instanceof Array) {
        return model.settings.group as string[];
      }
      else if (typeof model.settings.group === 'string' || model.settings.group instanceof String) {
        return [model.settings.group as string];
      }
      else {
        return ['Misc']; //[model.title];
      }
    };

    for (let model of navModels) {
      let keys = parseGroupNames(model);

      for (let key of keys) {
        let routes = groups.get(key);
        if (!routes) {
          groups.set(key, (routes = []));
        }
        routes.push(model);
      }
    }

    const removeMisc = (x: Map<string, NavModel[]>) => {
      const preserve = x.get('Misc');
      x.delete('Misc');
      x.set('', preserve);
      return x;
    }

    const hasNoGroups = (x: Map<string, NavModel[]>) => x.size == 1 && x.has('Misc');

    const cleanGroups = (x: Map<string, NavModel[]>) => hasNoGroups(x) ? removeMisc(x) : x;

    return cleanGroups(groups);
  }
}

export class GroupedRouteSizeValueConverter {
  public toView(navModels: NavModel[]): number {
    const groupedRoutes = new GroupedRouteValueConverter().toView(navModels);
    return groupedRoutes.size;
  }
}

// https://ux.stackexchange.com/questions/7044/how-would-you-handle-user-access-management-with-4-levels-and-9-unique-roles

enum ResourceGroup {
  all = 'All',
  common = 'Common',
  membership = 'Membership',
  services = 'Services',
  sales = 'Sales',
  inventory = 'Inventory',
  purchasing = 'Purchasing',

}

type ResourceId = string;

type Resource = {
  id: ResourceId,
  name: string,
  group: ResourceGroup;
}

export {
  Resource,
  ResourceId,
  ResourceGroup,
}

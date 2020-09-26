// const flatten = <TModel>(obj: Object): TModel[] => {
//   if (obj instanceof TModel) {
//     return [obj];
//   }
//   const resources: TModel[] = [];
//   const vals = Object.values(obj);
//   vals.forEach(val => {
//     if (val instanceof TModel) {
//       resources.push(val)
//     }
//     else {
//       resources.push(...flatten<TModel>(val));
//     }
//   });
//   return resources;
// }

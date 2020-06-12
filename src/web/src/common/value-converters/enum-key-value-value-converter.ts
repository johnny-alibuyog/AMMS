type EnumType<TKey extends string | number, TValue> = { [key in TKey]: TValue }

export class EnumKeyValueValueConverter {
  public toView<TKey extends string | number, TValue>(enumType: { [key in TKey]: TValue }) {
    debugger;

    return Object.entries(enumType)
      .map(([key, value]) => ({ key, value}));
  }
}

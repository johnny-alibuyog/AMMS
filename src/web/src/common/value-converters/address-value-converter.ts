import { isNotNullOrDefault, isNullOrDefault } from "common/utils";

import { Address } from "features/common/address/address.model";

export class AddressValueConverter {
  toView(address: Address): string {
    const separator = ',';
    const concatAddress = (...values: string[]) => {
      return values.reduce((prev, current) => {
        if (isNullOrDefault(current)) {
          return prev;
        }
        if (current == separator) {
          return isNotNullOrDefault(prev) ? `${prev}${separator}` : '';
        }
        if (isNullOrDefault(prev)) {
          return current;
        }
        return `${prev} ${current}`;
      }, '');
    };

    const value = concatAddress(
      address.line1,
      address.line2,
      separator,
      address.municipality,
      separator,
      address.province
    );

    return value;
  }
}

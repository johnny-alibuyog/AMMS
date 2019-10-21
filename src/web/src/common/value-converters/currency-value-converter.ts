// for the list of all currencies, refer to http://www.fileformat.info/system/currency.htm
const currencies = {
  USD: { locale: "en-US", symbol: "$", deimalPlaces: 2 },
  PHP: { locale: "en-PH", symbol: "₱", deimalPlaces: 2 }
};

export class CurrencyValueConverter {
  toView(value: number, currencyCode: string = "PHP"): string {
    const currency = currencies[currencyCode];

    const formatter = new Intl.NumberFormat(currency.locale, {
      style: "currency",
      currency: currencyCode
    });

    return formatter.format(value / 100);
  }
}

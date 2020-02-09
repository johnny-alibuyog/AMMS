import { ValidationRules } from "aurelia-validation";

const customRules = {
  matchesProperty: 'matchesProperty'
};

ValidationRules.customRule(
  customRules.matchesProperty,
  (value, obj, otherPropertyName) =>
    value === null ||
    value === undefined ||
    value === '' ||
    obj[otherPropertyName] === null ||
    obj[otherPropertyName] === undefined ||
    obj[otherPropertyName] === '' ||
    value === obj[otherPropertyName],
  '${$displayName} must match ${$getDisplayName($config.otherPropertyName)}',
  (otherPropertyName) => ({ otherPropertyName })
);

export const rules = customRules;

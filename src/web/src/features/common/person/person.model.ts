import { ValidationRules } from "aurelia-validation";

enum Gender {
  male = 'Male',
  female = 'Female',
  others = 'Others'
}

type Person = {
  firstName: string,
  middleName?: string,
  lastName: string,
  gender: Gender,
  birthDate?: Date
}

const fullName = (person: Person) => `${person.firstName} ${person.lastName}`;

const initPerson = (): Person => ({
  firstName: '',
  middleName: '',
  lastName: '',
  gender: Gender.male,
  birthDate: null
});

const personRules = ValidationRules
  .ensure((person: Person) => person.firstName).required()
  .ensure((person: Person) => person.lastName).required()
  .ensure((person: Person) => person.gender).required()
  .rules;

export {
  Gender,
  Person,
  fullName,
  initPerson,
  personRules,
}

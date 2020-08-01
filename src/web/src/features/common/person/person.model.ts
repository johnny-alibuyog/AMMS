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

export {
  Gender,
  Person,
  fullName,
  initPerson,
}

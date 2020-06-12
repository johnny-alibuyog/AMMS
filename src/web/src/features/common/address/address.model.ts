type Address = {
  // unit?: string,
  // street?: string,
  // subdivision?: string,
  // district?: string,
  line1?: string,
  line2?: string,
  municipality?: string,
  province?: string,
  country?: string,
  zipcode?: string
}

const initAddress = (): Address => ({
  line1: '',
  line2: '',
  municipality: '',
  province: '',
  country: 'Philippines',
  zipcode: ''
});

export {
  Address,
  initAddress
}

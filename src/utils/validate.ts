const validateEmail = (val: string): boolean => {
  return /^[A-Za-z0-9]+([_\.][A-Za-z0-9]+)*@([A-Za-z0-9\-]+\.)+[A-Za-z]{2,6}$/.test(val)
}

const validateMobile = (val: string): boolean => {
  return /^1[3-9]\d{9}$/.test(val)
}

export { validateEmail, validateMobile };

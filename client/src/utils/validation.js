import isEmail from 'validator/lib/isEmail';

export const requiredValidation = value => ({
  error: !value || value.trim() === '' ? 'This field is required' : null
});

export const passwordMatchValidation = (currentPassword, abovePassword) => {
  const required = this.requiredValidation(currentPassword);
  if (required.error !== null) return required;
  
  if (currentPassword !== abovePassword) {
    return { error: 'Password mismatch' };
  }

  return null;
};

export const emailValidation = value => {
  const required = this.requiredValidation(value);
  if (required.error !== null) return required;

  if (!isEmail(value)) {
    return { error: 'Email invalid' };
  }

  return null;
};
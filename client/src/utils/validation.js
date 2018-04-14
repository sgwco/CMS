import isEmail from 'validator/lib/isEmail';
import isFloat from 'validator/lib/isFloat';

export const requiredValidation = value => ({
  error: !value || value.trim() === '' ? 'This field is required' : null
});

export const numberValidation = value => {
  const required = requiredValidation(value);
  if (required.error !== null) return required;

  if (!isFloat(value)) {
    return { error: 'This field contains non-numeric letter' };
  }

  return null;
};

export const passwordMatchValidation = (currentPassword, abovePassword) => {
  const required = requiredValidation(currentPassword);
  if (required.error !== null) return required;
  
  if (currentPassword !== abovePassword) {
    return { error: 'Password mismatch' };
  }

  return null;
};

export const emailValidation = value => {
  const required = requiredValidation(value);
  if (required.error !== null) return required;

  if (!isEmail(value)) {
    return { error: 'Email invalid' };
  }

  return null;
};
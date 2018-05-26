import isEmail from 'validator/lib/isEmail';
import isFloat from 'validator/lib/isFloat';
import moment from 'moment';

export const requiredValidation = value => {
  if (!value || typeof value === 'undefined') {
    return { error: 'error.required_field' };
  }
  else if (value.trim && value.trim() === '') {
    return { error: 'error.required_field' };
  }
  return null;
};

export const numberValidation = value => {
  let strValue = value + '';
  const required = requiredValidation(strValue);
  if (required && required.error) return required;

  if (!isFloat(strValue)) {
    return { error: 'error.non_numeric' };
  }

  return null;
};

export const passwordMatchValidation = (currentPassword, abovePassword) => {
  const required = requiredValidation(currentPassword);
  if (required && required.error) return required;
  
  if (currentPassword !== abovePassword) {
    return { error: 'error.password_mismatch' };
  }

  return null;
};

export const emailValidation = (value = '') => {
  if (value && value.length > 0) {
    if (!isEmail(value)) {
      return { error: 'error.email_invalid' };
    }
  }
  return null;
};

export const dateValidation = value => {
  const required = requiredValidation(value);
  if (required && required.error) return required;

  const parsedFormat = moment(value, 'DD/MM/YYYY');
  if (!parsedFormat.isValid()) {
    return { error: 'error.date_invalid' };
  }

  return null;
};
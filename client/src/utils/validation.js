import isEmail from 'validator/lib/isEmail';
import isFloat from 'validator/lib/isFloat';
import moment from 'moment';

export const requiredValidation = value => {
  if (typeof value === 'undefined') {
    return { error: 'This field is required' };
  }
  else if (value.trim && value.trim() === '') {
    return { error: 'This field is required' };
  }
  return null;
};

export const numberValidation = value => {
  let strValue = value + '';
  const required = requiredValidation(strValue);
  if (required && required.error) return required;

  if (!isFloat(strValue)) {
    return { error: 'This field contains non-numeric letter' };
  }

  return null;
};

export const passwordMatchValidation = (currentPassword, abovePassword) => {
  const required = requiredValidation(currentPassword);
  if (required && required.error) return required;
  
  if (currentPassword !== abovePassword) {
    return { error: 'Password mismatch' };
  }

  return null;
};

export const emailValidation = (value = '') => {
  if (value.length > 0) {
    if (!isEmail(value)) {
      return { error: 'Email invalid' };
    }
  }
  return null;
};

export const dateValidation = value => {
  const required = requiredValidation(value);
  if (required && required.error) return required;

  const parsedFormat = moment(value, 'DD/MM/YYYY');
  if (!parsedFormat.isValid()) {
    return { error: 'Date invalid' };
  }

  return null;
};
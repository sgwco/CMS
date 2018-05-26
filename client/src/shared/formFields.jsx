import React from 'react';
import { Field } from 'react-form';
import { FormGroup, Label, Input, FormFeedback } from 'reactstrap';
import { FormattedMessage } from 'react-intl';
import { compose, withHandlers } from 'recompose';
import moment from 'moment';
import writtenNumber from 'written-number';
import DatePicker from 'react-datepicker';
import styled from 'styled-components';
import 'react-datepicker/dist/react-datepicker.css';

const RequiredStar = styled.span`
  color: red;
`;

const MoneyAmountStyled = styled.div`
  font-size: 0.8rem;
  font-style: italic;
`;

export const BootstrapTextField = ({ validate, field, onChange, onBlur, label, required, ...rest }) => (
  <Field validate={validate} field={field}>
    {({ value, error, setValue, setTouched }) => (
      <FormGroup>
        <Label for={field}>
          {label} {required && (<RequiredStar>*</RequiredStar>)}
        </Label>
        <Input
          id={field}
          placeholder={label}
          value={value || ''}
          onChange={e => {
            setValue(e.target.value);
            if (onChange) {
              onChange(e.target.value, e);
            }
          }}
          onBlur={e => {
            setTouched();
            if (onBlur) {
              onBlur(e);
            }
          }}
          {...rest}
          invalid={error !== undefined}
        />
        {error && (
          <FormFeedback>
            <FormattedMessage id={error} />
          </FormFeedback>
        )}
      </FormGroup>
    )}
  </Field>
);

export const BootstrapMoneyAmountField = ({ validate, field, onChange, onBlur, label, required, ...rest }) => (
  <Field validate={validate} field={field}>
    {({ value, error, setValue, setTouched }) => (
      <FormGroup>
        <Label for={field}>
          {label} {required && (<RequiredStar>*</RequiredStar>)}
        </Label>
        <Input
          id={field}
          placeholder={label}
          value={value || ''}
          onChange={e => {
            setValue(e.target.value);
            if (onChange) {
              onChange(e.target.value, e);
            }
          }}
          onBlur={e => {
            setTouched();
            if (onBlur) {
              onBlur(e);
            }
          }}
          {...rest}
          invalid={error !== undefined}
        />
        {error && (
          <FormFeedback>
            <FormattedMessage id={error} />
          </FormFeedback>
        )}
        <MoneyAmountStyled>
          x 1000
        </MoneyAmountStyled>
        {value && (
          <MoneyAmountStyled>
            <FormattedMessage id='as_word' />: {writtenNumber(value * 1000, { lang: 'vi' })} đồng
          </MoneyAmountStyled>
        )}
      </FormGroup>
    )}
  </Field>
);

export const BootstrapSelectField = compose(
  withHandlers({
    renderOptionItem: () => item => {
      const option = <option key={item.value} value={item.value}>{item.text}</option>;
      return option;
    }
  })
)(({ validate, field, onChange, onBlur, label, data, renderOptionItem, required }) => (
  <Field validate={validate} field={field} shouldUpdate={data}>
    {({ value, error, setValue, setTouched }) => (
      <FormGroup>
        <Label for={field}>
          {label} {required && (<RequiredStar>*</RequiredStar>)}
        </Label>
        <Input
          id={field}
          type="select"
          value={value || ''}
          onChange={e => {
            setValue(e.target.value);
            if (onChange) {
              onChange(e.target.value, e);
            }
          }}
          onBlur={e => {
            setTouched();
            if (onBlur) {
              onBlur(e);
            }
          }}
          invalid={error !== undefined}
        >
          {data.map(renderOptionItem)}
        </Input>
        {error && (
          <FormFeedback>
            <FormattedMessage id={error} />
          </FormFeedback>
        )}
      </FormGroup>
    )}
  </Field>
));

const FormFeedbackAlwaysShow = styled(FormFeedback)`
  display: block !important;
`;

export const BootstrapDatepickerField = ({ validate, field, label, required }) => (
  <Field validate={validate} field={field}>
    {({ value, error, setValue, setTouched }) => (
      <FormGroup>
        <Label for={field}>
          {label} {required && (<RequiredStar>*</RequiredStar>)}
        </Label>
        <DatePicker
          className={`form-control ${error ? 'is-invalid' : null}`}
          selected={value ? moment(value, 'DD/MM/YYYY') : null}
          onChange={e => {
            setValue(e ? e.format('DD/MM/YYYY') : undefined);
          }}
          placeholderText={label}
          dateFormat="DD/MM/YYYY"
          onBlur={() => {
            setTouched();
          }}
          invalid={error !== undefined}
        />
        {error && (
          <FormFeedbackAlwaysShow>
            <FormattedMessage id={error} />
          </FormFeedbackAlwaysShow>
        )}
      </FormGroup>
    )}
  </Field>
);
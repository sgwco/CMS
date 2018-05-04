import React from 'react';
import { Field } from 'react-form';
import { FormGroup, Label, Input, FormFeedback } from 'reactstrap';
import { compose, withHandlers } from 'recompose';
import moment from 'moment';
import DatePicker from 'react-datepicker';
import styled from 'styled-components';
import 'react-datepicker/dist/react-datepicker.css';

export const BootstrapTextField = ({ validate, field, onChange, onBlur, label, ...rest }) => (
  <Field validate={validate} field={field}>
    {({ value, error, setValue, setTouched }) => (
      <FormGroup>
        <Label for={field}>{label}</Label>
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
        <FormFeedback>{error}</FormFeedback>
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
)(({ validate, field, onChange, onBlur, label, data, renderOptionItem }) => (
  <Field validate={validate} field={field} shouldUpdate={data}>
    {({ value, error, setValue, setTouched }) => (
      <FormGroup>
        <Label for={field}>{label}</Label>
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
        <FormFeedback>{error}</FormFeedback>
      </FormGroup>
    )}
  </Field>
));

const FormFeedbackAlwaysShow = styled(FormFeedback)`
  display: block !important;
`;

export const BootstrapDatepickerField = ({ validate, field, label }) => (
  <Field validate={validate} field={field}>
    {({ value, error, setValue, setTouched }) => (
      <FormGroup>
        <Label for={field}>{label}</Label>
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
          <FormFeedbackAlwaysShow>{error}</FormFeedbackAlwaysShow>
        )}
      </FormGroup>
    )}
  </Field>
);
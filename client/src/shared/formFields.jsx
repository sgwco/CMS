import React from 'react';
import { Field } from 'react-form';
import { FormGroup, Label, Col, Input, FormFeedback } from 'reactstrap';
import { compose, withHandlers } from 'recompose';

export class BootstrapTextField extends React.Component {
  render() {
    const { validate, field } = this.props;

    return (
      <Field validate={validate} field={field}>
        {fieldApi => {
          const { onChange, onBlur, field, label, validate, ...rest } = this.props; // eslint-disable-line
          const { value, error, setValue, setTouched } = fieldApi;

          return (
            <FormGroup row>
              <Label for={field} sm={3}>{label}</Label>
              <Col sm={9}>
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
              </Col>
            </FormGroup>
          );
        }}
      </Field>
    );
  }
}

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
      <FormGroup row>
        <Label for={field} sm={3}>{label}</Label>
        <Col sm={9}>
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
        </Col>
      </FormGroup>
    )}
  </Field>
));
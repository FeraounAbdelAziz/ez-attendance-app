import React from "react";
import { Field, ErrorMessage } from "formik";

import DateView from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import TextError from "./TextError";
function DatePicker(props : any) {
  const { label, name , ...rest } = props;
  return (
    <div>
      <label htmlFor={name}>{label}</label>
              
      <Field name={name}>
        {({ form, field } : any) => {
          const { setFieldValue } = form;
          const { value } = field;
          return (
            <DateView
              id={name}
              {...field}
              {...rest}
              selected={value}
              onChange={(val : any) => setFieldValue(name, val)}
            />
          );
        }}
      </Field>
      <ErrorMessage name={name} component={TextError} />
    </div>
  );
}

export default DatePicker;
import React from 'react'
import {Field,ErrorMessage} from 'formik'
import TextError from './TextError'


function Input(props : any) {
    const {label ,placeholder,name , ...rest} = props
  return (
    <div className='form'>
      <label htmlFor={name}>{label}</label>
      <Field id={name} name={name} placeholder={placeholder}{...rest} />
      <ErrorMessage name={name} component={TextError}/>
    </div>
  )
}

export default Input
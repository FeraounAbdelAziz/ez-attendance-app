import * as React from 'react';
import { useState } from 'react'
import Backdrop from '@mui/material/Backdrop';
import Box from '@mui/material/Box';
import Modal from '@mui/material/Modal';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import { useSpring, animated } from '@react-spring/web';
import { FormControl, FormHelperText, Input, InputLabel } from '@mui/material';
import { Form, Formik } from 'formik';
import * as Yup from "yup";
import FormikControl from "../components/FormikComponents/FormikControl";
import { supabase } from '../supabaseClient';
interface FadeProps {
  children: React.ReactElement;
  in?: boolean;
  onClick?: any;
  onEnter?: (node: HTMLElement, isAppearing: boolean) => void;
  onExited?: (node: HTMLElement, isAppearing: boolean) => void;
  ownerState?: any;
}
const Fade = React.forwardRef<HTMLDivElement, FadeProps>(function Fade(props, ref) {
  const {
    children,
    in: open,
    onClick,
    onEnter,
    onExited,
    ownerState,
    ...other
  } = props;
  const style = useSpring({
    from: { opacity: 0 },
    to: { opacity: open ? 1 : 0 },
    onStart: () => {
      if (open && onEnter) {
        onEnter(null as any, true);
      }
    },
    onRest: () => {
      if (!open && onExited) {
        onExited(null as any, true);
      }
    },
  });

  return (
    <animated.div ref={ref} style={style} {...other}>
      {React.cloneElement(children, { onClick })}
    </animated.div>
  );
});
const style = {
  position: 'absolute' as 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  width: 400,
  // bgcolor: 'white',
  border: '2px solid #000',
  boxShadow: 24,
  p: 4,

};


export default function TableMUI() {
  const [open, setOpen] = useState(false);
  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);






  const initialValuesRegister = {
    name: '',
    year: '',
  };
  const validationSchemaRegister = Yup.object({
    name: Yup.string().required('Required'),
    year: Yup.string()
      .required('Year is required')
      .test('is-four-digits', 'Year should be a valid 4-digit number', (value) => {
        // Check if the value is a number and has exactly 4 digits
        return /^\d{4}$/.test(value);
      }),
  });
  const onSubmitRegister = async (values: any) => {
    console.log('====================================');
    console.log(values);
    console.log('====================================');
    const { data } = await supabase
      .from('class')
      .insert([
        values
      ])
      .select()
    console.log('====================================');
    console.log(data);
    console.log('====================================');
  };
  return (
    <div style={{ left: "10%", position: "relative" }}>
      <Button onClick={handleOpen}>Add class</Button>
      <Modal
        aria-labelledby="spring-modal-title"
        aria-describedby="spring-modal-description"
        open={open}
        onClose={handleClose}
        closeAfterTransition
        slots={{ backdrop: Backdrop }}
        slotProps={{
          backdrop: {
            TransitionComponent: Fade,
          },
        }}
      >
        <Fade in={open}>
          <Box sx={style}>

            <Formik
              initialValues={initialValuesRegister}
              validationSchema={validationSchemaRegister}
              onSubmit={onSubmitRegister}
            >
              {(formik) => {
                return (
                  <Form>

                    <div>
                      <FormikControl
                        control="input"
                        type="text"
                        name="name"
                        label="Class Name :"
                      />
                    </div>
                    <div>
                      <FormikControl
                        control="input"
                        type="text"
                        name="year"
                        label="Class Year : "
                      />
                    </div>
                    <button type="submit" className="btn-submit">
                      submit
                    </button>

                  </Form>
                );
              }}
            </Formik>
           

          </Box>
        </Fade>
      </Modal>
    </div>
  );
}
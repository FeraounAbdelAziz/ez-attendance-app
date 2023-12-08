import * as React from 'react';
import { Form, Formik } from 'formik';
import * as Yup from "yup";
import FormikControl from "../../components/FormikComponents/FormikControl";
import { supabase } from '../../supabaseClient';
import { IonButton, IonButtons, IonFab, IonFabButton, IonIcon, IonItem, IonList, IonModal, IonTitle, IonToolbar } from '@ionic/react';
import { add } from 'ionicons/icons';
import './AddGroupModal.css';

export default function AddGroupModal() {
  const modal = React.useRef<HTMLIonModalElement>(null);

  function dismiss() {
    modal.current?.dismiss();
  }


  const initialValues = {
    name: '',
    speciality: '',
    level: '',
    year_college: '',
  };
  const validationSchema = Yup.object({
    name: Yup.string()
      .required('Required')
      .max(20, 'Name should not exceed 20 characters')
      .matches(/^[a-zA-Z0-9\s]+$/, 'Name should only contain letters and numbers'),

    speciality: Yup.string()
      .max(20, 'Speciality should not exceed 20 characters'),

    level: Yup.string()
      .max(10, 'Level should not exceed 10 characters'),

    year_college: Yup.string()
      .required('Year is required')
      .matches(/^[0-9]{4}\/[0-9]{4}$/, 'Year should be in the format yyyy/yyyy')
      .max(9, 'Year should not exceed 9 characters'),
  });
  const onSubmit = async (values: any) => {

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
    <>
      <IonFab slot="fixed" vertical="bottom" horizontal="end">
        <IonFabButton>
          <IonButton style={{ width: "100%", height: '100%', backgroundColor: "transparent" }} id="open-modal" expand="block">
            <IonIcon icon={add}></IonIcon>
          </IonButton>
        </IonFabButton>
      </IonFab>
      <IonModal id="example-modal" ref={modal} trigger="open-modal">
        <IonToolbar>
          <IonTitle>Add Class</IonTitle>
          <IonButtons slot="end">
            <IonButton color="white" onClick={() => dismiss()}>
              Close
            </IonButton>
          </IonButtons>
        </IonToolbar>
        <Formik
          initialValues={initialValues}
          validationSchema={validationSchema}
          onSubmit={onSubmit}
        >
          {(formik) => {
            return (
              <Form>
                <IonList className='IonList-Input'>
                  <IonItem>
                    <FormikControl
                      control="input"
                      type="text"
                      name="name"
                      label="Class name :"
                    />
                  </IonItem>
                  <IonItem>

                    <FormikControl
                      control="input"
                      type="text"
                      name="speciality"
                      label="Speciality : "
                    />

                  </IonItem>
                  <IonItem>

                    <FormikControl
                      control="input"
                      type="text"
                      name="level"
                      label="Level  : "
                    />
                  </IonItem>
                  <IonItem>


                    <FormikControl
                      control="input"
                      type="text"
                      name="year_college"
                      label="College year: "
                    />
                  </IonItem>
                  <IonItem>
                    <IonButton type="submit" color={"light"}>
                      submit
                    </IonButton>
                  </IonItem>
                </IonList>
              </Form>
            );
          }}
        </Formik>
      </IonModal>
    </>
  );
}
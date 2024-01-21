import * as React from 'react';
import { Form, Formik } from 'formik';
import * as Yup from "yup";

import { IonButton, IonButtons, IonFab, IonFabButton, IonIcon, IonItem, IonList, IonModal, IonTitle, IonToast, IonToolbar } from '@ionic/react';
import { add } from 'ionicons/icons';
import { useParams } from 'react-router';
import * as XLSX from 'xlsx'
import { supabase } from '../../../supabaseClient';
import FormikControl from '../../../components/FormikComponents/FormikControl';

interface studentJson {
  fisrt_name: any,
  second_name: any,

}
export default function AddStudentModal() {
  const modal = React.useRef<HTMLIonModalElement>(null);
  const params = useParams()
  const { class_id, group_id, session_id }: any = params
  function dismiss() {
    modal.current?.dismiss();
  }
  const initialValues = {
    first_name: '',
    second_name: '',
  };
  const validationSchema = Yup.object({
    first_name: Yup.string()
      .required('First Name is required')
    ,

    second_name: Yup.string()
      .required('First Name is required')
    ,

  });

  const onSubmit = async (values: any) => {
    const { first_name, second_name } = values;
    const { data: studentInsert } = await supabase
      .from('student')
      .insert([
        { class_id, group_id, first_name, second_name }
      ])
      .select()
    if (studentInsert && studentInsert.length > 0) {
      const student_id = studentInsert[0].student_id;
      const { data: sessionFetchPerGroupId, error } = await supabase
        .from('session')
        .select('session_id')
        .eq('group_id', group_id)
      console.log(sessionFetchPerGroupId, error);
      sessionFetchPerGroupId?.map(async (session) => {
        const session_id = session.session_id
        const status = ''
        const { data: attendanceInsert, error: attendanceError } = await supabase.from('attendance').insert([{ session_id, student_id, status }]).select()
        console.log(attendanceInsert, attendanceError);
      })

      if (studentInsert) {
        dismiss()
      }
    }


  };


  return (
    <>
      <IonFab slot="fixed" vertical="bottom" horizontal="center">
        <IonFabButton>
          <IonButton style={{ width: "100%", height: '100%', backgroundColor: "transparent" }} id="open-modal-student" expand="block">
            <IonIcon icon={add}></IonIcon>
          </IonButton>
        </IonFabButton>
      </IonFab>

      <IonModal id="example-modal-add-student" ref={modal} trigger="open-modal-student">
        <IonToolbar>
          <IonTitle>Add Student To This GROUP</IonTitle>
          <IonButtons slot="end">
            <IonButton color="warning" onClick={() => {
              dismiss();
            }}>
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
                      name="first_name"
                      label="First name :"
                    />
                  </IonItem>
                  <IonItem>
                    <FormikControl
                      control="input"
                      type="text"
                      name="second_name"
                      label="Second name : "
                    />
                  </IonItem>

                  <IonItem>
                    <IonButton type="submit">Submit</IonButton>
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
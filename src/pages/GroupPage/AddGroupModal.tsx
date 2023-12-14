import * as React from 'react';
import { Form, Formik } from 'formik';
import * as Yup from "yup";
import FormikControl from "../../components/FormikComponents/FormikControl";
import { supabase } from '../../supabaseClient';
import { IonButton, IonButtons, IonFab, IonFabButton, IonIcon, IonItem, IonList, IonModal, IonTitle, IonToast, IonToolbar } from '@ionic/react';
import { add } from 'ionicons/icons';
import { useParams } from 'react-router';
// import './AddGroupModal.css';

export default function AddGroupModal() {
  const modal = React.useRef<HTMLIonModalElement>(null);
  const params = useParams()
  const { class_id }: any = params

  function dismiss() {
    modal.current?.dismiss();
  }
  const initialValues = {
    group_name: 'G',
    group_type: '',
  };

  const validationSchema = Yup.object({
    group_name: Yup.string()
      .required('Group Name is required')
      .test(
        'is-valid-group-name',
        'Invalid group name format',
        (value) => /^G\d+$/.test(value)
      )
      .max(3, 'Group Name must be at max 3 characters'),

    group_type: Yup.string()
      .required('Group Type is required')
      .matches(/^(TP|TD)$/, 'Group Type must be TP or TD'),
  });

  const [showErrorToast, setShowErrorToast] = React.useState(false);

  const onSubmit = async (values: any) => {
    const { group_name, group_type } = values
    const { error } = await supabase
      .from('group')
      .insert([
        { group_name, group_type, class_id }
      ])
      .select()
    if (error) {
      setShowErrorToast(true);
    }
  }

  return (
    <>
      <IonToast
        isOpen={showErrorToast}
        onDidDismiss={() => setShowErrorToast(false)}
        message="An error occurred while adding the group."
        duration={5000}
      />
      <IonFab slot="fixed" vertical="bottom" horizontal="end">
        <IonFabButton>
          <IonButton style={{ width: "100%", height: '100%', backgroundColor: "transparent" }} id="open-modal" expand="block">
            <IonIcon icon={add}></IonIcon>
          </IonButton>
        </IonFabButton>
      </IonFab>
      <IonModal id="example-modal-add-group" ref={modal} trigger="open-modal">
        <IonToolbar>
          <IonTitle>Add Group</IonTitle>
          <IonButtons slot="end">
            <IonButton color="warning" onClick={() => dismiss()}>
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
                      name="group_name"
                      label="Group name :"
                    />
                  </IonItem>
                  <IonItem>
                    <FormikControl
                      control="input"
                      type="text"
                      name="group_type"
                      label="Group Type : "
                    />
                  </IonItem>
                  <IonItem>
                    <IonButton id="open-toast-group" type="submit">Submit</IonButton>
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
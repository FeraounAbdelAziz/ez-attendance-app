import * as React from 'react';
import { Form, Formik } from 'formik';
import * as Yup from "yup";
import FormikControl from "../../components/FormikComponents/FormikControl";
import { supabase } from '../../supabaseClient';
import { IonButton, IonButtons, IonFab, IonFabButton, IonIcon, IonItem, IonList, IonModal, IonTitle, IonToast, IonToolbar } from '@ionic/react';
import { add } from 'ionicons/icons';
import { useParams } from 'react-router';
import * as XLSX from 'xlsx'

interface studentJson {
  fisrt_name: any
  second_name: any
}
export default function AddGroupModal() {
  const modal = React.useRef<HTMLIonModalElement>(null);
  const params = useParams()
  const { class_id }: any = params
  const [fileName, setFileName] = React.useState('')
  function dismiss() {
    modal.current?.dismiss();
  }
  const initialValues = {
    group_name: 'G',
    group_type: '',
    group_file: '',
  };
  const validationSchema = Yup.object({
    group_name: Yup.string()
      .required('Group Name is required')
      .test(
        'is-valid-group-name',
        'Invalid group name format',
        (value) => /^G\d{1,2}$/.test(value)  // Enforce 1 or 2 digits after 'G'
      )
      .max(3, 'Group Name must be at max 3 characters')
    ,


    group_type: Yup.string()
      .required('Group Type is required')
      .matches(/^(TP|TD)$/, 'Group Type must be TP or TD'),

  });
  const [showErrorToast, setShowErrorToast] = React.useState(false);

  const [studentJson, setStudentJson] = React.useState<studentJson[]>();

  const onSubmit = async (values: any) => {
    let group_id = '';
    setFileName('');
    if (studentJson) {
      const { group_name, group_type } = values;

      const { data: groupData, error: groupError } = await supabase
        .from('group')
        .insert([
          { group_name, group_type, class_id }
        ])
        .select();

      if (groupError) {
        setShowErrorToast(true);
        return;
      }
      if (groupData) {
        dismiss()
      }

      group_id = groupData[0].group_id;
    }
    const updatedStudentJson = studentJson?.slice(8).map((student) => ({
      ...student,
      group_id, class_id,
    }));
    setStudentJson(updatedStudentJson);
    const { data: studentsData, error: studentError } = await supabase
      .from('student')
      .insert(updatedStudentJson)
      .select();

    console.log('updatedStudentJson : ', updatedStudentJson);
    console.log(studentError, " , this is student payload :", studentsData);
    console.log('====================================');
    setStudentJson(undefined);
  };










  const handleFile = async (e: any) => {
    const file = e.target.files[0];
    setFileName(file.name);
    const data = await file.arrayBuffer();
    const workbook = XLSX.read(data);
    const worksheet = workbook.Sheets[workbook.SheetNames[0]];
    const jsonData: any = XLSX.utils.sheet_to_json(worksheet, {
      header: 1,
      dateNF: 'dd/mm/yyyy',
    });
    console.log('====================================');
    console.log("jsonData : ", jsonData.map((item: any) => ({
      first_name: item[1],
      second_name: item[2],
    })));
    console.log('====================================');

    setStudentJson(
      jsonData.map((item: any) => ({
        first_name: item[1],
        second_name: item[2],
      }))
    );
  };



















  return (
    <>

      <IonToast
        isOpen={showErrorToast}
        onDidDismiss={() => setShowErrorToast(false)}
        message="You have already this group !"
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
            <IonButton color="warning" onClick={() => {
              dismiss();
              setStudentJson(undefined);
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
                    <input className='Input-File-Group-Add' type="file" id="file-input" name="group_file" onChange={(e: any) => handleFile(e)} />
                    {
                      fileName ? <>{fileName}</> : <label id="file-input-label" htmlFor="file-input">Select a File</label>
                    }
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
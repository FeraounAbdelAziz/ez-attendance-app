import { IonButton, IonButtons, IonCol, IonContent, IonGrid, IonHeader, IonIcon, IonItem, IonLabel, IonList, IonMenuButton, IonModal, IonPage, IonRow, IonText, IonTitle, IonToolbar } from '@ionic/react';
import React, { useEffect, useState } from 'react';
import { supabase } from '../../supabaseClient';
import TableMUI from '../classes/AddGroupModal';
import deleteIcon from "/assets/deleteIcon.svg";
import updateIcon from "/assets/updateIcon.svg";
import * as Yup from 'yup'
import { Form, Formik } from 'formik';
import FormikControl from '../../components/FormikComponents/FormikControl';
import './Page.css';
import '../classes/AddGroupModal.css';

const Page = () => {

  const modal = React.useRef<HTMLIonModalElement>(null);

  function dismiss() {
    modal.current?.dismiss();
  }
  const [classId, setClassId] = useState('')
  const [classes, setClasses] = useState([]);

  async function getClass() {
    const { data } = await supabase
      .from('class')
      .select('*')
    return data || [];
  }
  const deleteClass = async (value: any) => {
    const { error } = await supabase
      .from('class')
      .delete()
      .eq('class_id', value)
  }
  useEffect(() => {
    getClass().then((data: any) => setClasses(data));
  }, [classes]);

  const validationSchemaUpdate = Yup.object({
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
  const onSubmitUpdate = async (values: any) => {
    const { name, speciality, level, year_college } = values;
    console.log('====================================');
    console.log(classId);
    console.log('====================================');
    await supabase
      .from('class')
      .update({ name, speciality, level, year_college })
      .eq('class_id', classId)
      .select();
  };



  return (
    <IonPage>
      <IonHeader>
        <IonToolbar>
          <IonButtons slot="start">
            <IonMenuButton />
          </IonButtons>
          <IonTitle>Hello Teacher</IonTitle>
        </IonToolbar>
      </IonHeader>

      <IonContent fullscreen>
        <IonHeader collapse="condense">
          <IonToolbar>
            <IonTitle size="large">Hello Teacher</IonTitle>
          </IonToolbar>
        </IonHeader>
        {/* <ExcelFile /> */}
        <TableMUI />





        {
          classes?.map((classItem: { class_id: any; name: any; speciality: any; level: any; year_college: any; }, index) => {
            return (
              <IonList key={index} >


                <IonItem>
                  <IonGrid>
                    <IonRow class="ion-justify-content-between ion-align-items-center ion-text-center">
                      <IonCol class="ion-align-self-center" size='8'>
                        <IonText color="white">
                          {classItem.name} {classItem.speciality}
                          {classItem.level} {classItem.year_college}
                        </IonText>
                      </IonCol>
                      <IonCol class="ion-align-self-center" size='4'>
                        <IonButton id="open-modal-update" size='small' onClick={() => setClassId(classItem.class_id)}>
                          <IonIcon src={updateIcon} />
                        </IonButton>
                        <IonButton size='small' onClick={() => deleteClass(classItem.class_id)}>
                          <IonIcon src={deleteIcon} />
                        </IonButton>
                      </IonCol>
                    </IonRow>
                  </IonGrid>
                </IonItem>
                <IonModal id="update-modal" ref={modal} trigger="open-modal-update">
                  <IonToolbar>
                    <IonTitle>Update Class </IonTitle>
                    <IonButtons slot="end">
                      <IonButton color={"warning"} onClick={() => dismiss()}>
                        Close
                      </IonButton>
                    </IonButtons>
                  </IonToolbar>
                  <Formik
                    initialValues={{
                      name: classItem.name,
                      speciality: classItem.speciality,
                      level: classItem.level,
                      year_college: classItem.year_college,
                    }}
                    validationSchema={validationSchemaUpdate}
                    onSubmit={onSubmitUpdate}
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
                                value={formik.values.name}
                                onChange={formik.handleChange}
                              />
                            </IonItem>
                            <IonItem>

                              <FormikControl
                                control="input"
                                type="text"
                                name="speciality"
                                label="Speciality : "
                                value={formik.values.speciality}
                                onChange={formik.handleChange}
                              />

                            </IonItem>
                            <IonItem>

                              <FormikControl
                                control="input"
                                type="text"
                                name="level"
                                label="Level  : "
                                value={formik.values.level}
                                onChange={formik.handleChange}
                              />
                            </IonItem>
                            <IonItem>


                              <FormikControl
                                control="input"
                                type="text"
                                name="year_college"
                                label="College year: "
                                value={formik.values.year_college}
                                onChange={formik.handleChange}
                              />
                            </IonItem>
                            <IonItem>
                              <IonButton type="submit">
                                submit
                              </IonButton>
                            </IonItem>
                          </IonList>
                        </Form>
                      );
                    }}
                  </Formik>
                </IonModal>
              </IonList>

            )
          })
        }
      </IonContent>
    </IonPage>
  );
};

export default Page;

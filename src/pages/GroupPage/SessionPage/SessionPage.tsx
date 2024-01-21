import { IonActionSheet, IonAvatar, IonButton, IonButtons, IonCol, IonContent, IonDatetime, IonDatetimeButton, IonFab, IonFabButton, IonGrid, IonHeader, IonIcon, IonImg, IonItem, IonLabel, IonList, IonModal, IonRadio, IonRadioGroup, IonRow, IonSearchbar, IonText, IonTitle, IonToolbar } from '@ionic/react'
import { add } from 'ionicons/icons'
import { useEffect, useRef, useState } from 'react'
import { useHistory, useParams } from 'react-router'
import { supabase } from '../../../supabaseClient'
import { Swiper, SwiperSlide } from 'swiper/react';
import { homeSharp, arrowBackCircleSharp, pencil, ellipsisVerticalCircleSharp, eye } from 'ionicons/icons';

import 'swiper/css';
import 'swiper/css/autoplay';
import 'swiper/css/keyboard';
import 'swiper/css/pagination';
import 'swiper/css/scrollbar';
import 'swiper/css/zoom';
import '@ionic/react/css/ionic-swiper.css';

import './../../global.css'
import deleteIcon from "/assets/deleteIcon.svg";
import { Link } from 'react-router-dom'
import { OverlayEventDetail } from '@ionic/react/dist/types/components/react-component-lib/interfaces'



function SessionPage() {
  const params = useParams()
  const {
    group_id, class_name, group_name, class_id, speciality, session_id
  }: any = params
  const calendarRef = useRef<HTMLIonDatetimeElement | null>(null)
  const dateSession = useRef<HTMLIonDatetimeElement>(null)
  const modalSession = useRef<HTMLIonModalElement>(null);
  const modalAttendance = useRef<HTMLIonModalElement>(null);

  function dismiss() {
    modalAttendance.current?.dismiss();
  }
  const [session_dates, setSession_dates] = useState<{ date: any; session_id: any; }[]>([]);
  const [date_Session, setDate_Session] = useState(() => {
    const currentDate = new Date();
    return currentDate.toISOString().slice(0, 19);
  })
  const [group_type, setGroup_type] = useState('');


  const highlightedDates = session_dates.map(date => {


    const new_date = new Date(date.date)

    const day = new_date.getDate().toString().padStart(2, '0');
    const month = (new_date.getMonth() + 1).toString().padStart(2, '0'); // Months are zero-based
    const year = new_date.getFullYear();
    const formattedDate = `${year}-${month}-${day}`;


    return {
      date: formattedDate,
      textColor: '#333',
      backgroundColor: 'var(--ion-color-warning)'
    }
  })

  const fetchDataSeesion = async () => {

    const { data: session, error } = await supabase
      .from('session')
      .select('session_id,date')
      .eq('group_id', group_id);

    if (error) {
      return;
    }
    setSession_dates(session);
  };

  const groupTypeFetch = async () => {
    const { data: groupTypeFetch } = await supabase
      .from('group')
      .select('group_type')
      .eq('group_id', group_id);
    if (groupTypeFetch && groupTypeFetch.length > 0) {
      setGroup_type(groupTypeFetch[0].group_type);
    }
  }
  const [studentSession, setStudentSession] = useState<any>([])
  const onSubmitSession = async () => {

    const { data: sessionData } = await supabase
      .from('session')
      .insert([
        { group_id: group_id, date: date_Session },
      ])
      .select()

    const { data: studentArray } = await supabase
      .from('student')
      .select('*')
      .eq('class_id', class_id)
      .eq('group_id', group_id);
    let updatedStudentArrayAttendance = []
    if (studentArray !== null) {
      updatedStudentArrayAttendance = studentArray.map((student: any) => {
        const { class_id, first_name, second_name, group_id, ...rest } = student;
        if (sessionData && sessionData.length > 0) {
          const session_id = sessionData[0].session_id;
          const updatedStudent = {
            ...rest,
            session_id: session_id,
          };
          return updatedStudent;
        }
      }
      );
    }
    await supabase
      .from('attendance')
      .insert(updatedStudentArrayAttendance)
      .select()

    fetchDataSeesion();
    groupTypeFetch();
  }


  const onSubmitSessionUpdate = async (session_id: any) => {
    await supabase
      .from('session')
      .update({ date: date_Session })
      .eq('session_id', session_id)
      .select()

    fetchDataSeesion();
    groupTypeFetch();
  }















  useEffect(() => {
    fetchDataSeesion();
    groupTypeFetch();
  }, [group_id]);

  const studentFetchPerSession = async (session_id: any) => {
    try {
      // Fetch attendance data
      const { data: attendanceData, error: attendanceError } = await supabase
        .from('attendance')
        .select('*')
        .eq('session_id', session_id);

      // Extract student_ids from the attendance data
      const studentIds = attendanceData?.map((attendance) => attendance.student_id);

      if (studentIds) {
        const { data: studentData, error: studentError } = await supabase
          .from('student')
          .select('*')
          .in('student_id', studentIds);
        // Combine the results based on your application logic
        const combinedData = attendanceData?.map((attendance) => {
          const studentInfo = studentData?.find((student) => student.student_id === attendance.student_id);
          return {
            student_id: studentInfo.student_id,
            class_id: studentInfo.class_id,
            first_name: studentInfo.first_name,
            group_id: studentInfo.group_id,
            second_name: studentInfo.second_name,
            status: attendance.status,
          };
        });
        console.log(combinedData);
        setStudentSession(combinedData);
      }

    } catch (e) {
      //
    }

  };

  const OnSubmitStudentAttendance = async (session_id: any, student_id: any, status_student: any) => {
    await supabase
      .from('attendance')
      .update([
        { status: status_student },
      ])
      .eq('session_id', session_id)
      .eq('student_id', student_id)
      .select()
  }

  const [isUpdateDateSessionModalOpen, setIsUpdateDateSessionModalOpen] = useState(false);
  const [selectedSessionIndex, setSelectedSessionIndex] = useState(false);

  const handleCloseUpdateModal = () => {
    setIsUpdateDateSessionModalOpen(false);
  };
  const history = useHistory();
  const actionSheet = async (result: OverlayEventDetail, session_id: any) => {
    if (result.data?.action === "view") {

      history.push(`/class/${class_id}/${class_name}/${speciality}/${group_id}/${group_name}/${session_id}`);

    } else if (result.data?.action === "update") {
      setSelectedSessionIndex(session_id);
      setIsUpdateDateSessionModalOpen(true);
    } else if (result.data?.action === "delete") {
      await supabase
        .from('session')
        .delete()
        .eq('session_id', session_id)
      fetchDataSeesion();
    }

  };

  return (

    <IonContent fullscreen>


      <IonHeader>
        <IonToolbar>
          <IonTitle>
            <Link to={`/class/${class_id}/${class_name}/${speciality}`}>
              <IonIcon style={{ margin: "0 0.8rem", fontSize: '25px' }} icon={arrowBackCircleSharp}></IonIcon>
            </Link>
            <Link to='/class' style={{ margin: '1rem' }}>
              <IonIcon style={{ fontSize: '25px' }} icon={homeSharp}></IonIcon>
            </Link>
            Class {class_name} Group {group_name} </IonTitle>
        </IonToolbar>
      </IonHeader>



      <IonFab slot="fixed" vertical="bottom" horizontal="end">
        <IonFabButton>
          <IonButton style={{ width: "100%", height: '100%', backgroundColor: "transparent" }} id="session-modal" expand="block">
            <IonIcon icon={add}></IonIcon>
          </IonButton>
        </IonFabButton>
      </IonFab>

      <IonModal ref={modalSession} trigger="session-modal" initialBreakpoint={0.08} breakpoints={[0, 0.08]}>
        {/* <IonContent className="ion-padding"> */}
          <IonList>
            <IonItem>
              <IonDatetimeButton datetime="datetime"></IonDatetimeButton>
              <IonButton
                color={'warning'}
                size='default'
                slot='end'
                onClick={() => { onSubmitSession() }}
              >Add</IonButton>
            </IonItem>
          </IonList>
          <IonModal keepContentsMounted={true}>
            <IonDatetime
              id="datetime"
              ref={dateSession}
              onIonChange={() => { setDate_Session(String(dateSession.current?.value)) }}
            ></IonDatetime>
          </IonModal>
        {/* </IonContent> */}
      </IonModal>

      
      <IonDatetime
        size="cover"
        presentation="date"
        showDefaultTitle={true}
        showDefaultTimeLabel={true}
        color={'warning'}
        ref={calendarRef}
        highlightedDates={highlightedDates}
      > <span slot="title"></span></IonDatetime >


      <IonList>

        {
          session_dates
            ?.sort((a: any, b: any) => new Date(b.date).getTime() - new Date(a.date).getTime())
            .map((session: any, index: number) => {
              const formatedSessionDate = new Date(session.date).toLocaleString('en-US', {
                year: 'numeric',
                month: '2-digit',
                day: '2-digit',
                hour: '2-digit',
                minute: '2-digit',
                second: '2-digit',
              }).replace(/,/, '');

              return (
                <IonItem key={index}>
                  <IonGrid>
                    <IonRow className="ion-justify-content-between ion-align-items-center ion-text-center">

                      <IonCol className="ion-align-self-center">
                        <IonButton
                          id={`attendance-modal-${index}`}
                          onClick={() => studentFetchPerSession(session.session_id)}
                        >
                          {class_name} {group_name} {group_type} {formatedSessionDate}
                        </IonButton>
                      </IonCol>
                      <IonCol className="ion-align-self-center">
                        <IonButton id={`open-action-sheet-${session.session_id}`}>
                          <IonIcon icon={ellipsisVerticalCircleSharp}></IonIcon>
                        </IonButton>
                        <IonActionSheet
                          trigger={`open-action-sheet-${session.session_id}`}
                          header="Edit & View"
                          // subHeader="Example subheader"
                          buttons={[
                            {
                              icon: eye,
                              text: 'View session members',
                              role: 'destructive',
                              data: {
                                action: 'view',
                              },
                            },
                            {
                              icon: pencil,
                              text: 'Update Session',
                              id: `open-modal-update-date-session-${session.session_id}`,
                              data: {
                                action: 'update',
                              },
                            },
                            {
                              icon: deleteIcon,
                              text: 'Delete Session',
                              role: 'cancel',
                              data: {
                                action: 'delete',
                              },
                            },
                          ]}
                          onDidDismiss={({ detail }) => actionSheet(detail, session.session_id)}
                        ></IonActionSheet>
                      </IonCol>

                      {/* Update Date Session */}
                      <IonModal
                        id={`open-modal-update-date-session-${session.session_id}`}
                        className={'example-modal-update-session'}
                        isOpen={isUpdateDateSessionModalOpen && selectedSessionIndex === session.session_id}
                        onDidDismiss={handleCloseUpdateModal}
                      ><IonToolbar>
                          <IonTitle>Update Session {session.date} To</IonTitle>
                          <IonButtons slot="end">
                            <IonButton color="warning" onClick={() => handleCloseUpdateModal()}>
                              Close
                            </IonButton>
                          </IonButtons>
                        </IonToolbar>

                        <IonContent className="ion-padding">
                          <IonList>
                            <IonItem>
                              <IonDatetimeButton datetime="datetime"></IonDatetimeButton>
                              <IonButton
                                color={'warning'}
                                size='default'
                                slot='end'
                                onClick={() => { onSubmitSessionUpdate(session.session_id) }}
                              >Update</IonButton>
                            </IonItem>
                          </IonList>
                          <IonModal keepContentsMounted={true}>
                            <IonDatetime
                              id="datetime"
                              ref={dateSession}
                              onIonChange={() => { setDate_Session(String(dateSession.current?.value)) }}
                              value={session.date}
                            ></IonDatetime>
                          </IonModal>
                        </IonContent>


                      </IonModal>


                    </IonRow>
                  </IonGrid>

                  <IonModal ref={modalAttendance} trigger={`attendance-modal-${index}`} className='attendance-modal'>
                    <IonToolbar>
                      <IonTitle>{group_name} {session.date}</IonTitle>
                      <IonButtons slot="end">
                        <IonButton color="warning" onClick={() => dismiss()}>
                          Close
                        </IonButton>
                      </IonButtons>
                    </IonToolbar>
                    <IonContent className="ion-padding" >
                      <Swiper style={{ marginTop: "2rem" }} >

                        {console.log(studentSession)}


                        {studentSession?.map((student: {
                          student_id: number,
                          first_name: string,
                          second_name: string,
                          status: 'P' | 'AB' | 'ABJ'
                        }, index: number) => {

                          return (
                            <SwiperSlide key={index} >
                              <IonGrid >
                                <IonRow style={{ display: 'flex', flexDirection: 'row', justifyContent: 'center' }}>
                                  <IonText><h6> {student.first_name} {' '} {student.second_name}</h6> </IonText>
                                </IonRow>
                                <IonRow style={{ display: 'flex', flexDirection: 'row', justifyContent: 'center' }}>


                                  <IonRadioGroup
                                    style={{ display: 'flex', gap: '20px', marginLeft: '8px', padding: '10px' }}
                                    onIonChange={(e) => OnSubmitStudentAttendance(session.session_id, student.student_id, e.detail.value)}
                                    value={student.status}
                                  >
                                    <IonRadio color={'warning'} labelPlacement='start' value="P">P</IonRadio>
                                    <IonRadio color={'danger'} labelPlacement='start' value="AB">Ab</IonRadio>
                                    <IonRadio color={'success'} labelPlacement='start' value="ABJ">Abj</IonRadio>
                                  </IonRadioGroup>
                                </IonRow>
                              </IonGrid>
                            </SwiperSlide>
                          )
                        })}
                      </Swiper>
                    </IonContent>
                  </IonModal>
                </IonItem>
              )
            })
        }
      </IonList>


    </IonContent >

  )
}

export default SessionPage

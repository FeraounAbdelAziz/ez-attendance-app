import { IonAvatar, IonButton, IonButtons, IonCol, IonContent, IonDatetime, IonDatetimeButton, IonFab, IonFabButton, IonGrid, IonHeader, IonIcon, IonImg, IonItem, IonLabel, IonList, IonModal, IonRadio, IonRadioGroup, IonRow, IonSearchbar, IonText, IonTitle, IonToolbar } from '@ionic/react'
import { add } from 'ionicons/icons'
import { useEffect, useRef, useState } from 'react'
import { useParams } from 'react-router'
import { supabase } from '../../../supabaseClient'

import { Swiper, SwiperSlide } from 'swiper/react';

import 'swiper/css';
import 'swiper/css/autoplay';
import 'swiper/css/keyboard';
import 'swiper/css/pagination';
import 'swiper/css/scrollbar';
import 'swiper/css/zoom';
import '@ionic/react/css/ionic-swiper.css';

import './../../global.css'



function SessionPage() {
  const params = useParams()
  const {
    group_id, class_name, group_name, class_id
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
      console.error('Error fetching data:', error);
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
  const [session_id, setSession_id] = useState('');
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

  useEffect(() => {
    fetchDataSeesion();
    groupTypeFetch();
  }, [group_id]);


  const studentFetchPerSession = async (session_id: any) => {

    const { data: StudentSessionFetch, error } = await supabase
      .from('student')
      .select(`
        student_id,
        group_id,
        first_name,
        second_name,
        class_id,
        attendance (
          status
        )
      `)
      .eq('attendance.session_id', session_id);

    setStudentSession(StudentSessionFetch);
    console.log(StudentSessionFetch, error);

  };


  const OnSubmitStudentAttendance = async (session_id: any, student_id: any, status_student: any) => {
    const { data, error } = await supabase
      .from('attendance')
      .update([
        { status: status_student },
      ])
      .eq('session_id', session_id)
      .eq('student_id', student_id)
      .select()
    console.log(data, error);

  }


  return (

    <IonContent fullscreen>
      <IonFab slot="fixed" vertical="bottom" horizontal="end">
        <IonFabButton>
          <IonButton style={{ width: "100%", height: '100%', backgroundColor: "transparent" }} id="session-modal" expand="block">
            <IonIcon icon={add}></IonIcon>
          </IonButton>
        </IonFabButton>
      </IonFab>

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
          session_dates?.map((session: any, index: any) => {

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
                    <IonCol className="ion-align-self-center" size="8">
                      <IonButton id={`attendance-modal-${index}`} onClick={() => studentFetchPerSession(session.session_id)}>{class_name} {group_name} {group_type} {formatedSessionDate} </IonButton>

                    </IonCol>
                    <IonCol className="ion-align-self-center" size="4">
                      <IonButton onClick={async () => {

                        await supabase
                          .from('session')
                          .delete()
                          .eq('session_id', session.session_id)
                        fetchDataSeesion();
                      }

                      }>Delete</IonButton>
                    </IonCol>


                  </IonRow>
                </IonGrid>
                <IonModal ref={modalAttendance} trigger={`attendance-modal-${index}`} className='attendance-modal'>
                  <IonToolbar>
                    <IonTitle>Group {group_name} {session.date}</IonTitle>
                    <IonButtons slot="end">
                      <IonButton color="warning" onClick={() =>dismiss()}>
                      Close
                    </IonButton>
                  </IonButtons>
                  </IonToolbar>
                  <IonContent className="ion-padding" >
                    <Swiper style={{ marginTop: "3rem" }} >
                      {studentSession?.map((student: {
                        student_id: number, first_name: string, second_name: string, attendance: [{
                          status: 'P' | 'Ab' | 'Abj'
                        }]
                      }, index: number) => {

                        return (
                          <SwiperSlide key={index} >

                            <IonGrid >
                              <IonRow className="ion-justify-content-between ion-align-items-center ion-text-center">
                                <IonCol className="ion-align-self-center" size="8">  <IonText> {student.first_name} {" "} {student.second_name} </IonText></IonCol>
                                <IonCol className="ion-align-self-center" size="4">
                                  <IonRadioGroup
                                    style={{ display: 'flex', gap: '20px', marginLeft: '8px', padding: '10px' }}
                                    onIonChange={(e) => OnSubmitStudentAttendance(session.session_id, student.student_id, e.detail.value)}
                                    value={student.attendance[0].status}
                                  >
                                    <IonRadio color={'warning'} labelPlacement='start' value="P">P</IonRadio>
                                    <IonRadio color={'danger'} labelPlacement='start' value="AB">Ab</IonRadio>
                                  </IonRadioGroup>
                                </IonCol>
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

      <IonModal ref={modalSession} trigger="session-modal" initialBreakpoint={0.85} breakpoints={[0, 0.25, 0.5, 0.75]}>
        <IonContent className="ion-padding">
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
        </IonContent>
      </IonModal>

    </IonContent >

  )
}

export default SessionPage

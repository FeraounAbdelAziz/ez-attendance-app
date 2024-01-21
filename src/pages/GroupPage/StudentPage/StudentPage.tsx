import React, { useEffect, useState } from "react";
import {
  IonButton,
  IonButtons,
  IonCol,
  IonContent,
  IonFab,
  IonFabButton,
  IonGrid,
  IonHeader,
  IonIcon,
  IonItem,
  IonItemOption,
  IonItemOptions,
  IonItemSliding,
  IonLabel,
  IonList,
  IonModal,
  IonRow,
  IonSearchbar,
  IonText,
  IonTitle,
  IonToolbar,
} from "@ionic/react";
import deleteIcon from "/assets/deleteIcon.svg";
import sendIcon from "/assets/sendIcon.svg";
import { Link, useParams } from "react-router-dom";
import { supabase } from "../../../supabaseClient";
import "./StudentPage.css";
import "../../global.css";
import AddStudentModal from "./AddStudentModal";
import { Formik, Form } from "formik";
import FormikControl from "../../../components/FormikComponents/FormikControl";
import * as Yup from "yup";
import { add } from "ionicons/icons";
import {
  homeSharp,
  arrowBackCircleSharp,
  eyeOffSharp,
  eye,
  reader,
  repeat,
  pencil,
} from "ionicons/icons";

const StudentPage = () => {
  const [students, setStudents] = useState<any>([]);
  // console.log(students);

  const params = useParams();
  const {
    group_name,
    group_id,
    class_id,
    class_name,
    speciality,
    session_id,
  }: any = params;
  const [selectedStudentIndex, setSelectedStudentIndex] = useState("");
  const modal = React.useRef<HTMLIonModalElement>(null);

  function dismiss() {
    modal.current?.dismiss();
  }
  const initialValues = {
    classes: "",
    groups: " ",
  };
  const validationSchema = Yup.object({
    classes: Yup.string().required("Required"),
    groups: Yup.string().required("Required"),
  });

  const onSubmit = async (values: any) => {
    console.log(values);

    const { data: class_id } = await supabase
      .from("class")
      .select("class_id")
      .eq("name", values.classes);

    const { data: group_id } = await supabase
      .from("group")
      .select("group_id")
      .eq("group_name", values.groups);

    console.log(class_id, group_id);

    if (class_id && class_id.length > 0 && group_id && group_id.length > 0) {
      await supabase
        .from("student")
        .update({
          group_id: group_id[0].group_id,
          class_id: class_id[0].class_id,
        })
        .eq("student_id", selectedStudentIndex)
        .select();
      const { data: attendanceResult, error: attendanceError } = await supabase
        .from("attendance")
        .update({ session_id: session_id })
        .eq("student_id", selectedStudentIndex)
        .select();
      console.log(attendanceResult, attendanceError);

      if (attendanceResult) {
        dismiss();
      }
    }
  };

  const studentFetchPerSession = async () => {
    try {
      // Fetch attendance data
      const { data: attendanceData, error: attendanceError } = await supabase
        .from("attendance")
        .select("*")
        .eq("session_id", session_id);

      // Extract student_ids from the attendance data
      const studentIds = attendanceData?.map(
        (attendance) => attendance.student_id
      );

      if (studentIds) {
        const { data: studentData, error: studentError } = await supabase
          .from("student")
          .select("*")
          .in("student_id", studentIds);

        // Combine the results based on your application logic
        const combinedData = attendanceData?.map((attendance) => {
          const studentInfo = studentData?.find(
            (student) => student.student_id === attendance.student_id
          );
          return {
            student_id: studentInfo.student_id,
            class_id: studentInfo.class_id,
            first_name: studentInfo.first_name,
            group_id: studentInfo.group_id,
            second_name: studentInfo.second_name,
            comment: attendance.comment,
            status: attendance.status,
          };
        });
        // console.log(combinedData);
        setStudents(combinedData);
      }
    } catch (e) {
      //
    }
  };

  studentFetchPerSession();

  const [selectedClasses, setSelectedClasses] = useState<any>([]);
  const fetchSpecialityThisYear = async () => {
    const currentYear = new Date().getFullYear();
    const nextYear = currentYear + 1;
    const academicYear = `${currentYear}/${nextYear}`;

    const { data: classes, error } = await supabase
      .from("class")
      .select("name")
      .eq("year_college", academicYear)
      .eq("speciality", speciality);

    setSelectedClasses(classes);
  };
  fetchSpecialityThisYear();
  const dropdownClasses = [
    {
      key: "Select a class",
      value: "",
    },
    ...selectedClasses?.map((name_class: any) => ({
      key: name_class.name,
      value: name_class.name,
    })),
  ];
  // console.log(dropdownClasses);

  const [selectedGroupIndex, setSelectedGroupIndex] = useState<any>([]);
  // const [selectedStudentIndex, setSelectedStudentIndex] = useState('');
  const [selectedGroups, setSelectedGroups] = useState<any>([]);

  const fetchGroupsThisClass = async () => {
    try {
      const { data: class_id_for_group_fetch } = await supabase
        .from("class")
        .select("class_id")
        .eq("name", selectedGroupIndex);

      if (class_id_for_group_fetch && class_id_for_group_fetch.length > 0) {
        const { data: groups, error: groupError } = await supabase
          .from("group")
          .select("group_name")
          .eq("class_id", class_id_for_group_fetch[0]?.class_id);

        setSelectedGroups(groups);
      }
    } catch (error) {
      //
    }
  };

  const dropdownGroups = [
    {
      key: "Select a group",
      value: "",
    },
    ...selectedGroups?.map((name_group: any) => ({
      key: name_group.group_name,
      value: name_group.group_name,
    })),
  ];

  useEffect(() => {
    fetchGroupsThisClass();
  }, [selectedGroupIndex]);

  const [isTransferModalOpen, setIsTransferModalOpen] = useState(false);
  const [isCommentModalOpen, setIsCommentModalOpen] = useState(false);
  const [isUpdateModalOpen, setIsUpdateModalOpen] = useState(false);

  const handleOpenTransferModal = (studentId: any) => {
    setSelectedStudentIndex(studentId);
    setIsTransferModalOpen(true);
  };
  const handleOpenCommentModal = (studentId: any) => {
    setSelectedStudentIndex(studentId);
    setIsCommentModalOpen(true);
  };
  const handleOpenUpdateModal = (studentId: any) => {
    setSelectedStudentIndex(studentId);
    setIsUpdateModalOpen(true);
  };

  const handleCloseTransferModal = () => {
    setIsTransferModalOpen(false);
  };

  const handleCloseCommentModal = () => {
    setIsCommentModalOpen(false);
  };
  const handleCloseUpdateModal = () => {
    setIsUpdateModalOpen(false);
  };

  const PresenteStudents = students?.filter(
    (student: any) => student.status === "P"
  );
  const absentStudents = students?.filter(
    (student: any) => student.status === "AB"
  );
  const absentJStudents = students?.filter(
    (student: any) => student.status === "ABJ"
  );

  const PresenteCount = PresenteStudents?.length || 0;
  const absentCount = absentStudents?.length || 0;
  const absentJCount = absentJStudents?.length || 0;

  const initialValuesComment = {
    comment: "",
  };
  const validationSchemaComment = Yup.object({
    comment: Yup.string().required("Required").max(25, "max caracters 25 !"),
  });

  const onSubmitComment = async (values: any) => {
    const { comment } = values;
    const { data, error } = await supabase
      .from("attendance")
      .update([{ comment: comment }])
      .eq("student_id", selectedStudentIndex)
      .eq("session_id", session_id)
      .select();
    console.log(data, error);
  };

  const validationSchemaUpdate = Yup.object({
    first_name: Yup.string().required("First Name is required"),
    second_name: Yup.string().required("First Name is required"),
  });

  return (
    <React.Fragment>
      <IonContent fullscreen>
        <IonHeader>
          <IonToolbar>
            <IonTitle>
              <Link
                to={`/class/${class_id}/${class_name}/${speciality}/${group_id}/${group_name}/session`}
              >
                <IonIcon
                  style={{ margin: "0 0.8rem", fontSize: "25px" }}
                  icon={arrowBackCircleSharp}
                ></IonIcon>
              </Link>
              <Link to="/class">
                <IonIcon
                  style={{ margin: "0 1rem", fontSize: "25px" }}
                  icon={homeSharp}
                ></IonIcon>
              </Link>
              Students Section {group_name}
            </IonTitle>
          </IonToolbar>
          <IonToolbar>
            <IonTitle>
              <h6>
                {" "}
                <IonText color={"warning"}>
                  Presente : {PresenteCount}
                </IonText>{" "}
                | <IonText color={"danger"}>Absent : {absentCount}</IonText> |{" "}
                <IonText color={"success"}>AbsentJ : {absentJCount}</IonText>
              </h6>
            </IonTitle>
          </IonToolbar>
        </IonHeader>

        <AddStudentModal />

        {students?.map(
          (
            student: {
              student_id: any;
              first_name: string;
              second_name: string;
              status: string;
              comment: string;
            },
            index: any
          ) => (
            <IonItemSliding key={student.student_id}>
              <IonItemOptions side="start">
                <IonItemOption
                  color="warning"
                  id={`open-modal-update-student-${student.student_id}`}
                  onClick={() => handleOpenUpdateModal(student.student_id)}
                >
                  <IonIcon icon={pencil}></IonIcon>
                </IonItemOption>

                <IonItemOption
                  color="dark"
                  id={`open-modal-comment-student-${student.student_id}`}
                  onClick={() => handleOpenCommentModal(student.student_id)}
                >
                  <IonIcon icon={reader}></IonIcon>
                </IonItemOption>
                <IonItemOption
                  color="secondary"
                  id={`open-modal-transfert-student-${student.student_id}`}
                  onClick={() => handleOpenTransferModal(student.student_id)}
                >
                  <IonIcon icon={repeat}></IonIcon>
                </IonItemOption>

                {/*Transfert Student Modal*/}
                <IonModal
                  id={`example-modal-transfert-student-${student.student_id}`}
                  className={"example-modal-transfert-student"}
                  isOpen={
                    isTransferModalOpen &&
                    selectedStudentIndex === student.student_id
                  }
                  onDidDismiss={handleCloseTransferModal}
                >
                  <IonToolbar>
                    <IonTitle>Transfert Student {student.first_name}</IonTitle>
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
                      useEffect(() => {
                        setSelectedGroupIndex(formik.values.classes);
                        setSelectedStudentIndex(student.student_id);
                      }, [formik.values.classes]);

                      return (
                        <Form>
                          <IonList className="IonList-Input">
                            <IonItem>
                              From speciality {speciality} {group_name}
                            </IonItem>

                            <IonItem>to :</IonItem>

                            <IonItem>
                              <FormikControl
                                control="select"
                                name="classes"
                                label="classes : "
                                options={dropdownClasses}
                              />
                            </IonItem>
                            <IonItem>
                              <FormikControl
                                control="select"
                                name="groups"
                                label="groups : "
                                options={dropdownGroups}
                              />
                            </IonItem>
                            <IonItem>
                              <IonButton type="submit" color="warning">
                                submit
                              </IonButton>
                            </IonItem>
                          </IonList>
                        </Form>
                      );
                    }}
                  </Formik>
                </IonModal>

                {/*Comment Student Modal*/}
                <IonModal
                  id={`example-modal-comment-student-${student.student_id}`}
                  className={"example-modal-comment-student"}
                  isOpen={
                    isCommentModalOpen &&
                    selectedStudentIndex === student.student_id
                  }
                  onDidDismiss={handleCloseCommentModal}
                >
                  <IonToolbar>
                    <IonTitle>Comment a Student {student.first_name}</IonTitle>
                    <IonButtons slot="end">
                      <IonButton
                        color="warning"
                        onClick={() => handleCloseCommentModal()}
                      >
                        Close
                      </IonButton>
                    </IonButtons>
                  </IonToolbar>

                  <Formik
                    initialValues={initialValuesComment}
                    validationSchema={validationSchemaComment}
                    onSubmit={onSubmitComment}
                  >
                    {(formik) => {
                      useEffect(() => {
                        setSelectedStudentIndex(student.student_id);
                      }, [formik.values.comment]);

                      return (
                        <Form>
                          <IonList className="IonList-Input">
                            <IonItem>
                              <IonTitle>
                                <h6>{student.comment}</h6>
                              </IonTitle>
                            </IonItem>
                            <IonItem>
                              <FormikControl
                                control="input"
                                type="text"
                                name="comment"
                                label="comment : "
                              />
                            </IonItem>
                            <IonItem>
                              <IonButton type="submit" color="warning">
                                submit
                              </IonButton>
                            </IonItem>
                          </IonList>
                        </Form>
                      );
                    }}
                  </Formik>
                </IonModal>

                {/*Update Student Modal*/}
                <IonModal
                  id={`example-modal-update-student-${student.student_id}`}
                  className={"example-modal-update-student"}
                  isOpen={
                    isUpdateModalOpen &&
                    selectedStudentIndex === student.student_id
                  }
                  onDidDismiss={handleCloseUpdateModal}
                >
                  <IonToolbar>
                    <IonTitle>Update Student {student.first_name}</IonTitle>
                    <IonButtons slot="end">
                      <IonButton
                        color="warning"
                        onClick={() => handleCloseUpdateModal()}
                      >
                        Close
                      </IonButton>
                    </IonButtons>
                  </IonToolbar>
                  <Formik
                    initialValues={{
                      first_name: student.first_name,
                      second_name: student.second_name,
                    }}
                    validationSchema={validationSchemaUpdate}
                    onSubmit={async (values: {
                      first_name: string;
                      second_name: string;
                    }) => {
                      const { first_name, second_name } = values;

                      const { data, error } = await supabase
                        .from("student")
                        .update({
                          first_name: first_name,
                          second_name: second_name,
                        })
                        .eq("student_id", student.student_id)
                        .eq("group_id", group_id)
                        .select();

                      console.log(data, error);
                    }}
                  >
                    {(formik) => {
                      useEffect(() => {
                        setSelectedStudentIndex(student.student_id);
                      }, [formik.values.first_name]);

                      return (
                        <Form>
                          <IonList className="IonList-Input">
                            <IonItem>
                              <FormikControl
                                control="input"
                                type="text"
                                name="first_name"
                                label="First name :"
                                value={formik.values.first_name}
                                onChange={formik.handleChange}
                              />
                            </IonItem>
                            <IonItem>
                              <FormikControl
                                control="input"
                                type="text"
                                name="second_name"
                                label="Second name : "
                                value={formik.values.second_name}
                                onChange={formik.handleChange}
                              />
                            </IonItem>
                            <IonItem>
                              <IonButton type="submit" color="warning">
                                submit
                              </IonButton>
                            </IonItem>
                          </IonList>
                        </Form>
                      );
                    }}
                  </Formik>
                </IonModal>
              </IonItemOptions>
              <IonItem>
                <IonGrid>
                  <IonRow>
                    <IonCol size="2" style={{ borderBottom: "1px solid #777" }}>
                      <IonText className="IonTextSmallFont">
                        {index + 1}
                      </IonText>
                    </IonCol>
                    <IonCol size="4" style={{ borderBottom: "1px solid #777" }}>
                      <IonText className="IonTextSmallFont">
                        {student.first_name}
                      </IonText>
                    </IonCol>
                    <IonCol size="4" style={{ borderBottom: "1px solid #777" }}>
                      <IonText className="IonTextSmallFont">
                        {student.second_name}
                      </IonText>
                    </IonCol>

                    <IonCol size="2" style={{ borderBottom: "1px solid #777" }}>
                      <IonText className="IonTextSmallFont">
                        {student.status}
                      </IonText>
                    </IonCol>
                  </IonRow>
                </IonGrid>
              </IonItem>
              <IonItemOptions side="end">
                <IonItemOption
                  color="danger"
                  onClick={async () => {
                    await supabase
                      .from("student")
                      .delete()
                      .eq("student_id", student.student_id);
                  }}
                >
                  <IonIcon icon={deleteIcon}></IonIcon>
                </IonItemOption>
              </IonItemOptions>
            </IonItemSliding>
          )
        )}
      </IonContent>
    </React.Fragment>
  );
};

export default StudentPage;

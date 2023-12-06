import { IonButtons, IonContent, IonHeader, IonMenuButton, IonPage, IonTitle, IonToolbar } from '@ionic/react';
import { useEffect, useState } from 'react';
import { useParams } from 'react-router';
import ExploreContainer from '../components/ExploreContainer';
import {supabase} from '../supabaseClient'
import './Page.css';
import TableMUI from './TableMUI';

const Page = () => {
  const { name } = useParams<{ name: string; }>();
  interface Users {
    user_id: any,
    username: any,
    password: any ,
  }
  const [users, setUsers] = useState<Users[]>([]);

  async function getusers() {

    const { data, error } = await supabase
      .from('users')
      .select('*')
      
    if (error) {
      console.error('Error fetching users :', error);
      return [];
    }
    return data;
  }

  useEffect(() => {
    getusers().then((data) => {
      setUsers(data);
    });
  }, []);

  return (
    <IonPage>
      <IonHeader>
        <IonToolbar>
          <IonButtons slot="start">
            <IonMenuButton />
          </IonButtons>
          <IonTitle>{name}</IonTitle>
        </IonToolbar>
      </IonHeader>

      <IonContent fullscreen>
        <IonHeader collapse="condense">
          <IonToolbar>
            <IonTitle size="large">{name}</IonTitle>
          </IonToolbar>
        </IonHeader>

        {/* <div style={{ display: 'flex' , justifyContent : "space-between"}}>
      <div style={{ width : "250px" ,height : "50px",display : "flex", alignItems : "center",justifyContent :"center", backgroundColor: 'red' }}>Red</div>
      <div style={{ width : "250px" ,height : "50px",display : "flex", alignItems : "center",justifyContent :"center", backgroundColor: 'green' }}>Green</div>
      <div style={{ width : "250px" ,height : "50px",display : "flex", alignItems : "center",justifyContent :"center", backgroundColor: 'blue' }}>Blue</div>
    </div> */}
        <ul>
          {users.map((user) => (
            <li key={user.user_id}>user : {user.username} password : {user.password}</li>
          ))}
        </ul>
        <TableMUI />
        {/* <ExploreContainer name={name} /> */}
      </IonContent>
    </IonPage>
  );
};

export default Page;

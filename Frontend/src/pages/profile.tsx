import { withPageAuthRequired } from '@auth0/nextjs-auth0/client'
import Layout from '../components/layout'
import { useState } from 'react'
import React from "react";
import { PeerPrepClient } from "@/lib/PeerPrepClient";
import { User } from "../models/types";
import { set } from '@auth0/nextjs-auth0/dist/session';
// import { getUser } from "./api/users/[user_id]";

type AuthUser = {
  user_id: string
  email: string
  email_verified: boolean
  name: string
  nickname: string
  picture: string
  sub: string
  updated_at: string
}

type ProfileCardProps = {
  user: AuthUser
}

// const ProfileCard = ({ user }: ProfileCardProps) => {
//   return (
//     <div className="bg-sky-500">
//       <h1>Profile</h1>

//       <div>
//         <h3>Profile</h3>
//         <img src={user.picture} alt="user picture" />
//         <p>nickname: {user.nickname}</p>
//         <p>name: {user.name}</p>
//       </div>
//     </div>
//   )
// }

const ProfileCard = ({ user }: ProfileCardProps) => {
  // const client = new PeerPrepClient();
  const [editing, setEditing] = useState(false);
  const [username, setUsername] = useState<string>();
  const [email, setEmail] = useState<string>();

  function fetchUser() {
    fetch(`/api/users/${user.sub}`).then((response) => response.json())
    .then((fetchedUser) => {
      setUsername(fetchedUser.username);
      setEmail(fetchedUser.email);
      // You can set the state with fetchedUser.username and fetchedUser.email here
    })
    .catch((error) => {
      console.error('Error fetching user data:', error);
    });
  }

  React.useEffect(() => {
      fetchUser()
  }, []);

  const handleEditClick = () => {
    setEditing(true);
  };

  const handleSaveClick = () => {
    setEditing(false);
    // You can add logic here to save the updated username and email to your backend.
  };

  const handleCancelClick = () => {
    setEditing(false);
  };

  const handleUsernameChange = (e) => {
    setUsername(e.target.value);
  };

  const handleEmailChange = (e) => {
    setEmail(e.target.value);
  };

  return (
    <div>
      <h2>User Profile</h2>
        {/* <img src={user.picture} alt="user picture" /> */}
      {editing ? (
        <div>
          <label htmlFor="username">Username:</label>
          <input
            type="text"
            id="username"
            value={username}
            onChange={handleUsernameChange}
          />
          <br />
          <label htmlFor="email">Email:</label>
          <input
            type="text"
            id="email"
            value={email}
            onChange={handleEmailChange}
          />
          <br />
          <button onClick={handleSaveClick}>Save</button>
          <button onClick={handleCancelClick}>Cancel</button>
        </div>
      ) : (
        <div>
          <p>
            <strong>Username:</strong> {username}
          </p>
          <p>
            <strong>Email:</strong> {email}
          </p>
          <button className={"button"} onClick={handleEditClick}>Edit</button>
        </div>
      )}
    </div>
  );
};

type ProfileProps = {
  user?: any
  isLoading: boolean
}

const Profile = ({ user, isLoading }: ProfileProps) => {
  console.log(user);
  return (
    <Layout user={user} loading={isLoading}>
      {isLoading ? <>Loading...</> : <ProfileCard user={user} />}
    </Layout>
  )
}

// Protected route, checking user authentication client-side.(CSR)
export default withPageAuthRequired(Profile)

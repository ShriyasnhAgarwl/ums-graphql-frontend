import React, { useState } from "react";
import { useQuery, useMutation } from "@apollo/client";
// import { GET_USERS, ADD_USER, UPDATE_USER, DELETE_USER } from "./graphql";
import { gql } from "@apollo/client";

// Existing operations
export const GET_USERS = gql`
  query GetUsers {
    users {
      id
      name
      email
    }
  }
`;

export const ADD_USER = gql`
  mutation AddUser($name: String!, $email: String!) {
    addUser(name: $name, email: $email) {
      id
      name
      email
    }
  }
`;

// New operations
export const UPDATE_USER = gql`
  mutation UpdateUser($id: ID!, $name: String, $email: String) {
    updateUser(id: $id, name: $name, email: $email) {
      id
      name
      email
    }
  }
`;

export const DELETE_USER = gql`
  mutation DeleteUser($id: ID!) {
    deleteUser(id: $id)
  }
`;

function App() {
  const { loading, error, data } = useQuery(GET_USERS);
  const [addUser] = useMutation(ADD_USER, { refetchQueries: [{ query: GET_USERS }] });
  const [updateUser] = useMutation(UPDATE_USER, { refetchQueries: [{ query: GET_USERS }] });
  const [deleteUser] = useMutation(DELETE_USER, { refetchQueries: [{ query: GET_USERS }] });

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [editId, setEditId] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editId) {
        await updateUser({ variables: { id: editId, name, email } });
      } else {
        await addUser({ variables: { name, email } });
      }
      setName("");
      setEmail("");
      setEditId(null);
    } catch (error) {
      alert(error.message);
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm("Are you sure you want to delete this user?")) {
      try {
        await deleteUser({ variables: { id } });
      } catch (error) {
        alert(error.message);
      }
    }
  };

  const handleEdit = (user) => {
    setName(user.name);
    setEmail(user.email);
    setEditId(user.id);
  };

  if (loading) return <p>Loading...</p>;
  if (error) return <p>Error: {error.message}</p>;

  return (
    <div className="p-6 bg-gray-100 rounded shadow-md">
      <h1 className="text-xl font-bold text-center">User Management</h1>
      <ul>
        {data.users.map((user) => (
          <li key={user.id}>
            {user.name} - {user.email}
            <button onClick={() => handleEdit(user)}>Edit</button>
            <button onClick={() => handleDelete(user.id)}>Delete</button>
          </li>
        ))}
      </ul>

      <h2>{editId ? "Edit User" : "Add New User"}</h2>
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          placeholder="Name"
          value={name}
          onChange={(e) => setName(e.target.value)}
        />
        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
        <button type="submit">{editId ? "Update User" : "Add User"}</button>
        {editId && <button onClick={() => setEditId(null)}>Cancel</button>}
      </form>
    </div>
  );
}

export default App;

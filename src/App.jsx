import React, { useState } from "react";
import { gql, useQuery, useMutation } from "@apollo/client";

// GraphQL Query
const GET_USERS = gql`
  query GetUsers {
    users {
      id
      name
      email
    }
  }
`;

// GraphQL Mutation
const ADD_USER = gql`
  mutation AddUser($name: String!, $email: String!) {
    addUser(name: $name, email: $email) {
      id
      name
      email
    }
  }
`;

function App() {
  const { loading, error, data } = useQuery(GET_USERS);
  const [addUser] = useMutation(ADD_USER, {
    refetchQueries: [{ query: GET_USERS }], // Refresh user list after mutation
  });

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");

  if (loading) return <p>Loading...</p>;
  if (error) return <p>Error: {error.message}</p>;

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!name || !email) return;
    await addUser({ variables: { name, email } });
    setName("");
    setEmail("");
  };

  return (
    <div>
      <h1>User List</h1>
      <ul>
        {data.users.map((user) => (
          <li key={user.id}>
            {user.name} - {user.email}
          </li>
        ))}
      </ul>

      <h2>Add New User</h2>
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
        <button type="submit">Add User</button>
      </form>
    </div>
  );
}

export default App;

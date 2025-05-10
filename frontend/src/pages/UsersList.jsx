import React, { useEffect, useState } from 'react';
import axios from '../api/axios';
import { getToken } from '../utils/auth';

function UsersList() {
  const [users, setUsers] = useState([]);
  const currentUserId = 'current-user-id-from-token-if-needed'; // optional

  useEffect(() => {
    axios.get('/users', {
      headers: { Authorization: `Bearer ${getToken()}` }
    })
    .then(res => setUsers(res.data))
    .catch(() => alert('Failed to load users'));
  }, []);

  const handleFollow = async (targetUserId) => {
    try {
      await axios.post(`/users/${currentUserId}/follow/${targetUserId}`, {}, {
        headers: { Authorization: `Bearer ${getToken()}` }
      });
      alert('Followed!');
    } catch (err) {
      alert('Failed to follow');
    }
  };

  return (
    <div>
      {users.map(user => (
        <div key={user.id}>
          {user.username} - {user.email}
          <button onClick={() => handleFollow(user.id)}>Follow</button>
        </div>
      ))}
    </div>
  );
}

export default UsersList;

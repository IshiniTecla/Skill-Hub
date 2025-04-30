import React, { useState, useEffect } from 'react';
import axios from 'axios';

const GroupMessagesList = ({ groupId }) => {
  const [messages, setMessages] = useState([]);

  useEffect(() => {
    const fetchMessages = async () => {
      const response = await axios.get(`/api/groupMessages/${groupId}`);
      setMessages(response.data);
    };
    fetchMessages();
  }, [groupId]);

  return (
    <div>
      {messages.map((msg) => (
        <div key={msg.id} className="message">
          <p>{msg.content}</p>
          {msg.mediaUrl && <img src={msg.mediaUrl} alt="media" />}
        </div>
      ))}
    </div>
  );
};

export default GroupMessagesList;

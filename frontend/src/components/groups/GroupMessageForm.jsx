import React, { useState } from 'react';
import axios from 'axios';
import MediaUpload from '../shared/MediaUpload'; // For uploading media

const GroupMessageForm = ({ groupId }) => {
  const [content, setContent] = useState('');
  const [file, setFile] = useState(null);

  const handleFileChange = (e) => {
    setFile(e.target.files[0]);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    let mediaUrl = null;
    if (file) {
      // Call MediaUpload component to handle file upload
      mediaUrl = await uploadToSupabase(file); // Implement uploadToSupabase
    }

    const messageData = {
      groupId,
      content,
      mediaUrl,
      userId: 'user123', // Replace with actual user ID
    };

    await axios.post('/api/groupMessages', messageData);

    setContent('');
    setFile(null);
  };

  return (
    <form onSubmit={handleSubmit}>
      <textarea
        value={content}
        onChange={(e) => setContent(e.target.value)}
        placeholder="Write your message"
      />
      <input type="file" onChange={handleFileChange} />
      <button type="submit">Send Message</button>
    </form>
  );
};

export default GroupMessageForm;

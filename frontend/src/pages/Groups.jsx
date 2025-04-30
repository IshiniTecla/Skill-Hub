import React from 'react';
import GroupMessageForm from '../components/groups/GroupMessageForm';
import GroupMessagesList from '../components/groups/GroupMessagesList';

const Groups = ({ groupId }) => {
  return (
    <div>
      <h2>Group Chat</h2>
      <GroupMessageForm groupId={groupId} />
      <GroupMessagesList groupId={groupId} />
    </div>
  );
};

export default Groups;

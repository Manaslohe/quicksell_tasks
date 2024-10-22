import { useState } from 'react';
import { FaEllipsisV } from 'react-icons/fa';
import myImage from '../Images/9439678.jpg'; 
import { useDrag, useDrop } from 'react-dnd';

const fetchedData = {
  tickets: [
    { id: 'CAM-1', title: 'Update User Profile Page UI', userId: 'usr-1', description: '...' },
    { id: 'CAM-2', title: 'Add Multi-Language Support', userId: 'usr-2', description: '...' },

  ],
  users: [
    { id: 'usr-1', name: 'Anoop Sharma', avatar: 'path/to/avatar1.jpg', available: false },
    { id: 'usr-2', name: 'Yogesh', avatar: 'path/to/avatar2.jpg', available: true },
    { id: 'usr-3', name: 'Shankar Kumar', avatar: 'path/to/avatar3.jpg', available: true },
    { id: 'usr-4', name: 'Ramesh', avatar: 'path/to/avatar4.jpg', available: true },
    { id: 'usr-5', name: 'Suresh', avatar: 'path/to/avatar5.jpg', available: true },
  ],
};


const userMap = fetchedData.users.reduce((map, user) => {
  map[user.id] = user;
  return map;
}, {});

const Ticket = ({ ticket }) => {
  const [, drag] = useDrag({
    type: 'TICKET',
    item: { id: ticket.id, status: ticket.status }
  });

  const {
    title = 'Untitled',
    id = 'CAM-0',
    userId = 'Unknown',
    priority = 0,
    type = 'Feature Request', 
  } = ticket;

  const user = userMap[userId] || {};
  const { name: userName = 'Unknown User', avatar: userAvatar } = user;
  const [showPriority, setShowPriority] = useState(false); 


  const togglePriority = () => {
    setShowPriority(!showPriority);
  };

  return (
    <div ref={drag} className="ticket">
      <div className="ticket-header">
        <p className="ticket-id">{id}</p>
        {userAvatar ? (
          <img
          src={myImage} 
          alt="Default avatar"
          className="user-avatar"
        />
        ) : (
          <img
            src={myImage}
            alt="Default avatar"
            className="user-avatar"
          />
        )}
      </div>
      <p className="title">
        {title}
      </p>
      <div className="ticket-meta">

        <div className="menu-icon" onClick={togglePriority}>
          <FaEllipsisV className='threedots' />
        </div>


        <div className="type-container">
          <span className="type-circle"></span>
          <span className="ticket-type">{type}</span>
        </div>
      </div>


      {showPriority && (
        <div className="priority-popup">
          <p className='prio'>Priority Level: {priority}</p>
        </div>
      )}
    </div>
  );
};

export default Ticket;

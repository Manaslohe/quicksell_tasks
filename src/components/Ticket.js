import { useState } from 'react';
import { FaEllipsisV } from 'react-icons/fa'; // Importing a three-dot icon
const fetchedData = {
    tickets: [
      { id: 'CAM-1', title: 'Update User Profile Page UI', userId: 'usr-1', description: '...' },
      { id: 'CAM-2', title: 'Add Multi-Language Support', userId: 'usr-2', description: '...' },
      // other tickets...
    ],
    users: [
      { id: 'usr-1', name: 'Anoop Sharma', avatar: 'path/to/avatar1.jpg', available: false },
      { id: 'usr-2', name: 'Yogesh', avatar: 'path/to/avatar2.jpg', available: true },
      { id: 'usr-3', name: 'Shankar Kumar', avatar: 'path/to/avatar3.jpg', available: true },
      { id: 'usr-4', name: 'Ramesh', avatar: 'path/to/avatar4.jpg', available: true },
      { id: 'usr-5', name: 'Suresh', avatar: 'path/to/avatar5.jpg', available: true },
    ],
  };
  
  // Create a mapping of users by their IDs
  const userMap = fetchedData.users.reduce((map, user) => {
    map[user.id] = user;
    return map;
  }, {});
  

  
  const Ticket = ({ ticket }) => {
    const {
      title = 'Untitled',
      description = 'No description available',
      id = 'CAM-0',
      userId = 'Unknown',
      priority = 0,
      type = 'Feature Request', // Default to 'Feature Request' if type is missing
    } = ticket;

  
    // Fetch user details based on userId
    const user = userMap[userId] || {}; // Default to an empty object if user not found
    const { name: userName = 'Unknown User', avatar: userAvatar } = user;
    const [showPriority, setShowPriority] = useState(false); // State to manage priority display

  const togglePriority = () => {
    setShowPriority(!showPriority); // Toggle the visibility of the priority level
  };
    return (
        <div className="ticket">
  <div className="ticket-header">
    <p className="ticket-id">{id}</p>
    {userAvatar && (
      <img
        src={userAvatar}
        alt={`${userName}'s avatar`}
        className="user-avatar"
      />
    )}
  </div>
  <h3>{title}</h3>
      <div className="ticket-meta">
        {/* Three-dot menu icon */}
        <div className="menu-icon" onClick={togglePriority}>
    <FaEllipsisV className='threedots'/>
</div>


        {/* Type or Tag Label with a circle */}
        <div className="type-container">
          <span className="type-circle"></span>
          <span className="ticket-type">{type}</span>
        </div>
      </div>

      {/* Conditional display of priority level */}
      {showPriority && (
        <div className="priority-popup">
          <p>Priority Level: {priority}</p>
        </div>
      )}
    </div>
  );
};

export default Ticket;
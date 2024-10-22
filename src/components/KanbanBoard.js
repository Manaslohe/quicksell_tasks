import { FaClipboardList, FaPlay, FaCheckCircle, FaTimesCircle } from 'react-icons/fa';
import React, { useState, useEffect } from 'react';
import Ticket from './Ticket';
import '../App.css';
import { FaFilter } from 'react-icons/fa';

const KanbanBoard = () => {
  const [tickets, setTickets] = useState([]);
  const [grouping, setGrouping] = useState('status');
  const [sorting, setSorting] = useState('priority');
  const [error, setError] = useState(null);
  const [isDropdownOpen, setDropdownOpen] = useState(false);

  useEffect(() => {
    fetch('https://api.quicksell.co/v1/internal/frontend-assignment')
      .then((response) => response.json())
      .then((data) => {
        console.log('Fetched Data:', data);
        if (Array.isArray(data)) {
          setTickets(data);
        } else if (data && data.tickets && Array.isArray(data.tickets)) {
          setTickets(data.tickets);
        } else {
          throw new Error('Data format is incorrect');
        }
      })
      .catch((error) => {
        setError('Error fetching data');
        console.error('Error fetching data:', error);
      });
  }, []);

  const handleGrouping = (e) => {
    setGrouping(e.target.value);
  };

  const handleSorting = (e) => {
    setSorting(e.target.value);
  };

  const toggleDropdown = () => {
    setDropdownOpen(!isDropdownOpen);
  };

  const sortedTickets = [...tickets].sort((a, b) => {
    if (sorting === 'priority') {
      return b.priority - a.priority;
    } else {
      return a.title.localeCompare(b.title);
    }
  });

  const groupedTickets = sortedTickets.reduce((groups, ticket) => {
    const key = ticket[grouping];
    if (!groups[key]) {
      groups[key] = [];
    }
    groups[key].push(ticket);
    return groups;
  }, {});

  const columns = [
    { name: "Backlog", icon: <FaClipboardList style={{ color: '#ffcc00' }} />, color: '#ffcc00' },
    { name: "Todo", icon: <FaPlay style={{ color: '#007bff' }} />, color: '#007bff' },
    { name: "In Progress", icon: <FaCheckCircle style={{ color: '#ffc107' }} />, color: '#ffc107' },
    { name: "Completed", icon: <FaCheckCircle style={{ color: '#28a745' }} />, color: '#28a745' },
    { name: "Canceled", icon: <FaTimesCircle style={{ color: '#dc3545' }} />, color: '#dc3545' }
  ];

  if (error) {
    return <div>{error}</div>;
  }

  return (
    <div className="kanban-container">
      {/* Navigation Bar */}
      <nav className="navbar">
        <div className="display-button">
          <button onClick={toggleDropdown}>
            <FaFilter className='filteri' /> Display
          </button>
          {isDropdownOpen && (
            <div className="dropdown">
              <label>
                Grouping:
                <select className='dropb' onChange={handleGrouping}>
                  <option value="status">Status</option>
                  <option value="user">User</option>
                  <option value="priority">Priority</option>
                </select>
              </label>
              <label>
                Ordering:
                <select className='dropb' onChange={handleSorting}>
                  <option value="priority">Priority</option>
                  <option value="title">Title</option>
                </select>
              </label>
            </div>
          )}
        </div>
      </nav>
      <div className="kanban-board">
  {columns.map((column) => (
    <div key={column.name} className="kanban-column">
      <div className="kanban-column-header">
        <h2 className="column-title">
          <span className="column-icon">{column.icon}</span>
          <span>{column.name}</span>
        </h2>
        <div className="column-actions">
          <button className="add-btn">+</button>
          <button className="menu-btn">⋮</button>
        </div>
      </div>
            {groupedTickets[column.name]?.map((ticket) => (
              <Ticket key={ticket.id} ticket={ticket} />
            )) || <p>No tickets</p>}
          </div>
        ))}
      </div>
    </div>
  );
};

export default KanbanBoard;

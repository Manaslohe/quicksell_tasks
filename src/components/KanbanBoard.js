import React, { useState, useEffect } from 'react';
import { DndProvider } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';
import { FaSlidersH, FaChevronDown } from 'react-icons/fa';
import Column from './Column';
import '../App.css';
import BacklogIcon from '../icons_FEtask/Backlog.svg';
import TodoIcon from '../icons_FEtask/To-do.svg';
import InProgressIcon from '../icons_FEtask/in-progress.svg';
import DoneIcon from '../icons_FEtask/Done.svg';
import CancelledIcon from '../icons_FEtask/Cancelled.svg';
import HighPriorityIcon from '../icons_FEtask/high.svg';
import MediumPriorityIcon from '../icons_FEtask/medium.svg';
import LowPriorityIcon from '../icons_FEtask/low.svg';
import NoPriorityIcon from '../icons_FEtask/No-priority.svg';
import UrgentPriorityIcon from '../icons_FEtask/urgent.svg';


const KanbanBoard = () => {
  const [tickets, setTickets] = useState([]);
  const [users, setUsers] = useState([]);
  const [grouping, setGrouping] = useState('status');
  const [sorting, setSorting] = useState('priority');
  const [error, setError] = useState(null);
  const [isDropdownOpen, setDropdownOpen] = useState(false);

  // Fetch tickets and users from API
  useEffect(() => {
    fetch('https://api.quicksell.co/v1/internal/frontend-assignment')
      .then((response) => response.json())
      .then((data) => {
        if (Array.isArray(data.tickets) && Array.isArray(data.users)) {
          setTickets(data.tickets);
          setUsers(data.users);
        } else {
          throw new Error('Data format is incorrect');
        }
      })
      .catch((error) => {
        setError('Error fetching data');
      });
  }, []);

  // Retrieve saved grouping and sorting preferences from localStorage on mount
  useEffect(() => {
    const savedGrouping = localStorage.getItem('grouping');
    const savedSorting = localStorage.getItem('sorting');
    if (savedGrouping) setGrouping(savedGrouping);
    if (savedSorting) setSorting(savedSorting);
  }, []);

  // Save grouping and sorting preferences to localStorage when they change
  useEffect(() => {
    localStorage.setItem('grouping', grouping);
    localStorage.setItem('sorting', sorting);
  }, [grouping, sorting]);

  // Map userId to userName for easy lookup
  const userMap = users.reduce((map, user) => {
    map[user.id] = user.name;
    return map;
  }, {});

  const statusMap = {
    backlog: 'Backlog',
    todo: 'Todo',
    'In progress': 'In Progress',
    done: 'Done',
    canceled: 'Canceled',
  };

  const priorityMap = {
    4: 'Urgent',
    3: 'High',
    2: 'Medium',
    1: 'Low',
    0: 'No Priority',
  };

  const requiredStatuses = ['Backlog', 'Todo', 'In Progress', 'Done', 'Canceled'];

  const sortedTickets = [...tickets].sort((a, b) => {
    if (sorting === 'priority') {
      return b.priority - a.priority;
    } else {
      return a.title.localeCompare(b.title);
    }
  });

  const groupedTickets = sortedTickets.reduce((groups, ticket) => {
    let key;
    if (grouping === 'status') {
      key = statusMap[ticket.status] || ticket.status;
    } else if (grouping === 'user') {
      key = userMap[ticket.userId] || 'Unassigned';
    } else if (grouping === 'priority') {
      key = priorityMap[ticket.priority] || 'No Priority';
    }

    if (!groups[key]) {
      groups[key] = [];
    }
    groups[key].push(ticket);
    return groups;
  }, {});

  function ensureStatuses(groupedTickets) {
    if (grouping !== 'status') {
      return groupedTickets;
    }

    requiredStatuses.forEach((status) => {
      if (!groupedTickets[status]) {
        groupedTickets[status] = [];
      }
    });
    return groupedTickets;
  }

  const columns = Object.keys(ensureStatuses(groupedTickets)).map((key) => ({
    name: key,
    tickets: groupedTickets[key],
  }));

  const handleDrop = (ticketId, newStatus) => {
    setTickets((prevTickets) =>
      prevTickets.map((ticket) =>
        ticket.id === ticketId ? { ...ticket, status: newStatus } : ticket
      )
    );
  };

  const getIconForColumn = (name) => {
    if (grouping === 'status') {
      switch (name) {
        case 'Backlog':
          return <img src={BacklogIcon} alt="Backlog Icon" className="column-icon" />;
        case 'Todo':
          return <img src={TodoIcon} alt="Todo Icon" className="column-icon" />;
        case 'In Progress':
          return <img src={InProgressIcon} alt="In Progress Icon" className="column-icon" />;
        case 'Done':
          return <img src={DoneIcon} alt="Done Icon" className="column-icon" />;
        case 'Canceled':
          return <img src={CancelledIcon} alt="Canceled Icon" className="column-icon" />;
        default:
          return null;
      }
    } else if (grouping === 'priority') {
      switch (name) {
        case 'Urgent':
          return <img src={UrgentPriorityIcon} alt="Urgent Priority Icon" className="column-icon" />;
        case 'High':
          return <img src={HighPriorityIcon} alt="High Priority Icon" className="column-icon" />;
        case 'Medium':
          return <img src={MediumPriorityIcon} alt="Medium Priority Icon" className="column-icon" />;
        case 'Low':
          return <img src={LowPriorityIcon} alt="Low Priority Icon" className="column-icon" />;
        case 'No Priority':
          return <img src={NoPriorityIcon} alt="No Priority Icon" className="column-icon" />;
        default:
          return null;
      }
    } else {
      return null;
    }
  };

  if (error) {
    return <div>{error}</div>;
  }

  return (
    <DndProvider backend={HTML5Backend}>
      <div className="kanban-container">
        <nav className="navbar">
          <div className="display-button">
            <button onClick={() => setDropdownOpen(!isDropdownOpen)}>
              <FaSlidersH className="filteri" /> Display{' '}
              <FaChevronDown className="dropdown-arrow" />
            </button>
            {isDropdownOpen && (
              <div className="dropdown">
                <label>
                  Grouping:
                  <select
                    className="dropb"
                    onChange={(e) => setGrouping(e.target.value)}
                    value={grouping}
                  >
                    <option value="status">Status</option>
                    <option value="user">User</option>
                    <option value="priority">Priority</option>
                  </select>
                </label>
                <label>
                  Ordering:
                  <select
                    className="dropb"
                    onChange={(e) => setSorting(e.target.value)}
                    value={sorting}
                  >
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
                {getIconForColumn(column.name)}
                <h2>{column.name}</h2>
              </div>
              <Column
                column={column}
                tickets={column.tickets}
                onDrop={handleDrop}
              />
            </div>
          ))}
        </div>
      </div>
    </DndProvider>
  );
};

export default KanbanBoard;

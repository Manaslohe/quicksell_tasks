import React, { useState, useEffect } from 'react';
import { DndProvider } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';
import { FaSlidersH, FaChevronDown } from 'react-icons/fa';
import Column from './Column';
import '../App.css';

const KanbanBoard = () => {
  const [tickets, setTickets] = useState([]);
  const [users, setUsers] = useState([]);
  const [grouping, setGrouping] = useState('status');
  const [sorting, setSorting] = useState('priority');
  const [error, setError] = useState(null);
  const [isDropdownOpen, setDropdownOpen] = useState(false);

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

  useEffect(() => {
    const savedGrouping = localStorage.getItem('grouping');
    const savedSorting = localStorage.getItem('sorting');
    if (savedGrouping) setGrouping(savedGrouping);
    if (savedSorting) setSorting(savedSorting);
  }, []);

  useEffect(() => {
    localStorage.setItem('grouping', grouping);
    localStorage.setItem('sorting', sorting);
  }, [grouping, sorting]);

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
            <Column
              key={column.name}
              column={column}
              tickets={column.tickets}
              onDrop={handleDrop}
              grouping={grouping}
            />
          ))}
        </div>
      </div>
    </DndProvider>
  );
};

export default KanbanBoard;

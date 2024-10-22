import React from 'react';
import { useDrop } from 'react-dnd';
import Ticket from './Ticket'; 

const Column = ({ column, tickets, onDrop }) => {
  // Set up the column as a drop target
  const [, drop] = useDrop({
    accept: 'TICKET',
    drop: (item) => onDrop(item.id, column.name), // Trigger onDrop when a ticket is dropped
  });

  return (
    <div ref={drop} className="kanban-column">
      {/* Column Header */}
      <div className="kanban-column-header">
        <p className="column-title">
          <span className="column-icon">{column.icon}</span> {/* Optional icon for the column */}
          <span>{column.name}</span> {/* Column name */}
          <span className="ticket-count">({tickets.length})</span> {/* Number of tickets */}
        </p>

        <div className="column-actions">
          <button className="add-btn" onClick={() => console.log('Add ticket')}>+</button> {/* Placeholder for adding tickets */}
          <button className="menu-btn" onClick={() => console.log('Open menu')}>⋮</button> {/* Placeholder for menu actions */}
        </div>
      </div>

      {/* Tickets or empty notification */}
      <div className="kanban-column-body">
        {tickets.length ? (
          tickets.map((ticket) => (
            <Ticket key={ticket.id} ticket={ticket} />  // Render each ticket in the column
          ))
        ) : (
          <p className="noti">No tickets</p>  // Show this if there are no tickets
        )}
      </div>
    </div>
  );
};

export default Column;

import React from 'react';
import { useDrop } from 'react-dnd';
import Ticket from './Ticket';
import { ReactComponent as TodoIcon } from '../icons_FEtask/To-do.svg';
import { ReactComponent as InProgressIcon } from '../icons_FEtask/in-progress.svg';
import { ReactComponent as DoneIcon } from '../icons_FEtask/Done.svg';
import { ReactComponent as CancelledIcon } from '../icons_FEtask/Cancelled.svg';
import { ReactComponent as BacklogIcon } from '../icons_FEtask/Backlog.svg';
import { ReactComponent as HighPriorityIcon } from '../icons_FEtask/high.svg';
import { ReactComponent as MediumPriorityIcon } from '../icons_FEtask/medium.svg';
import { ReactComponent as LowPriorityIcon } from '../icons_FEtask/low.svg';
import { ReactComponent as NoPriorityIcon } from '../icons_FEtask/No-priority.svg';
import { ReactComponent as UrgentPriorityIcon } from '../icons_FEtask/urgent.svg';
import myImage from '../Images/9439678.jpg'; 

const Column = ({ column, tickets, onDrop, grouping }) => {

  const [, drop] = useDrop({
    accept: 'TICKET',
    drop: (item) => {
      console.log('Item dropped:', item);
      onDrop(item.id, column.name);
    },
  });

  console.log('Column name:', column.name);
  console.log('Grouping:', grouping);

  const getIconForColumn = (name) => {
    console.log('Getting icon for column:', name, 'with grouping:', grouping); 

    if (grouping === 'status') {
      switch (name) {
        case 'Backlog':
          return <BacklogIcon />;
        case 'Todo':
          return <TodoIcon />;
        case 'In Progress':
          return <InProgressIcon />;
        case 'Done':
          return <DoneIcon />;
        case 'Canceled':
          return <CancelledIcon />;
        default:
          console.log('No icon found for status:', name);
          return null;
      }
    } else if (grouping === 'priority') {
      switch (name) {
        case 'Urgent':
          return <UrgentPriorityIcon />;
        case 'High':
          return <HighPriorityIcon />;
        case 'Medium':
          return <MediumPriorityIcon />;
        case 'Low':
          return <LowPriorityIcon />;
        case 'No Priority':
          return <NoPriorityIcon />;
        default:
          console.log('No icon found for priority:', name);
          return null;
      }
    } else {
      console.log('Invalid grouping:', grouping);
      return null;
    }
  };

  const iconElement = getIconForColumn(column.name); 
  console.log('iconElement:', iconElement); 

  return (
    <div ref={drop} className="kanban-column">

      <div className="kanban-column-header">
      <p className="column-title">
  {iconElement ? (
    <span className="column-icon">{iconElement}</span> 
  ) : (
    <img
      src={myImage} 
      alt="Default avatar" 
      className="user-avatar" 
    />
  )}
  <span>{column.name}</span> 
  <span className="ticket-count">({tickets.length})</span> 
</p>


        <div className="column-actions">
          <button className="add-btn" onClick={() => console.log('Add ticket')}>+</button>
          <button className="menu-btn" onClick={() => console.log('Open menu')}>⋮</button>
        </div>
      </div>

      <div className="kanban-column-body">
        {tickets.length ? (
          tickets.map((ticket) => (
            <Ticket key={ticket.id} ticket={ticket} />
          ))
        ) : (
          <p className="noti">No tickets</p>
        )}
      </div>
    </div>
  );
};

export default Column;

/* workshops/src/app/payment/components/TicketDetails.tsx */
import React from 'react';
import TicketCard from './TicketCard';

interface TicketDetailsProps {
  onBack: () => void;
  numberOfStudents: number;
}

const TicketDetails: React.FC<TicketDetailsProps> = ({ numberOfStudents }) => {
  return (
    <TicketCard numberOfStudents={numberOfStudents} />
  );
};

export default TicketDetails;

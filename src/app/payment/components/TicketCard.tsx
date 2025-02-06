import React, { useState, useRef } from 'react';
import { useSwipeable } from 'react-swipeable';
import { FaWhatsapp } from 'react-icons/fa';
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';
import Image from 'next/image';
import { useTicketData } from '@/app/payment/hooks/useTicketData';
import { format, isValid } from 'date-fns';

interface TicketCardProps {
  numberOfStudents: number;
}

const TicketCardWithActions: React.FC<TicketCardProps> = () => {
  const { ticketData, isLoading, error } = useTicketData();
  const [currentIndex, setCurrentIndex] = useState(0);
  const ticketRef = useRef<HTMLDivElement>(null);
  const handlers = useSwipeable({
    onSwipedLeft: () => setCurrentIndex((prevIndex) => (prevIndex + 1) % ticketData.length),
    onSwipedRight: () => setCurrentIndex((prevIndex) => (prevIndex - 1 + ticketData.length) % ticketData.length),
    trackMouse: true,
  });

  if (isLoading) {
    return <div>Loading tickets...</div>;
  }

  if (error) {
    return <div>Error loading tickets: {error}</div>;
  }

  if (!ticketData.length) {
    return <div>No tickets found</div>;
  }

  const currentTicket = ticketData[currentIndex] || {};

  // Calculate per child amount
  const totalAmount = parseInt(currentTicket.price.replace(/[^0-9]/g, ''));
  const perChildAmount = Math.floor(totalAmount / ticketData.length);

  const generatePDF = async () => {
    const pdf = new jsPDF('p', 'mm', 'a4');

    for (let i = 0; i < ticketData.length; i++) {
      setCurrentIndex(i);
      await new Promise((resolve) => setTimeout(resolve, 300));

      if (ticketRef.current) {
        const canvas = await html2canvas(ticketRef.current, {
          scale: 2,
          useCORS: true,
          backgroundColor: null,
        });

        const imgData = canvas.toDataURL('image/png');
        const imgWidth = 210;
        const imgHeight = (canvas.height * imgWidth) / canvas.width;

        pdf.addImage(imgData, 'PNG', 0, 0, imgWidth, imgHeight);

        if (i < ticketData.length - 1) {
          pdf.addPage();
        }
      }
    }

    pdf.save('GeniusLabs Workshop Ticket.pdf');
  };

  const handleSharePDF = async () => {
    try {
      const pdf = new jsPDF('p', 'mm', 'a4');

      for (let i = 0; i < ticketData.length; i++) {
        setCurrentIndex(i);
        await new Promise((resolve) => setTimeout(resolve, 300));

        if (ticketRef.current) {
          const canvas = await html2canvas(ticketRef.current, {
            scale: 2,
            useCORS: true,
            backgroundColor: null,
          });

          const imgData = canvas.toDataURL('image/png');
          const imgWidth = 210;
          const imgHeight = (canvas.height * imgWidth) / canvas.width;

          pdf.addImage(imgData, 'PNG', 0, 0, imgWidth, imgHeight);

          if (i < ticketData.length - 1) {
            pdf.addPage();
          }
        }
      }

      const pdfBlob = pdf.output('blob');
      const pdfFile = new File([pdfBlob], 'GeniusLabs Workshop Ticket.pdf', { type: 'application/pdf' });

      if (navigator.share && navigator.canShare({ files: [pdfFile] })) {
        await navigator.share({
          files: [pdfFile],
          title: 'Workshop Tickets',
          text: `Here is link to the Lego-In-Action workshop I've booked, themed "${currentTicket.workshopTitle}" The plan is set for ${currentTicket.date} at ${currentTicket.location}. See if you can join me`,
        });
      } else {
        const pdfUrl = URL.createObjectURL(pdfBlob);

        window.open(`https://web.whatsapp.com/send?text=${encodeURIComponent(`Here is link to the Lego-In-Action workshop I've booked, themed "${currentTicket.workshopTitle}" The plan is set for ${currentTicket.date} at ${currentTicket.location}. See if you can join me`)}&attachment=${encodeURIComponent(pdfUrl)}`);

        setTimeout(() => URL.revokeObjectURL(pdfUrl), 60000);
      }
    } catch (error) {
      console.error('Error while sharing PDF:', error);
      alert('An error occurred while sharing the PDF.');
    }
  };

  return (
    <div className="w-full min-h-screen bg-gray-50 flex flex-col items-center mt-4">
      <div className="relative w-full overflow-hidden" {...handlers}>
        <div className="flex transition-transform duration-300" style={{ transform: `translateX(-${currentIndex * 100}%)` }}>
          {ticketData.map((ticket, index) => (
            <div key={index} className="flex-shrink-0 w-full flex justify-center">
              <div
                ref={ticketRef}
                className="w-[350px] h-[553px] bg-white bg-cover bg-center bg-no-repeat rounded-lg p-6 text-white relative"
                style={{
                  backgroundImage: "url('/ticket/ticketBG.png')",
                  backgroundColor: '#ffffff',
                }}
              >
                <div className="flex flex-col items-center">
                  <p className="text-xs font-medium font-montserrat text-center mb-4">
                    Transacted At: {ticket.transactionDate}
                  </p>

                  <div className="flex flex-col w-full gap-2 mt-8 ml-2 mb-4">
                    {ticket.paymentMode === 'Pay at Centre' ? (
                      <p className="text-sm font-medium font-montserrat text-left">
                        Receipt Number: {ticket.receiptNumber || 'Pending'}
                      </p>
                    ) : (
                      <p className="text-sm font-medium font-montserrat text-left">
                        Transaction ID: {ticket.transactionId}
                      </p>
                    )}
                  </div>

                  <h1 className="text-2xl font-bold text-[#FFD39F] text-center mt-2 mb-2">
                    {ticket.workshopTitle}
                  </h1>

                  <h2 className="text-3xl font-bold mb-2">
                    {ticket.studentName}
                  </h2>

                  <p className="text-sm font-medium font-montserrat mb-6">
                    Age :- {ticket.age}
                  </p>

                  <div className="bg-[#09A5E826] rounded-2xl mt-2 pb-6 pt-4 px-6 w-[270px] mb-6">
                    <h3 className="text-[15px] font-bold text-[#FFD39F] mb-3 text-center">
                      WORKSHOP DETAILS
                    </h3>

                    <div className="flex items-center mb-3">
                      <Image src="/ticket/location.svg" width={20} height={20} alt="location" className="w-5 h-5 mr-2" />
                      <span className="text-xs font-semibold">{ticket.location}</span>
                    </div>

                    <div className="flex items-center mb-3">
                      <Image src="/ticket/date.svg" width={20} height={20} alt="date" className="w-4 h-4 mr-2" />
                      <span className="text-xs font-semibold">
                        {isValid(new Date(ticket.date)) ? format(new Date(ticket.date), 'dd MMM yyyy') : ticket.date}
                      </span>
                    </div>

                    <div className="flex items-center">
                      <Image src="/ticket/time.svg" width={20} height={20} alt="time" className="w-5 h-5 mr-2" />
                      <span className="text-xs font-semibold">{ticket.time}</span>
                    </div>
                  </div>

                  <div className="text-left w-full px-6 mb-4 flex space-x-4">
                    <p className="text-base font-medium">₹{perChildAmount}</p>
                    <p className="text-base font-medium">
                      {ticket.paymentMode === 'Pay at Centre' ? 'Pay at Centre' : 'Paid'}
                    </p>
                  </div>

                  <div className="flex space-x-2 mt-6">
                    <span className="text-sm font-bold">LEGO IN ACTION</span>
                    <span className="text-sm font-bold">{`${index + 1}/${ticketData.length}`}</span>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
      <div className="flex justify-center mt-4">
        {ticketData.map((_, index) => (
          <div
            key={index}
            className={`w-2 h-2 rounded-full mx-1 ${currentIndex === index ? 'bg-blue-500' : 'bg-gray-300'}`}
          />
        ))}
      </div>
      <div className="mt-4 flex flex-col items-center gap-4">
        <div className="flex justify-center gap-4">
          <button
            onClick={generatePDF}
            className="w-[330px] h-[52px] rounded-lg bg-blue-500 flex items-center justify-center"
          >
            <span className="font-nunito font-bold text-[14px] leading-4 text-white">
              Save your Tickets
            </span>
          </button>
        </div>
        <button
          onClick={handleSharePDF}
          className="w-full max-w-md h-[52px] rounded-lg bg-green-600 flex items-center justify-center gap-2"
        >
          <span className="font-nunito font-bold text-[14px] leading-4 text-white">
            Share Tickets
          </span>
          <FaWhatsapp className="text-white" />
        </button>
      </div>
    </div>
  );
};

export default TicketCardWithActions;

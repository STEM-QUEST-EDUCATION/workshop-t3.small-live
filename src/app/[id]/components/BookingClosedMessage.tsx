"use client";

export default function BookingClosedMessage() {
  return (
    <div className="p-4 bg-red-50 border border-red-200 rounded-lg">
      <p className="text-red-600 text-sm text-center">
        Booking for this workshop is currently closed. Please check back later for new dates or call +91 9468074074.
      </p>
    </div>
  );
}

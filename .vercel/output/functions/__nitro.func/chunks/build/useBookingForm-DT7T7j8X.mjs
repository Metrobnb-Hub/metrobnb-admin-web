import { u as useApi } from './api-BDnKztVE.mjs';

const useBookingForm = () => {
  const { createBooking } = useApi();
  const handleSubmit = async (booking) => {
    const bookingData = {
      guest_name: booking.guestName,
      booking_date: booking.bookingDate,
      start_date: booking.startDate,
      end_date: booking.endDate,
      base_amount: booking.amount,
      addons: booking.addons,
      unit_id: booking.unitId,
      partner_id: booking.partner,
      payment_status: booking.paymentStatus,
      booking_status: booking.bookingStatus,
      amount_paid: booking.amountPaid,
      payment_method_id: booking.paymentMethod,
      payment_received_by: booking.paymentReceivedBy,
      payout_date: booking.payoutDate || null,
      booking_source_id: booking.bookingSourceId,
      notes: booking.notes
    };
    await createBooking(bookingData);
  };
  return {
    handleSubmit
  };
};

export { useBookingForm as u };
//# sourceMappingURL=useBookingForm-DT7T7j8X.mjs.map

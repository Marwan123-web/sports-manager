"use client";

import { Booking } from "@/types/api";
import { useTranslations } from "next-intl";
import { StatusBadge } from "../StatusBadge";

interface BookingCardProps {
  booking: Booking;
  onCancel: (booking: Booking) => void;
  bookingsLoading: boolean;
  isFutureBooking: (booking: Booking) => boolean;
}

export default function BookingCard({
  booking,
  onCancel,
  bookingsLoading,
  isFutureBooking,
}: BookingCardProps) {
  const t = useTranslations("profile");

  return (
    <div className="border p-4 rounded-lg hover:shadow-md flex flex-col justify-between">
      <h3 className="font-bold text-lg text-gray-900 mb-2">
        {booking.field.name} - {booking.field.sport}
      </h3>
      <p className="text-sm text-gray-500 mb-1">
        📅 {booking.date} | ⏰ {booking.startTime} - {booking.endTime}
      </p>
      <p className="text-lg font-semibold text-green-600 mb-2">
        €{booking.totalPrice}
      </p>
      <StatusBadge
        status={
          isFutureBooking(booking)
            ? booking.isActive
              ? "active"
              : "cancelled"
            : "past"
        }
        className="max-w-fit"
      />
      {isFutureBooking(booking) && booking.isActive && (
        <button
          onClick={() => onCancel(booking)}
          disabled={bookingsLoading}
          className="mt-4 w-full bg-red-500 text-white py-2 px-4 rounded-lg hover:bg-red-600 disabled:opacity-50"
        >
          {t("cancelBooking")}
        </button>
      )}
    </div>
  );
}

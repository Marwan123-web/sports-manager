"use client";
import { useState, useEffect } from "react";
import Link from "next/link";
import type { User, Tournament, Booking } from "@/types/api";
import { LoadingSpinner } from "@/components/LoadingSpinner";
import { ErrorBanner } from "@/components/ErrorBanner";
import { CreateEditModal } from "@/components/CreateEditModal";
import { FormInput } from "@/components/FormInput";
import {
  authApi,
  tournamentApi,
  bookingsApi,
  getErrorMessage,
} from "@/lib/api";
import { useTranslations } from "next-intl";

import TournamentCard from "@/components/tournament/TournamentCard";
import BookingCard from "@/components/booking/BookingCard";

export default function ProfilePage() {
  const t = useTranslations("profile");

  const [user, setUser] = useState<User | null>(null);
  const [tournaments, setTournaments] = useState<Tournament[]>([]);
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [loading, setLoading] = useState(true);
  const [bookingsLoading, setBookingsLoading] = useState(false);
  const [error, setError] = useState("");
  const [showEditModal, setShowEditModal] = useState(false);
  const [updating, setUpdating] = useState(false);
  const [formData, setFormData] = useState({ username: "", email: "" });
  const fetchProfile = async () => {
    setLoading(true);
    setError("");

    try {
      const [userData, userTournaments, myBookings] = await Promise.all([
        authApi.whoami(),
        tournamentApi.getMyTournaments({}),
        bookingsApi.getMyBookings(),
      ]);

      setUser(userData);
      setFormData({
        username: userData.username || "",
        email: userData.email || "",
      });
      setTournaments(
        userTournaments.filter((t) => t.creator.id === userData.id)
      );
      setBookings(myBookings);
    } catch (error: unknown) {
      setError(getErrorMessage(error));
    } finally {
      setLoading(false);
    }
  };

  const isFutureBooking = (booking: Booking) => {
    // booking.date is "YYYY-MM-DD"
    const bookingDate = new Date(booking.date);
    const today = new Date();

    // Normalize to date-only (ignore time)
    bookingDate.setHours(0, 0, 0, 0);
    today.setHours(0, 0, 0, 0);

    return bookingDate >= today; // today or future
  };

  useEffect(() => {
    fetchProfile();
  }, []);

  const handleUpdateProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    setUpdating(true);
    setError("");

    try {
      await authApi.updateProfile(formData);
      setShowEditModal(false);
      await fetchProfile();
    } catch (error: unknown) {
      setError(getErrorMessage(error));
    } finally {
      setUpdating(false);
    }
  };

  const handleCancelBooking = async (booking: Booking) => {
    const fieldId = booking.field.id;
    const id = booking.id;

    if (!confirm(t("confirmCancelBooking"))) return;

    setBookingsLoading(true);
    try {
      await bookingsApi.cancelBooking(fieldId, id);
      setBookings((prev) => prev.filter((b) => b.id !== id));
    } catch (error: unknown) {
      setError(getErrorMessage(error));
    } finally {
      setBookingsLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <LoadingSpinner size="xl" message={t("loading")} />
      </div>
    );
  }

  if (!user) {
    return (
      <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto text-center">
          <p className="text-xl text-gray-500">{t("notFound")}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto space-y-12">
        {/* Profile Header */}
        <div className="text-center">
          <div className="w-32 h-32 bg-gradient-to-r from-indigo-500 to-purple-600 rounded-full mx-auto mb-6 flex items-center justify-center shadow-2xl">
            <span className="text-4xl font-bold text-white">👤</span>
          </div>
          <h1 className="text-4xl font-bold text-gray-900 mb-2">
            {user.username || user.email}
          </h1>
          <p className="text-xl text-gray-500">{t("memberSince")}</p>
        </div>

        {/* Profile Card */}
        <div className="bg-white border border-gray-200 rounded-xl shadow-sm p-8">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-bold text-gray-900">
              {t("settingsTitle")}
            </h2>
            <button
              onClick={() => setShowEditModal(true)}
              disabled={updating}
              className="px-6 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 font-medium disabled:opacity-50 transition-colors"
            >
              {updating ? t("updating") : t("editProfile")}
            </button>
          </div>

          {!showEditModal && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  {t("username")}
                </label>
                <p className="text-lg font-semibold text-gray-900">
                  {user.username || t("notSet")}
                </p>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  {t("email")}
                </label>
                <p className="text-lg font-semibold text-gray-900">
                  {user.email}
                </p>
              </div>
            </div>
          )}
        </div>

        {/* My Tournaments */}
        <div className="bg-white border border-gray-200 rounded-xl shadow-sm p-8">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-bold text-gray-900">
              {t("tournamentsTitle", { count: tournaments.length })}
            </h2>
            <Link
              href="/tournaments"
              className="bg-indigo-600 text-white px-6 py-2 rounded-lg hover:bg-indigo-700"
            >
              {t("createTournament")}
            </Link>
          </div>

          {tournaments.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-gray-500 text-lg mb-4">{t("noTournaments")}</p>
              <Link
                href="/tournaments"
                className="inline-block bg-indigo-600 text-white px-6 py-2 rounded-lg hover:bg-indigo-700"
              >
                {t("createFirst")}
              </Link>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {tournaments.map((tournament) => (
                <TournamentCard
                  key={tournament.id}
                  tournament={tournament}
                  currentUserId={user?.id}
                  onUpdate={async (updatedForm) => {
                    setTournaments((prev) =>
                      prev.map((t) =>
                        t.id === tournament.id ? { ...t, ...updatedForm } : t
                      )
                    );
                  }}
                  onDelete={async (tournamentId) => {
                    setTournaments((prev) =>
                      prev.filter((t) => t.id !== tournamentId)
                    );
                  }}
                />
              ))}
            </div>
          )}
        </div>

        {/* My Bookings */}
        <div className="bg-white border border-gray-200 rounded-xl shadow-sm p-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">
            {t("myBookingsTitle", { count: bookings.length })}
            {bookingsLoading && <LoadingSpinner size="sm" />}
          </h2>

          {bookings.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-gray-500 text-lg mb-4">{t("noBookings")}</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {bookings.map((booking) => (
                <BookingCard
                  key={booking.id}
                  booking={booking}
                  onCancel={handleCancelBooking}
                  bookingsLoading={bookingsLoading}
                  isFutureBooking={isFutureBooking}
                />
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Edit Profile Modal */}
      {showEditModal && (
        <CreateEditModal
          isOpen={showEditModal}
          onClose={() => setShowEditModal(false)}
          title={t("editModal.title")}
          onSubmit={handleUpdateProfile}
          updating={updating}
          submitText={t("saveChanges")}
        >
          <ErrorBanner error={error} onClear={() => setError("")} />

          <FormInput
            label={t("username")}
            id="username"
            value={formData.username}
            onChange={(e) =>
              setFormData({ ...formData, username: e.target.value })
            }
            disabled={updating}
          />

          <FormInput
            label={t("email")}
            id="email"
            type="email"
            value={formData.email}
            onChange={(e) =>
              setFormData({ ...formData, email: e.target.value })
            }
            required
            disabled={updating}
          />
        </CreateEditModal>
      )}
    </div>
  );
}

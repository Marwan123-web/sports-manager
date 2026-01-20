"use client";

import { PropsWithChildren, useState } from "react";
import { useRouter } from "next/navigation";
import { Tournament } from "@/types/api"; // Adjust Sport import path as needed
import { useTranslations } from "next-intl";
import { StatusBadge } from "../StatusBadge";
import { Edit, Trash2 } from "lucide-react";
import { Sport } from "@/enums/enums";
import { CreateEditModal } from "../CreateEditModal";
import { ErrorBanner } from "../ErrorBanner";
import { FormInput } from "../FormInput";
import { Select } from "../Select";
import { getErrorMessage, tournamentApi } from "@/lib/api";

interface TournamentCardProps extends PropsWithChildren {
  tournament: Tournament;
  onViewDetails?: () => void;
  onUpdate?: (updatedTournament: Tournament) => Promise<void>;
  currentUserId?: number | string;
  onDelete?: (tournamentId: string) => Promise<void>;
}

export default function TournamentCard({
  tournament,
  onViewDetails,
  onUpdate,
  currentUserId,
  onDelete,
  ...props
}: TournamentCardProps) {
  const t = useTranslations("tournaments.list");
  const router = useRouter();

  // Modal state
  const [showTournamentModal, setShowTournamentModal] = useState(false);
  const [editingTournament, setEditingTournament] = useState<Tournament | null>(
    null
  );
  const [tournamentForm, setTournamentForm] = useState({
    name: "",
    sport: Sport.FOOTBALL,
    startDate: "",
    endDate: "",
    maxTeams: 0,
  });
  const [savingTournament, setSavingTournament] = useState(false);
  const [error, setError] = useState("");

  const handleViewDetails = () => {
    onViewDetails?.();
    router.push(`/tournaments/${tournament.id}`);
  };

  const handleEdit = (e: React.MouseEvent) => {
    e.stopPropagation();
    setEditingTournament(tournament);
    setTournamentForm({
      name: tournament.name,
      sport: tournament.sport,
      startDate: new Date(tournament.startDate).toISOString().split("T")[0],
      endDate: new Date(tournament.endDate).toISOString().split("T")[0],
      maxTeams: tournament.maxTeams,
    });
    setShowTournamentModal(true);
    setError("");
  };

  const handleDelete = async (id: string) => {
    if (!confirm(t("confirmDeleteTournament"))) return;

    try {
      await tournamentApi.deleteTournament(id); // Add await
      onDelete?.(id);
    } catch (error: unknown) {
      setError(getErrorMessage(error));
    }
  };

  const handleSaveTournament = async (e: React.FormEvent) => {
    e.preventDefault();
    setSavingTournament(true);
    setError("");
    try {
      const response = await tournamentApi.updateTournament(
        tournament.id,
        tournamentForm
      );

      // Notify parent (handles list refresh)
      await onUpdate?.(response);

      // Close modal
      setShowTournamentModal(false);
      setEditingTournament(null);
      setTournamentForm({
        name: "",
        sport: Sport.FOOTBALL,
        startDate: "",
        endDate: "",
        maxTeams: 0,
      });
    } catch (error: unknown) {
      setError(getErrorMessage(error));
    } finally {
      setSavingTournament(false);
    }
  };

  const handleCloseModal = () => {
    setShowTournamentModal(false);
    setEditingTournament(null);
    setTournamentForm({
      name: "",
      sport: Sport.FOOTBALL,
      startDate: "",
      endDate: "",
      maxTeams: 0,
    });
    setError("");
  };

  const startDate = new Date(tournament.startDate).toLocaleDateString();
  const progress = Math.round(
    (tournament.currentTeams / tournament.maxTeams) * 100
  );

  return (
    <>
      <div
        {...props}
        className="bg-white border border-gray-200 rounded-xl shadow-sm hover:shadow-md p-8 relative z-0"
      >
        <div className="mb-6">
          <div className="flex items-center justify-between gap-4 mb-6">
            <h3 className="text-2xl font-bold text-gray-900 mb-3 line-clamp-2 leading-tight">
              {tournament.name}
            </h3>
            <StatusBadge status={tournament.status} />
          </div>

          <div className="space-y-3 text-sm">
            <div className="flex items-center gap-2 text-gray-700 font-medium">
              <span className="w-4 h-4 bg-indigo-500 rounded-full"></span>
              {t("starts", { date: startDate })}
            </div>

            <div className="flex items-center justify-between p-3 bg-indigo-50 rounded-lg border border-indigo-100">
              <span className="font-semibold text-gray-900">
                {tournament.currentTeams}/{tournament.maxTeams} {t("teams")}
              </span>
              <span className="text-sm font-medium text-indigo-700 bg-indigo-100 px-2 py-1 rounded-md">
                {progress}%
              </span>
            </div>
          </div>
        </div>

        <div className="flex gap-2 mt-4">
          <button
            onClick={handleViewDetails}
            className="flex-1 bg-indigo-600 hover:bg-indigo-700 text-white py-3 px-6 rounded-xl text-sm font-semibold shadow-sm border border-transparent focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
          >
            {t("viewDetails")}
          </button>

          {currentUserId === tournament.creator.id && (
            <>
              <button
                onClick={handleEdit}
                className="p-3 bg-blue-100 hover:bg-blue-200 text-blue-700 rounded-xl hover:shadow-sm transition-all"
                title={t("edit")}
              >
                <Edit className="w-5 h-5" />
              </button>
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  handleDelete(tournament.id!);
                }}
                className="p-3 bg-red-100 hover:bg-red-200 text-red-700 rounded-xl hover:shadow-sm transition-all"
                title={t("delete")}
              >
                <Trash2 className="w-5 h-5" />
              </button>
            </>
          )}
        </div>
      </div>

      {/* Tournament Edit Modal - unchanged */}
      {showTournamentModal && (
        <CreateEditModal
          isOpen={showTournamentModal}
          onClose={handleCloseModal}
          title={
            editingTournament ? t("editTournament") : t("createTournament")
          }
          onSubmit={handleSaveTournament}
          updating={savingTournament}
          submitText={editingTournament ? t("updateButton") : t("createButton")}
        >
          <ErrorBanner error={error} onClear={() => setError("")} />

          <FormInput
            label={t("modal.name")}
            id="tournament-name"
            value={tournamentForm.name}
            onChange={(e) =>
              setTournamentForm({ ...tournamentForm, name: e.target.value })
            }
            required
            disabled={savingTournament}
          />

          <Select
            label={t("modal.sport")}
            id="tournament-sport"
            value={tournamentForm.sport}
            onChange={(e) =>
              setTournamentForm({
                ...tournamentForm,
                sport: e.target.value as Sport,
              })
            }
            options={[
              { value: Sport.FOOTBALL, label: t("sports.football") },
              { value: Sport.VOLLEYBALL, label: t("sports.volleyball") },
              { value: Sport.BASKETBALL, label: t("sports.basketball") },
            ]}
            disabled={savingTournament}
          />

          <div className="grid grid-cols-2 gap-4">
            <FormInput
              label={t("modal.startDate")}
              id="start-date"
              type="date"
              value={tournamentForm.startDate}
              onChange={(e) =>
                setTournamentForm({
                  ...tournamentForm,
                  startDate: e.target.value,
                })
              }
              required
              disabled={savingTournament}
            />
            <FormInput
              label={t("modal.endDate")}
              id="end-date"
              type="date"
              value={tournamentForm.endDate}
              onChange={(e) =>
                setTournamentForm({
                  ...tournamentForm,
                  endDate: e.target.value,
                })
              }
              required
              disabled={savingTournament}
            />
          </div>

          <FormInput
            label={t("modal.maxTeams")}
            id="max-teams"
            type="number"
            value={tournamentForm.maxTeams}
            onChange={(e) =>
              setTournamentForm({
                ...tournamentForm,
                maxTeams: parseInt(e.target.value) || 0,
              })
            }
            min={2}
            max={128}
            required
            disabled={savingTournament}
          />
        </CreateEditModal>
      )}
    </>
  );
}

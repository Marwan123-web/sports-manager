// components/MatchCard.tsx
"use client";
import { Match } from "@/types/api";
import { MatchStatus } from "@/enums/enums";
import { StatusBadge } from "@/components/StatusBadge";
import { useTranslations } from "next-intl";

interface MatchCardProps {
  match: Match;
  onSetResult?: (match: Match) => void;
  currentUserId?: number | string;
  updating?: boolean;
  className?: string;
}

export function MatchCard({
  match,
  onSetResult,
  currentUserId,
  updating = false,
  className = "",
}: MatchCardProps) {
  const t = useTranslations("tournaments.matches");

  // Check if match time passed + 2 hours
  const now = new Date();
  const matchTime = new Date(match.scheduledAt);
  const twoHoursAfterMatch = new Date(matchTime.getTime() + 2 * 60 * 60 * 1000);
  const canSetResult = now >= twoHoursAfterMatch;

  return (
    <div
      className={`bg-white border border-gray-200 rounded-xl shadow-sm p-6 hover:shadow-md transition-shadow ${className}`}
    >
      <div className="flex items-center justify-between mb-4">
        <span className="px-3 py-1 rounded-full text-xs font-medium bg-gray-100 text-gray-800">
          {match.round}
        </span>
        <StatusBadge status={match.status as MatchStatus} />
      </div>

      <div className="space-y-4 mb-6">
        <div className="flex items-center justify-between">
          <span className="text-lg font-semibold text-gray-900">
            {match.team1.name}
          </span>
          <span className="text-2xl font-bold text-gray-900">
            {match.scoreTeam1 ?? "-"}
          </span>
        </div>
        <div className="flex items-center justify-center py-2">
          <div className="w-24 h-1 bg-gray-300 rounded-full relative">
            {match.scoreTeam1 !== null && match.scoreTeam2 !== null && (
              <div
                className="h-1 bg-indigo-600 rounded-full absolute left-0 top-0 transition-all duration-300"
                style={{
                  width: `${
                    (match.scoreTeam1! /
                      (match.scoreTeam1! + match.scoreTeam2!)) *
                    100
                  }%`,
                }}
              />
            )}
          </div>
        </div>
        <div className="flex items-center justify-between">
          <span className="text-lg font-semibold text-gray-900">
            {match.team2.name}
          </span>
          <span className="text-2xl font-bold text-gray-900">
            {match.scoreTeam2 ?? "-"}
          </span>
        </div>
      </div>

      <div className="text-center text-sm text-gray-500 mb-4">
        {new Date(match.scheduledAt).toLocaleString()}
      </div>

      {currentUserId === match.tournament.creator?.id &&
        match.status === MatchStatus.SCHEDULED &&
        canSetResult &&
        onSetResult && (
          <button
            onClick={() => onSetResult(match)}
            disabled={updating}
            className="w-full bg-yellow-600 text-white py-2 px-4 rounded-lg hover:bg-yellow-700 text-sm font-medium disabled:opacity-50"
          >
            {updating ? "Updating..." : t("setResult")}
          </button>
        )}
    </div>
  );
}

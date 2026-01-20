"use client";
import { useState, useEffect } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import { Match, Team } from "@/types/api";
import { MatchStatus } from "@/enums/enums";
import { LoadingSpinner } from "@/components/LoadingSpinner";
import { ErrorBanner } from "@/components/ErrorBanner";
import { CreateEditModal } from "@/components/CreateEditModal";
import { StatusBadge } from "@/components/StatusBadge";
import { FormInput } from "@/components/FormInput";
import { matchesApi, teamsApi, getErrorMessage } from "@/lib/api";
import { useTranslations } from "next-intl";
import { MatchCard } from "@/components/match/MatchCard";
import { useAuth } from "@/hooks/useAuth";

export default function TournamentMatchesPage() {
  const t = useTranslations("tournaments.matches");
  const params = useParams();
  const tournamentId = params.id as string;

  const [matches, setMatches] = useState<Match[]>([]);
  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState(false);
  const [error, setError] = useState("");
  const [editingMatch, setEditingMatch] = useState<Match | null>(null);
  const [scoreTeam1, setScoreTeam1] = useState(0);
  const [scoreTeam2, setScoreTeam2] = useState(0);
  const { user } = useAuth();

  useEffect(() => {
    if (tournamentId) {
      fetchTournamentMatches();
    }
  }, [tournamentId]);

  useEffect(() => {
    if (editingMatch) {
      setScoreTeam1(editingMatch.scoreTeam1 ?? 0);
      setScoreTeam2(editingMatch.scoreTeam2 ?? 0);
    } else {
      setScoreTeam1(0);
      setScoreTeam2(0);
    }
  }, [editingMatch]);

  const fetchTournamentMatches = async () => {
    try {
      setLoading(true);
      setError("");
      const data = await matchesApi.getTournamentMatches(tournamentId);
      setMatches(data);
    } catch (error: unknown) {
      setError(getErrorMessage(error));
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateScore = async (
    matchId: string,
    scoreTeam1: number,
    scoreTeam2: number
  ) => {
    setUpdating(true);
    setError("");

    try {
      await matchesApi.updateScore(matchId, { scoreTeam1, scoreTeam2 });
      setEditingMatch(null);
      await fetchTournamentMatches();
    } catch (error: unknown) {
      setError(getErrorMessage(error));
    } finally {
      setUpdating(false);
    }
  };

  if (loading) return <LoadingSpinner size="xl" message={t("loading")} />;

  return (
    <div className="p-8 max-w-7xl mx-auto space-y-8">
      <ErrorBanner error={error} onClear={() => setError("")} />

      <div className="flex justify-between items-center">
        <div>
          <Link
            href={`/tournaments/${tournamentId}`}
            className="text-indigo-600 hover:text-indigo-500 mb-2 inline-block"
          >
            ← {t("backToTournament")}
          </Link>
          <div>
            <h1 className="text-4xl font-bold text-gray-900">{t("title")}</h1>
            <p className="text-gray-500 text-lg">
              {t("tournament")}{" "}
              {matches?.length ? matches[0].tournament?.name : tournamentId}
            </p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {matches.map((match) => (
          <MatchCard
            key={match.id}
            match={match}
            onSetResult={setEditingMatch}
            updating={updating}
            currentUserId={user?.id}
          />
        ))}
      </div>

      {editingMatch && (
        <CreateEditModal
          isOpen={!!editingMatch}
          onClose={() => {
            setEditingMatch(null);
            setScoreTeam1(0);
            setScoreTeam2(0);
          }}
          title={`${editingMatch.team1.name} vs ${editingMatch.team2.name}`}
          onSubmit={async (e) => {
            e.preventDefault();
            await handleUpdateScore(editingMatch.id, scoreTeam1, scoreTeam2);
          }}
          updating={updating}
          submitText={t("saveResult")}
        >
          <ErrorBanner error={error} onClear={() => setError("")} />

          <div className="flex items-center justify-center space-x-8 mb-6">
            <div className="text-center">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                {editingMatch.team1.name}
              </label>
              <FormInput
                id="scoreTeam1"
                type="number"
                min={0}
                value={scoreTeam1}
                onChange={(e) => setScoreTeam1(+e.target.value || 0)}
                disabled={updating}
                className="w-20 mx-auto text-center text-2xl font-bold"
              />
            </div>
            <span className="text-3xl font-bold text-gray-400">VS</span>
            <div className="text-center">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                {editingMatch.team2.name}
              </label>
              <FormInput
                id="scoreTeam2"
                type="number"
                min={0}
                value={scoreTeam2}
                onChange={(e) => setScoreTeam2(+e.target.value || 0)}
                disabled={updating}
                className="w-20 mx-auto text-center text-2xl font-bold"
              />
            </div>
          </div>
        </CreateEditModal>
      )}
    </div>
  );
}

// hooks/usePermissions.ts

import { SystemRoles } from "@/types/api";
import { useAuth } from "./useAuth";

export const usePermissions = (creatorId?: number | string) => {
  const { user } = useAuth();

  const isAdmin = user?.role === SystemRoles.ADMIN;
  const isCreator = !!creatorId && user?.id === creatorId;
  const canEdit = isAdmin || isCreator;

  return { user, isAdmin, isCreator, canEdit, canCreate: !!user };
};

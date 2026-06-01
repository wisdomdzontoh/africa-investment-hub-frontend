"use client";

import { useAuth } from "@clerk/nextjs";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useMemo } from "react";
import { createApiClient, type ApiClient } from "@/lib/api/client";
import type { StagedDocument } from "@/lib/onboarding/types";
import type {
  AdminAnalytics,
  AdminInvestor,
  AdminInvestorDetail,
  AdminProject,
  AdminProjectDetail,
  AuditLogEntry,
  InvestorProfile,
  MatchItem,
  NotificationItem,
  Page,
  PresignUploadResponse,
  ProjectDetail,
  ProjectOwnerProject,
  UserAccount,
  UserRole,
  UserStatus,
} from "@/types/api";

/** Presign each staged document, then PUT the bytes straight to R2 storage.
 *  Best-effort: callers decide whether a failure should block the flow. */
async function uploadDocuments(
  api: ApiClient,
  presignPath: string,
  documents: StagedDocument[],
): Promise<void> {
  for (const { docType, file } of documents) {
    const contentType = file.type || "application/octet-stream";
    const presigned = await api.post<PresignUploadResponse>(presignPath, {
      filename: file.name,
      content_type: contentType,
      doc_type: docType,
    });
    const put = await fetch(presigned.upload_url, {
      method: presigned.method || "PUT",
      body: file,
      headers: { "Content-Type": contentType },
    });
    if (!put.ok) {
      throw new Error(`Upload failed for ${file.name} (${put.status}).`);
    }
  }
}

export function useApiClient() {
  const { getToken } = useAuth();
  const template = process.env.NEXT_PUBLIC_CLERK_JWT_TEMPLATE;

  return useMemo(
    () =>
      createApiClient(async () => {
        if (template) {
          return getToken({ template });
        }
        return getToken();
      }),
    [getToken, template],
  );
}

export function useAccount(enabled = true) {
  const api = useApiClient();
  return useQuery({
    queryKey: ["account"],
    queryFn: () => api.get<UserAccount>("/account"),
    enabled,
    retry: false,
  });
}

export function useSetAccountRole() {
  const api = useApiClient();
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (role: "investor" | "project_owner") =>
      api.post<UserAccount>("/account/role", { role }),
    onSuccess: () => qc.invalidateQueries({ queryKey: ["account"] }),
  });
}

export function useInvestorProfile(enabled = true) {
  const api = useApiClient();
  return useQuery({
    queryKey: ["investor", "me"],
    queryFn: () => api.get<InvestorProfile>("/investors/me"),
    enabled,
    retry: false,
  });
}

export function useRegisterInvestor() {
  const api = useApiClient();
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (body: Record<string, unknown>) =>
      api.post<InvestorProfile>("/investors/register", body),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["investor"] });
      qc.invalidateQueries({ queryKey: ["account"] });
    },
  });
}

export function useUploadInvestorDocuments() {
  const api = useApiClient();
  return useMemo(
    () => (documents: StagedDocument[]) =>
      uploadDocuments(api, "/investors/me/documents", documents),
    [api],
  );
}

export function useUploadProjectDocuments() {
  const api = useApiClient();
  return useMemo(
    () => (projectId: string, documents: StagedDocument[]) =>
      uploadDocuments(api, `/projects/${projectId}/documents`, documents),
    [api],
  );
}

export function useMyProjects(enabled = true) {
  const api = useApiClient();
  return useQuery({
    queryKey: ["projects", "mine"],
    queryFn: () => api.get<ProjectOwnerProject[]>("/projects/mine"),
    enabled,
  });
}

export function useCreateProject() {
  const api = useApiClient();
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (body: Record<string, unknown>) =>
      api.post<ProjectDetail>("/projects", body),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["projects"] });
      // First project completes onboarding — refresh the account flag.
      qc.invalidateQueries({ queryKey: ["account"] });
    },
  });
}

export function useInvestorMatches() {
  const api = useApiClient();
  return useQuery({
    queryKey: ["investor", "matches"],
    queryFn: () => api.get<Page<MatchItem>>("/investors/me/matches"),
  });
}

export function useInvestorNotifications() {
  const api = useApiClient();
  return useQuery({
    queryKey: ["investor", "notifications"],
    queryFn: () => api.get<Page<NotificationItem>>("/investors/me/notifications"),
  });
}

export function useAdminAnalytics() {
  const api = useApiClient();
  return useQuery({
    queryKey: ["admin", "analytics"],
    queryFn: () => api.get<AdminAnalytics>("/admin/analytics"),
  });
}

export function useAdminInvestors() {
  const api = useApiClient();
  return useQuery({
    queryKey: ["admin", "investors"],
    queryFn: () =>
      api.get<{ items: AdminInvestor[] }>("/admin/investors"),
  });
}

export function useAdminProjects() {
  const api = useApiClient();
  return useQuery({
    queryKey: ["admin", "projects"],
    queryFn: () =>
      api.get<{ items: AdminProject[] }>("/admin/projects"),
  });
}

export function useAdminInvestor(id: string) {
  const api = useApiClient();
  return useQuery({
    queryKey: ["admin", "investor", id],
    queryFn: () => api.get<AdminInvestorDetail>(`/admin/investors/${id}`),
  });
}

export function useAdminProject(id: string) {
  const api = useApiClient();
  return useQuery({
    queryKey: ["admin", "project", id],
    queryFn: () => api.get<AdminProjectDetail>(`/admin/projects/${id}`),
  });
}

export function useAdminUsers() {
  const api = useApiClient();
  return useQuery({
    queryKey: ["admin", "users"],
    queryFn: () => api.get<{ items: UserAccount[] }>("/admin/users"),
  });
}

export function useAdminAuditLog() {
  const api = useApiClient();
  return useQuery({
    queryKey: ["admin", "audit-log"],
    queryFn: () =>
      api.get<{ items: AuditLogEntry[] }>("/admin/audit-log"),
  });
}

export type InvestorAction = "approve" | "reject" | "suspend";
export type ProjectAction = "approve" | "reject" | "suspend";

export function useSetInvestorStatus() {
  const api = useApiClient();
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (vars: { id: string; action: InvestorAction; reason?: string }) =>
      api.patch(`/admin/investors/${vars.id}/status`, {
        action: vars.action,
        reason: vars.reason,
      }),
    onSuccess: () => qc.invalidateQueries({ queryKey: ["admin"] }),
  });
}

export function useSetProjectStatus() {
  const api = useApiClient();
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (vars: {
      id: string;
      action: ProjectAction;
      reason?: string;
      risk_level?: string;
    }) =>
      api.patch(`/admin/projects/${vars.id}/status`, {
        action: vars.action,
        reason: vars.reason,
        risk_level: vars.risk_level,
      }),
    onSuccess: () => qc.invalidateQueries({ queryKey: ["admin"] }),
  });
}

export function useSetUserRole() {
  const api = useApiClient();
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (vars: { userId: string; role: UserRole }) =>
      api.patch(`/admin/users/${vars.userId}/role`, { role: vars.role }),
    onSuccess: () => qc.invalidateQueries({ queryKey: ["admin"] }),
  });
}

export function useSetUserStatus() {
  const api = useApiClient();
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (vars: { userId: string; status: UserStatus }) =>
      api.patch(`/admin/users/${vars.userId}/status`, { status: vars.status }),
    onSuccess: () => qc.invalidateQueries({ queryKey: ["admin"] }),
  });
}

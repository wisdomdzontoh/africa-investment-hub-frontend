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
  AdminMatch,
  AdminProject,
  AdminProjectDetail,
  AuditLogEntry,
  DealRoom,
  DueDiligence,
  RiskAssessment,
  CmsCountryContent,
  CmsCountrySummary,
  CmsCountryUpsert,
  CmsHomepageContent,
  InvestorProfile,
  MatchItem,
  Milestone,
  NotificationItem,
  Page,
  PresignUploadResponse,
  ProjectDetail,
  FacilitatorProject,
  FacilitatorProjectDetail,
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
    // `/projects/mine` is a paginated envelope ({ items, … }); unwrap to the
    // array the portal pages consume.
    queryKey: ["projects", "mine"],
    queryFn: () => api.get<Page<FacilitatorProject>>("/projects/mine"),
    select: (page) => page.items,
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

export function useUpdateInvestorProfile() {
  const api = useApiClient();
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (body: Record<string, unknown>) =>
      api.patch<InvestorProfile>("/investors/me", body),
    onSuccess: (profile) => {
      qc.setQueryData(["investor", "me"], profile);
      qc.invalidateQueries({ queryKey: ["investor"] });
    },
  });
}

/** Owner's full view of one of their own projects (any status, with documents). */
export function useMyProject(projectId: string, enabled = true) {
  const api = useApiClient();
  return useQuery({
    queryKey: ["projects", "mine", projectId],
    queryFn: () => api.get<FacilitatorProjectDetail>(`/projects/mine/${projectId}`),
    enabled: enabled && Boolean(projectId),
    retry: false,
  });
}

export function useUpdateProject() {
  const api = useApiClient();
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (vars: { projectId: string; body: Record<string, unknown> }) =>
      api.patch<FacilitatorProjectDetail>(`/projects/${vars.projectId}`, vars.body),
    onSuccess: (project) => {
      qc.setQueryData(["projects", "mine", project.id], project);
      qc.invalidateQueries({ queryKey: ["projects"] });
    },
  });
}

export function useDeleteProjectDocument() {
  const api = useApiClient();
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (vars: { projectId: string; r2Key: string }) =>
      // Encode per segment — the backend route param is `{r2_key:path}`, so
      // slashes must survive while each segment is still URL-safe.
      api.delete(
        `/projects/${vars.projectId}/documents/${vars.r2Key
          .split("/")
          .map(encodeURIComponent)
          .join("/")}`,
      ),
    onSuccess: (_data, vars) =>
      qc.invalidateQueries({ queryKey: ["projects", "mine", vars.projectId] }),
  });
}

/* ───────────────────────── Milestones (PRD §6.6) ───────────────────────── */

export function useMilestones(projectId: string, enabled = true) {
  const api = useApiClient();
  return useQuery({
    queryKey: ["projects", projectId, "milestones"],
    queryFn: () => api.get<Milestone[]>(`/projects/${projectId}/milestones`),
    enabled: enabled && Boolean(projectId),
  });
}

export function useCreateMilestone(projectId: string) {
  const api = useApiClient();
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (body: Record<string, unknown>) =>
      api.post<Milestone>(`/projects/${projectId}/milestones`, body),
    onSuccess: () =>
      qc.invalidateQueries({ queryKey: ["projects", projectId, "milestones"] }),
  });
}

export function useUpdateMilestone(projectId: string) {
  const api = useApiClient();
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (vars: { milestoneId: string; body: Record<string, unknown> }) =>
      api.patch<Milestone>(`/milestones/${vars.milestoneId}`, vars.body),
    onSuccess: () =>
      qc.invalidateQueries({ queryKey: ["projects", projectId, "milestones"] }),
  });
}

export function useDeleteMilestone(projectId: string) {
  const api = useApiClient();
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (milestoneId: string) => api.delete(`/milestones/${milestoneId}`),
    onSuccess: () =>
      qc.invalidateQueries({ queryKey: ["projects", projectId, "milestones"] }),
  });
}

export function useInvestorMatches(enabled = true) {
  const api = useApiClient();
  return useQuery({
    queryKey: ["investor", "matches"],
    queryFn: () => api.get<Page<MatchItem>>("/investors/me/matches"),
    enabled,
  });
}

export function useExpressInterest() {
  const api = useApiClient();
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (matchId: string) => api.post(`/matches/${matchId}/interest`),
    onSuccess: () => qc.invalidateQueries({ queryKey: ["investor", "matches"] }),
  });
}

/* ───────────────────────── Deal room (PRD §6.10) ───────────────────────── */

export function useDealRoom(matchId: string, enabled = true) {
  const api = useApiClient();
  return useQuery({
    queryKey: ["matches", matchId, "deal-room"],
    queryFn: () => api.get<DealRoom>(`/matches/${matchId}/deal-room`),
    enabled: enabled && Boolean(matchId),
    retry: false,
  });
}

export function useSignNda(matchId: string) {
  const api = useApiClient();
  const qc = useQueryClient();
  return useMutation({
    mutationFn: () => api.post(`/matches/${matchId}/nda/sign`),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["matches", matchId, "deal-room"] });
      qc.invalidateQueries({ queryKey: ["investor", "matches"] });
    },
  });
}

function encodeKey(r2Key: string): string {
  return r2Key.split("/").map(encodeURIComponent).join("/");
}

/** Resolve a short-lived presigned download URL for a deal-room document. */
export function useDealRoomDocument() {
  const api = useApiClient();
  return useMemo(
    () => (matchId: string, r2Key: string) =>
      api.get<{ url: string; expires_in: number }>(
        `/matches/${matchId}/documents/${encodeKey(r2Key)}`,
      ),
    [api],
  );
}

export function useSetMatchConfidential(matchId: string) {
  const api = useApiClient();
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (confidential: boolean) =>
      api.patch(`/matches/${matchId}/confidential`, { confidential }),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["matches", matchId, "deal-room"] });
      qc.invalidateQueries({ queryKey: ["investor", "matches"] });
    },
  });
}

/** Resolve a presigned URL for any document via its owning collection path,
 *  e.g. `/projects/{id}/documents` or `/investors/me/documents`. */
export function useDocumentDownloader() {
  const api = useApiClient();
  return useMemo(
    () => (basePath: string, r2Key: string) =>
      api.get<{ url: string; expires_in: number }>(`${basePath}/${encodeKey(r2Key)}`),
    [api],
  );
}

/* ─────────────────────── Due diligence (PRD §6.8) ─────────────────────── */

export function useDueDiligence(matchId: string, enabled = true) {
  const api = useApiClient();
  return useQuery({
    queryKey: ["matches", matchId, "due-diligence"],
    queryFn: () => api.get<DueDiligence>(`/matches/${matchId}/due-diligence`),
    enabled: enabled && Boolean(matchId),
    retry: false,
  });
}

export function useRequestDueDiligence(matchId: string) {
  const api = useApiClient();
  const qc = useQueryClient();
  return useMutation({
    mutationFn: () => api.post<DueDiligence>(`/matches/${matchId}/due-diligence`),
    onSuccess: (dd) => qc.setQueryData(["matches", matchId, "due-diligence"], dd),
  });
}

export function useUploadDdItemDocument(matchId: string) {
  const api = useApiClient();
  const qc = useQueryClient();
  return useMemo(
    () => ({
      upload: async (ddId: string, itemId: string, file: File) => {
        const contentType = file.type || "application/octet-stream";
        const presigned = await api.post<PresignUploadResponse>(
          `/due-diligence/${ddId}/items/${itemId}/document`,
          { filename: file.name, content_type: contentType, doc_type: "due_diligence" },
        );
        const put = await fetch(presigned.upload_url, {
          method: presigned.method || "PUT",
          body: file,
          headers: { "Content-Type": contentType },
        });
        if (!put.ok) throw new Error(`Upload failed (${put.status}).`);
        await qc.invalidateQueries({ queryKey: ["matches", matchId, "due-diligence"] });
      },
      downloadUrl: (ddId: string, itemId: string) =>
        api.get<{ url: string; expires_in: number }>(
          `/due-diligence/${ddId}/items/${itemId}/document`,
        ),
    }),
    [api, qc, matchId],
  );
}

export function useSetDdItemStatus(matchId: string) {
  const api = useApiClient();
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (vars: { ddId: string; itemId: string; status: string }) =>
      api.patch<DueDiligence>(`/due-diligence/${vars.ddId}/items/${vars.itemId}`, {
        status: vars.status,
      }),
    onSuccess: (dd) => qc.setQueryData(["matches", matchId, "due-diligence"], dd),
  });
}

export function useDismissMatch() {
  const api = useApiClient();
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (matchId: string) => api.post(`/matches/${matchId}/dismiss`),
    onSuccess: () => qc.invalidateQueries({ queryKey: ["investor", "matches"] }),
  });
}

export function useInvestorNotifications(enabled = true) {
  const api = useApiClient();
  return useQuery({
    queryKey: ["investor", "notifications"],
    queryFn: () => api.get<Page<NotificationItem>>("/investors/me/notifications"),
    enabled,
  });
}

export function useAdminAnalytics() {
  const api = useApiClient();
  return useQuery({
    queryKey: ["admin", "analytics"],
    queryFn: () => api.get<AdminAnalytics>("/admin/analytics"),
  });
}

export function useAdminCreateProject() {
  const api = useApiClient();
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (body: Record<string, unknown>) =>
      api.post<AdminProjectDetail>("/admin/projects", body),
    onSuccess: () => qc.invalidateQueries({ queryKey: ["admin"] }),
  });
}

export function useInviteAdmin() {
  const api = useApiClient();
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (email: string) =>
      api.post<{ message: string }>("/admin/users/invite", { email }),
    onSuccess: () => qc.invalidateQueries({ queryKey: ["admin", "audit-log"] }),
  });
}

export function useRunRiskAssessment(projectId: string) {
  const api = useApiClient();
  const qc = useQueryClient();
  return useMutation({
    mutationFn: () =>
      api.post<RiskAssessment>(`/admin/projects/${projectId}/risk-assessment`),
    onSuccess: () => qc.invalidateQueries({ queryKey: ["admin", "project", projectId] }),
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

export function useAdminMatches() {
  const api = useApiClient();
  return useQuery({
    queryKey: ["admin", "matches"],
    queryFn: () => api.get<{ items: AdminMatch[] }>("/admin/matches"),
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

/* ───────────────────────── Admin CMS (PRD §6.4) ───────────────────────── */

export function useCmsCountries() {
  const api = useApiClient();
  return useQuery({
    queryKey: ["admin", "cms", "countries"],
    queryFn: () => api.get<CmsCountrySummary[]>("/admin/cms/countries"),
  });
}

export function useCmsCountry(code: string) {
  const api = useApiClient();
  return useQuery({
    queryKey: ["admin", "cms", "countries", code],
    queryFn: () => api.get<CmsCountryContent>(`/admin/cms/countries/${code}`),
    enabled: Boolean(code),
    retry: false,
  });
}

export function useUpsertCmsCountry() {
  const api = useApiClient();
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (vars: { code: string; body: CmsCountryUpsert }) =>
      api.put<CmsCountryContent>(`/admin/cms/countries/${vars.code}`, vars.body),
    onSuccess: (content) => {
      qc.setQueryData(["admin", "cms", "countries", content.country_code], content);
      qc.invalidateQueries({ queryKey: ["admin", "cms", "countries"], exact: true });
    },
  });
}

export function useCmsHomepage() {
  const api = useApiClient();
  return useQuery({
    queryKey: ["admin", "cms", "homepage"],
    queryFn: () => api.get<CmsHomepageContent>("/admin/cms/homepage"),
  });
}

export function useUpdateCmsHomepage() {
  const api = useApiClient();
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (body: Partial<CmsHomepageContent>) =>
      api.put<CmsHomepageContent>("/admin/cms/homepage", body),
    onSuccess: (content) => qc.setQueryData(["admin", "cms", "homepage"], content),
  });
}

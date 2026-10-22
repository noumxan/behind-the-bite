"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";
import { loadCms, restoreSeededCms, saveCms } from "@/lib/content/repository";
import type {
  ActivityState,
  AnalyticsEvent,
  CmsState,
  InterestId,
  WorkspaceId,
} from "@/lib/content/types";
import { seedCms } from "@/lib/content/seed";
import { initBrowserAdapter } from "@/lib/storage/adapter";
import { useHasMounted, useMediaReducedMotion } from "@/lib/hooks";
import {
  defaultWorkspace,
  loadSession,
  loadWorkspace,
  recordEvent,
  resetWorkspace,
  saveSession,
  saveWorkspace,
  toggleInterest,
  type VisitorProfile,
  type WorkspaceState,
} from "@/lib/profile/workspace";
import { loadInbox, unreadCount } from "@/lib/inbox/store";
import type { InboxState } from "@/lib/inbox/types";
import { defaultInbox } from "@/lib/inbox/store";
import type { PageContext } from "@/lib/inbox/types";

type ComposerState = {
  open: boolean;
  context: PageContext | null;
  presetQuestion?: string;
};

type AppStateValue = {
  cms: CmsState;
  activity: ActivityState;
  workspace: WorkspaceState;
  workspaceId: WorkspaceId;
  profile: VisitorProfile;
  inbox: InboxState;
  mounted: boolean;
  reducedMotion: boolean;
  pauseMotion: boolean;
  setPauseMotion: (value: boolean) => void;
  setCms: (next: CmsState) => void;
  setActivity: (next: ActivityState) => void;
  setWorkspace: (next: WorkspaceState) => void;
  switchWorkspace: (id: WorkspaceId) => void;
  track: (name: AnalyticsEvent["name"], payload?: AnalyticsEvent["payload"], uniqueKey?: string) => void;
  restoreContent: () => void;
  resetDemo: () => void;
  resetJordanOnly: () => void;
  clearLocalActivity: () => void;
  saveInterest: (id: InterestId, on?: boolean) => void;
  composer: ComposerState;
  openComposer: (context?: PageContext | null, presetQuestion?: string) => void;
  closeComposer: () => void;
  refreshInbox: () => void;
  unreadUser: number;
  unreadAdmin: number;
  announce: (text: string) => void;
};

const AppStateContext = createContext<AppStateValue | null>(null);

export function AppStateProvider({ children }: { children: React.ReactNode }) {
  const mounted = useHasMounted();
  const mediaReduced = useMediaReducedMotion();
  const [cms, setCmsState] = useState<CmsState>(seedCms);
  const [workspaceId, setWorkspaceId] = useState<WorkspaceId>("visitor");
  const [workspace, setWorkspaceState] = useState<WorkspaceState>(defaultWorkspace);
  const [inbox, setInbox] = useState<InboxState>(defaultInbox);
  const [pauseMotion, setPauseMotion] = useState(false);
  const [visitLogged, setVisitLogged] = useState(false);
  const [composer, setComposer] = useState<ComposerState>({ open: false, context: null });
  const [liveMessage, setLiveMessage] = useState("");

  const persistWorkspace = useCallback((id: WorkspaceId, next: WorkspaceState) => {
    setWorkspaceState(next);
    saveWorkspace(id, next);
  }, []);

  useEffect(() => {
    if (!mounted) return;
    initBrowserAdapter();
    setCmsState(loadCms());
    const session = loadSession();
    setWorkspaceId(session.activeWorkspace);
    setWorkspaceState(loadWorkspace(session.activeWorkspace));
    setInbox(loadInbox());
  }, [mounted]);

  useEffect(() => {
    if (!mounted) return;
    const onStorage = (event: StorageEvent) => {
      if (!event.key) return;
      if (event.key.includes("btb.inbox")) setInbox(loadInbox());
      if (event.key.includes(`btb.workspace.${workspaceId}`)) {
        setWorkspaceState(loadWorkspace(workspaceId));
      }
    };
    window.addEventListener("storage", onStorage);
    return () => window.removeEventListener("storage", onStorage);
  }, [mounted, workspaceId]);

  useEffect(() => {
    if (!mounted || visitLogged) return;
    const next = recordEvent(loadWorkspace(workspaceId), {
      name: "visit",
      uniqueKey: `visit-${new Date().toISOString().slice(0, 10)}`,
    });
    persistWorkspace(workspaceId, next);
    setVisitLogged(true);
  }, [mounted, visitLogged, workspaceId, persistWorkspace]);

  useEffect(() => {
    if (!mounted) return;
    const root = document.documentElement;
    root.classList.toggle("text-large", workspace.profile.largerText);
    root.classList.toggle("spacing-roomy", workspace.profile.roomySpacing);
  }, [mounted, workspace.profile.largerText, workspace.profile.roomySpacing]);

  const setCms = useCallback((next: CmsState) => {
    setCmsState(next);
    saveCms(next);
  }, []);

  const setWorkspace = useCallback(
    (next: WorkspaceState) => persistWorkspace(workspaceId, next),
    [persistWorkspace, workspaceId],
  );

  const setActivity = useCallback(
    (next: ActivityState) => {
      persistWorkspace(workspaceId, { ...workspace, ...next, profile: workspace.profile });
    },
    [persistWorkspace, workspace, workspaceId],
  );

  const track = useCallback(
    (name: AnalyticsEvent["name"], payload?: AnalyticsEvent["payload"], uniqueKey?: string) => {
      const current = loadWorkspace(workspaceId);
      persistWorkspace(workspaceId, recordEvent(current, { name, payload, uniqueKey }));
    },
    [persistWorkspace, workspaceId],
  );

  const restoreContent = useCallback(() => {
    setCms(restoreSeededCms());
  }, [setCms]);

  const switchWorkspace = useCallback(
    (id: WorkspaceId) => {
      saveWorkspace(workspaceId, workspace);
      saveSession({ activeWorkspace: id });
      setWorkspaceId(id);
      setWorkspaceState(loadWorkspace(id));
    },
    [workspace, workspaceId],
  );

  const clearLocalActivity = useCallback(() => {
    persistWorkspace(workspaceId, defaultWorkspace());
  }, [persistWorkspace, workspaceId]);

  const resetDemo = useCallback(() => {
    restoreContent();
    persistWorkspace("visitor", defaultWorkspace());
    persistWorkspace("jordan", defaultWorkspace());
    persistWorkspace("graduate", defaultWorkspace());
    saveSession({ activeWorkspace: "visitor" });
    setWorkspaceId("visitor");
    setWorkspaceState(defaultWorkspace());
  }, [persistWorkspace, restoreContent]);

  const resetJordanOnly = useCallback(() => {
    const next = resetWorkspace("jordan");
    if (workspaceId === "jordan") setWorkspaceState(next);
  }, [workspaceId]);

  const saveInterest = useCallback(
    (id: InterestId, on = true) => {
      persistWorkspace(workspaceId, toggleInterest(loadWorkspace(workspaceId), id, on));
      setLiveMessage(on ? "Interest saved to My Bite." : "Interest removed from My Bite.");
    },
    [persistWorkspace, workspaceId],
  );

  const reducedMotion = workspace.profile.reducedMotion ?? workspace.reducedMotion ?? mediaReduced;

  const refreshInbox = useCallback(() => setInbox(loadInbox()), []);

  const value = useMemo(
    () => ({
      cms,
      activity: workspace,
      workspace,
      workspaceId,
      profile: workspace.profile,
      inbox,
      mounted,
      reducedMotion,
      pauseMotion,
      setPauseMotion,
      setCms,
      setActivity,
      setWorkspace,
      switchWorkspace,
      track,
      restoreContent,
      resetDemo,
      resetJordanOnly,
      clearLocalActivity,
      saveInterest,
      composer,
      openComposer: (context?: PageContext | null, presetQuestion?: string) =>
        setComposer({ open: true, context: context ?? null, presetQuestion }),
      closeComposer: () => setComposer({ open: false, context: null }),
      refreshInbox,
      unreadUser: unreadCount(inbox, "visitor", workspaceId),
      unreadAdmin: unreadCount(inbox, "admin"),
      announce: setLiveMessage,
    }),
    [
      cms,
      workspace,
      workspaceId,
      inbox,
      mounted,
      reducedMotion,
      pauseMotion,
      setCms,
      setActivity,
      setWorkspace,
      switchWorkspace,
      track,
      restoreContent,
      resetDemo,
      resetJordanOnly,
      clearLocalActivity,
      saveInterest,
      composer,
      refreshInbox,
    ],
  );

  return (
    <AppStateContext.Provider value={value}>
      <div className={pauseMotion || reducedMotion ? "pause-motion" : ""}>
        <a href="#main" className="skip-link">
          Skip to main content
        </a>
        <div className="sr-only" aria-live="polite">
          {liveMessage}
        </div>
        {children}
      </div>
    </AppStateContext.Provider>
  );
}

export function useAppState() {
  const ctx = useContext(AppStateContext);
  if (!ctx) throw new Error("useAppState must be used within AppStateProvider");
  return ctx;
}


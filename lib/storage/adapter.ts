export const STORAGE_KEYS = {
  cms: "btb.cms.v1",
  activity: "btb.activity.v1",
  settings: "btb.settings.v1",
  session: "btb.session.v2",
  inbox: "btb.inbox.v1",
  workspace: (id: string) => `btb.workspace.${id}.v1`,
} as const;

export interface StorageAdapter {
  get<T>(key: string): T | null;
  set<T>(key: string, value: T): void;
  remove(key: string): void;
}

export const memoryStore = new Map<string, string>();

export const memoryAdapter: StorageAdapter = {
  get<T>(key: string) {
    const raw = memoryStore.get(key);
    if (!raw) return null;
    try {
      return JSON.parse(raw) as T;
    } catch {
      return null;
    }
  },
  set<T>(key: string, value: T) {
    memoryStore.set(key, JSON.stringify(value));
  },
  remove(key: string) {
    memoryStore.delete(key);
  },
};

export function createBrowserAdapter(): StorageAdapter {
  return {
    get<T>(key: string) {
      try {
        if (typeof window === "undefined") return null;
        const raw = window.localStorage.getItem(key);
        if (!raw) return null;
        return JSON.parse(raw) as T;
      } catch {
        return null;
      }
    },
    set<T>(key: string, value: T) {
      try {
        if (typeof window === "undefined") return;
        window.localStorage.setItem(key, JSON.stringify(value));
      } catch {
        memoryAdapter.set(key, value);
      }
    },
    remove(key: string) {
      try {
        if (typeof window === "undefined") return;
        window.localStorage.removeItem(key);
      } catch {
        memoryAdapter.remove(key);
      }
    },
  };
}

let adapter: StorageAdapter = memoryAdapter;

export function getAdapter() {
  return adapter;
}

export function setAdapter(next: StorageAdapter) {
  adapter = next;
}

export function initBrowserAdapter() {
  if (typeof window !== "undefined") {
    adapter = createBrowserAdapter();
  }
  return adapter;
}

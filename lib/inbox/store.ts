import { STORAGE_KEYS, getAdapter } from "../storage/adapter";
import type { WorkspaceId } from "../content/types";
import type { MessageCategory, MessageLanguage, SupportPreferenceId } from "../profile/catalog";
import type {
  AppNotification,
  Conversation,
  InboxState,
  InternalNote,
  Message,
  PageContext,
} from "./types";

export type { InboxState, Conversation, Message } from "./types";
import { SAMPLE_THREAD } from "./sample";

function clone<T>(value: T): T {
  return JSON.parse(JSON.stringify(value)) as T;
}

export const defaultInbox: InboxState = {
  conversations: [SAMPLE_THREAD.conversation],
  messages: SAMPLE_THREAD.messages,
  notes: [],
  notifications: [],
  drafts: {},
  lastReference: 1042,
};

export function loadInbox(): InboxState {
  const stored = getAdapter().get<InboxState>(STORAGE_KEYS.inbox);
  if (!stored) return clone(defaultInbox);
  return {
    conversations: Array.isArray(stored.conversations) ? stored.conversations : clone(defaultInbox.conversations),
    messages: Array.isArray(stored.messages) ? stored.messages : clone(defaultInbox.messages),
    notes: Array.isArray(stored.notes) ? stored.notes : [],
    notifications: Array.isArray(stored.notifications) ? stored.notifications : [],
    drafts: stored.drafts ?? {},
    lastReference: stored.lastReference ?? 1042,
  };
}

export function saveInbox(state: InboxState) {
  getAdapter().set(STORAGE_KEYS.inbox, state);
}

export function userThread(state: InboxState, conversationId: string) {
  return {
    conversation: state.conversations.find((item) => item.id === conversationId) ?? null,
    messages: state.messages.filter((item) => item.conversationId === conversationId),
  };
}

export function notesFor(state: InboxState, conversationId: string) {
  return state.notes.filter((item) => item.conversationId === conversationId);
}

export function createConversation(args: {
  workspaceId: WorkspaceId;
  subject: string;
  body: string;
  category: MessageCategory;
  preferredLanguage: MessageLanguage;
  contextAttachment: PageContext | null;
  sharedSupportPreferences: SupportPreferenceId[];
  sendToken: string;
}) {
  const state = loadInbox();
  if (state.messages.some((item) => item.id === `msg-${args.sendToken}`)) {
    return { state, duplicate: true as const, conversation: state.conversations.find((c) =>
      state.messages.find((m) => m.id === `msg-${args.sendToken}`)?.conversationId === c.id,
    )! };
  }
  const lastReference = state.lastReference + 1;
  const conversation: Conversation = {
    id: `convo-${lastReference}`,
    reference: `BTB-${lastReference}`,
    workspaceId: args.workspaceId,
    subject: args.subject.trim() || "Question for the team",
    category: args.category,
    status: "new",
    preferredLanguage: args.preferredLanguage,
    contextAttachment: args.contextAttachment,
    sharedSupportPreferences: args.sharedSupportPreferences,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  };
  const message: Message = {
    id: `msg-${args.sendToken}`,
    conversationId: conversation.id,
    senderRole: "visitor",
    originalText: args.body.trim(),
    originalLanguage: args.preferredLanguage,
    createdAt: conversation.createdAt,
    translations: [],
  };
  const notification: AppNotification = {
    id: `admin-n-${conversation.id}`,
    audience: "admin",
    workspaceId: args.workspaceId,
    title: `New question ${conversation.reference}`,
    href: `/admin/inbox/${conversation.id}`,
    createdAt: conversation.createdAt,
    conversationId: conversation.id,
  };
  const next: InboxState = {
    ...state,
    lastReference,
    conversations: [conversation, ...state.conversations],
    messages: [...state.messages, message],
    notifications: [notification, ...state.notifications].slice(0, 80),
  };
  saveInbox(next);
  return { state: next, duplicate: false as const, conversation };
}

export function addReply(args: {
  conversationId: string;
  senderRole: Message["senderRole"];
  text: string;
  language: MessageLanguage;
  sendToken: string;
  sampleTranslation?: TranslationLike;
}) {
  const state = loadInbox();
  if (state.messages.some((item) => item.id === `msg-${args.sendToken}`)) {
    return { state, duplicate: true as const };
  }
  const conversation = state.conversations.find((item) => item.id === args.conversationId);
  if (!conversation) return { state, duplicate: false as const };
  const message: Message = {
    id: `msg-${args.sendToken}`,
    conversationId: args.conversationId,
    senderRole: args.senderRole,
    originalText: args.text.trim(),
    originalLanguage: args.language,
    createdAt: new Date().toISOString(),
    translations: args.sampleTranslation
      ? [
          {
            language: args.sampleTranslation.language,
            text: args.sampleTranslation.text,
            status: "sample",
            provider: "authored-sample",
          },
        ]
      : [],
  };
  const updated: Conversation = {
    ...conversation,
    status: conversation.status === "resolved" ? "open" : conversation.status === "new" ? "open" : conversation.status,
    updatedAt: message.createdAt,
  };
  const notifications = [...state.notifications];
  if (args.senderRole === "admin") {
    notifications.unshift({
      id: `user-n-${message.id}`,
      audience: "visitor",
      workspaceId: conversation.workspaceId,
      title: "The outreach team replied to your question.",
      href: `/profile/messages/${conversation.id}`,
      createdAt: message.createdAt,
      conversationId: conversation.id,
    });
  } else {
    notifications.unshift({
      id: `admin-n-${message.id}`,
      audience: "admin",
      workspaceId: conversation.workspaceId,
      title: `Follow-up on ${conversation.reference}`,
      href: `/admin/inbox/${conversation.id}`,
      createdAt: message.createdAt,
      conversationId: conversation.id,
    });
  }
  const next: InboxState = {
    ...state,
    conversations: state.conversations.map((item) => (item.id === updated.id ? updated : item)),
    messages: [...state.messages, message],
    notifications: notifications.slice(0, 80),
  };
  saveInbox(next);
  return { state: next, duplicate: false as const, message };
}

type TranslationLike = { language: MessageLanguage; text: string };

export function addNote(conversationId: string, text: string) {
  const state = loadInbox();
  const note: InternalNote = {
    id: `note-${Date.now()}`,
    conversationId,
    text: text.trim(),
    createdAt: new Date().toISOString(),
  };
  const next = { ...state, notes: [...state.notes, note] };
  saveInbox(next);
  return next;
}

export function setStatus(conversationId: string, status: Conversation["status"]) {
  const state = loadInbox();
  const next = {
    ...state,
    conversations: state.conversations.map((item) =>
      item.id === conversationId ? { ...item, status, updatedAt: new Date().toISOString() } : item,
    ),
  };
  saveInbox(next);
  return next;
}

export function markConversationRead(conversationId: string, reader: Message["senderRole"]) {
  const state = loadInbox();
  const next = {
    ...state,
    messages: state.messages.map((item) => {
      if (item.conversationId !== conversationId) return item;
      if (item.senderRole === reader) return item;
      if (item.readAt) return item;
      return { ...item, readAt: new Date().toISOString() };
    }),
    notifications: state.notifications.map((item) =>
      item.conversationId === conversationId && !item.readAt
        ? { ...item, readAt: new Date().toISOString() }
        : item,
    ),
  };
  saveInbox(next);
  return next;
}

export function deleteConversation(conversationId: string, workspaceId: WorkspaceId) {
  const state = loadInbox();
  const convo = state.conversations.find((item) => item.id === conversationId);
  if (!convo || convo.workspaceId !== workspaceId) return state;
  if (convo.sampleTranslation) return state;
  const next: InboxState = {
    ...state,
    conversations: state.conversations.filter((item) => item.id !== conversationId),
    messages: state.messages.filter((item) => item.conversationId !== conversationId),
    notes: state.notes.filter((item) => item.conversationId !== conversationId),
    notifications: state.notifications.filter((item) => item.conversationId !== conversationId),
  };
  saveInbox(next);
  return next;
}

export function unreadCount(state: InboxState, audience: "admin" | "visitor", workspaceId?: WorkspaceId) {
  return state.messages.filter((message) => {
    if (message.readAt) return false;
    const convo = state.conversations.find((item) => item.id === message.conversationId);
    if (!convo) return false;
    if (audience === "admin") return message.senderRole === "visitor";
    return message.senderRole === "admin" && convo.workspaceId === workspaceId;
  }).length;
}

export function saveDraft(key: string, value: string) {
  const state = loadInbox();
  const next = { ...state, drafts: { ...state.drafts, [key]: value } };
  saveInbox(next);
  return next;
}

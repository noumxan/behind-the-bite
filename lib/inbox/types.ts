import type { MessageCategory, MessageLanguage, SupportPreferenceId } from "../profile/catalog";
import type { WorkspaceId } from "../content/types";

export type ConversationStatus = "new" | "open" | "resolved";
export type SenderRole = "visitor" | "admin";

export type PageContext = {
  title: string;
  href: string;
  pageLabel: string;
};

export type Conversation = {
  id: string;
  reference: string;
  workspaceId: WorkspaceId;
  subject: string;
  category: MessageCategory;
  status: ConversationStatus;
  preferredLanguage: MessageLanguage;
  contextAttachment: PageContext | null;
  sharedSupportPreferences: SupportPreferenceId[];
  createdAt: string;
  updatedAt: string;
  sampleTranslation?: boolean;
};

export type TranslationRecord = {
  language: MessageLanguage;
  text: string;
  status: "sample" | "live" | "unavailable";
  provider: "authored-sample" | "none" | "configured-provider";
};

export type Message = {
  id: string;
  conversationId: string;
  senderRole: SenderRole;
  originalText: string;
  originalLanguage: MessageLanguage;
  createdAt: string;
  readAt?: string;
  translations: TranslationRecord[];
};

export type InternalNote = {
  id: string;
  conversationId: string;
  text: string;
  createdAt: string;
};

export type AppNotification = {
  id: string;
  audience: "admin" | "visitor";
  workspaceId: WorkspaceId;
  title: string;
  href: string;
  createdAt: string;
  readAt?: string;
  conversationId?: string;
};

export type InboxState = {
  conversations: Conversation[];
  messages: Message[];
  notes: InternalNote[];
  notifications: AppNotification[];
  drafts: Record<string, string>;
  lastReference: number;
};

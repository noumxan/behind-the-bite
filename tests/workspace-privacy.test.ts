import { beforeEach, describe, expect, it } from "vitest";
import { memoryAdapter, memoryStore, setAdapter } from "../lib/storage/adapter";
import { defaultWorkspace, recordEvent, toggleInterest } from "../lib/profile/workspace";
import { recommendFromInterests } from "../lib/recommendations";
import {
  addNote,
  addReply,
  createConversation,
  defaultInbox,
  loadInbox,
  saveInbox,
  userThread,
} from "../lib/inbox/store";

describe("workspace events and interests", () => {
  beforeEach(() => {
    memoryStore.clear();
    setAdapter(memoryAdapter);
  });

  it("does not duplicate events with the same unique key", () => {
    let state = defaultWorkspace();
    state = recordEvent(state, { name: "explore_start", uniqueKey: "explore-sandwich-biscuit" });
    state = recordEvent(state, { name: "explore_start", uniqueKey: "explore-sandwich-biscuit" });
    expect(state.events.filter((item) => item.name === "explore_start")).toHaveLength(1);
  });

  it("saves explicit interests and updates recommendations", () => {
    let state = defaultWorkspace();
    state = toggleInterest(state, "sensors-signals", true);
    expect(state.profile.interests).toContain("sensors-signals");
    const recs = recommendFromInterests(state.profile.interests);
    expect(recs.some((item) => item.career === "automation-controls")).toBe(true);
    state = toggleInterest(state, "sensors-signals", false);
    expect(state.profile.interests).not.toContain("sensors-signals");
  });

  it("does not add an interest from an explore event", () => {
    let state = defaultWorkspace();
    state = recordEvent(state, { name: "explore_start", uniqueKey: "x", payload: { product: "sandwich-biscuit" } });
    expect(state.profile.interests).toHaveLength(0);
  });
});

describe("inbox privacy and ownership", () => {
  beforeEach(() => {
    memoryStore.clear();
    setAdapter(memoryAdapter);
    saveInbox({ ...defaultInbox, conversations: [], messages: [], notes: [], notifications: [], drafts: {}, lastReference: 1042 });
  });

  it("stores only explicitly shared support preferences", () => {
    const { conversation } = createConversation({
      workspaceId: "visitor",
      subject: "Hello",
      body: "Can you explain entry requirements simply?",
      category: "entry-requirements",
      preferredLanguage: "en",
      contextAttachment: null,
      sharedSupportPreferences: ["interview-access"],
      sendToken: "t1",
    });
    expect(conversation.sharedSupportPreferences).toEqual(["interview-access"]);
    expect(JSON.stringify(loadInbox())).not.toMatch(/quieter-spaces/);
  });

  it("keeps conversations in the sending workspace", () => {
    createConversation({
      workspaceId: "jordan",
      subject: "Jordan question",
      body: "What does a typical working environment look like?",
      category: "understanding-role",
      preferredLanguage: "en",
      contextAttachment: null,
      sharedSupportPreferences: [],
      sendToken: "j1",
    });
    const inbox = loadInbox();
    expect(inbox.conversations.every((item) => item.workspaceId === "jordan")).toBe(true);
  });

  it("never includes internal notes in the user thread", () => {
    const { conversation } = createConversation({
      workspaceId: "visitor",
      subject: "Help",
      body: "Who can I speak to about workplace adjustments?",
      category: "workplace-support",
      preferredLanguage: "en",
      contextAttachment: null,
      sharedSupportPreferences: [],
      sendToken: "n1",
    });
    addNote(conversation.id, "Internal: follow up next week");
    addReply({
      conversationId: conversation.id,
      senderRole: "admin",
      text: "Thanks for asking. Check official listings.",
      language: "en",
      sendToken: "n2",
    });
    const thread = userThread(loadInbox(), conversation.id);
    expect(JSON.stringify(thread)).not.toMatch(/Internal: follow up/);
    expect(thread.messages.some((item) => item.senderRole === "admin")).toBe(true);
  });

  it("ignores a repeated send token", () => {
    createConversation({
      workspaceId: "visitor",
      subject: "Once",
      body: "Please explain the physical tasks involved.",
      category: "other",
      preferredLanguage: "en",
      contextAttachment: null,
      sharedSupportPreferences: [],
      sendToken: "dup",
    });
    createConversation({
      workspaceId: "visitor",
      subject: "Once",
      body: "Please explain the physical tasks involved.",
      category: "other",
      preferredLanguage: "en",
      contextAttachment: null,
      sharedSupportPreferences: [],
      sendToken: "dup",
    });
    expect(loadInbox().conversations).toHaveLength(1);
  });
});

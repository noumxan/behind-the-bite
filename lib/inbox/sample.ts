import type { Conversation, Message } from "./types";

const created = "2026-10-10T09:00:00.000Z";
const replied = "2026-10-10T10:15:00.000Z";

export const SAMPLE_THREAD: { conversation: Conversation; messages: Message[] } = {
  conversation: {
    id: "convo-sample-cy",
    reference: "BTB-1042",
    workspaceId: "jordan",
    subject: "Entry requirements — sample translation",
    category: "entry-requirements",
    status: "open",
    preferredLanguage: "cy",
    contextAttachment: {
      title: "Automation and inspection",
      href: "/explore/sandwich-biscuit",
      pageLabel: "Sandwich biscuit explorer",
    },
    sharedSupportPreferences: [],
    createdAt: created,
    updatedAt: replied,
    sampleTranslation: true,
  },
  messages: [
    {
      id: "msg-sample-user",
      conversationId: "convo-sample-cy",
      senderRole: "visitor",
      originalText: "Allwch chi egluro'r gofynion mynediad mewn iaith symlach?",
      originalLanguage: "cy",
      createdAt: created,
      readAt: replied,
      translations: [
        {
          language: "en",
          text: "Can you explain the entry requirements in simpler language?",
          status: "sample",
          provider: "authored-sample",
        },
      ],
    },
    {
      id: "msg-sample-admin",
      conversationId: "convo-sample-cy",
      senderRole: "admin",
      originalText:
        "Requirements change by year and employer. Always check an official listing. An apprenticeship often asks for GCSEs in maths and English — verify the current advert.",
      originalLanguage: "en",
      createdAt: replied,
      translations: [
        {
          language: "cy",
          text: "Mae gofynion yn newid yn ôl y flwyddyn a'r cyflogwr. Gwiriwch restr swyddogol bob tro. Mae prentisiaeth yn aml yn gofyn am TGAU mewn mathemateg a Saesneg — gwiriwch yr hysbyseb gyfredol.",
          status: "sample",
          provider: "authored-sample",
        },
      ],
    },
  ],
};

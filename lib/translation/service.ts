import type { MessageLanguage } from "../profile/catalog";
import type { TranslationRecord } from "../inbox/types";

export interface TranslationService {
  translate(
    text: string,
    from: MessageLanguage,
    to: MessageLanguage,
  ): Promise<TranslationRecord>;
}

const MAX_CHARS = 2000;

export function validateMessage(text: string) {
  const trimmed = text.trim();
  if (trimmed.length < 4) return "Write a little more so the team can help.";
  if (trimmed.length > MAX_CHARS) return `Keep the message under ${MAX_CHARS} characters.`;
  return null;
}

export const demoTranslationService: TranslationService = {
  async translate() {
    return {
      language: "en",
      text: "",
      status: "unavailable",
      provider: "none",
    };
  },
};

export function translationLabel(record: TranslationRecord | undefined, original: string) {
  if (!record || record.status === "unavailable" || !record.text) {
    return {
      text: original,
      caption: "Live translation is not configured. Your original message is available.",
    };
  }
  if (record.status === "sample") {
    return {
      text: record.text,
      caption: "Sample translation. Automatic translations may miss meaning. You can ask the team to clarify.",
    };
  }
  return {
    text: record.text,
    caption: "Automatic translations may miss meaning. You can ask the team to clarify.",
  };
}

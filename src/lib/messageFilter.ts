// Shared rules for "What's on your mind" messages. Mirrored in send-contact-email.
const BLOCKED_WORDS = [
  "viagra", "casino", "porn", "sex", "xxx", "bitcoin", "crypto giveaway", "lottery", "loan offer",
  "click here", "free money", "earn money fast", "fuck", "shit", "bitch", "bastard", "asshole",
  "hack", "password", "otp", "<script", "javascript:",
];

export function checkMessage(text: string): string | null {
  const t = text.trim();
  if (t.length < 5) return "Please write at least 5 characters.";
  if (t.length > 1000) return "Please keep your message under 1000 characters.";
  const lower = t.toLowerCase();
  if (/(https?:\/\/|www\.)\S+/i.test(t)) return "Links are not allowed in messages.";
  if (BLOCKED_WORDS.some((w) => lower.includes(w))) return "This message looks unwanted or suspicious, so it can't be sent.";
  if (/(.)\1{7,}/.test(t)) return "Please avoid repeated characters.";
  const letters = t.replace(/[^a-z]/gi, "");
  if (letters.length >= 10 && letters === letters.toUpperCase() && t.length > 20) return "Please don't write the whole message in capitals.";
  return null;
}

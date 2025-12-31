export function formatText(
  input,
  {
    removeChars = "",     // string of characters to remove explicitly
    removeWords = [],     // array of whole words to remove
    keepSpaces = true,    // collapse extra spaces
    capitalize = true     // capitalize each word
  } = {}
) {
  if (!input || typeof input !== "string") return "";

  let text = input;

  // 1️⃣ Remove explicitly provided characters
  if (removeChars) {
    const escaped = removeChars.replace(/[-\/\\^$*+?.()|[\]{}]/g, "\\$&");
    text = text.replace(new RegExp(`[${escaped}]`, "g"), "");
  }

  // 2️⃣ Remove ALL special characters except letters, numbers, spaces
  text = text.replace(/[^a-zA-Z0-9\s]/g, "");

  // 3️⃣ Normalize spacing
  if (keepSpaces) {
    text = text.replace(/\s+/g, " ").trim();
  }

  // 4️⃣ Remove specific words (case-insensitive)
  if (removeWords.length) {
    const wordRegex = new RegExp(`\\b(${removeWords.join("|")})\\b`, "gi");
    text = text.replace(wordRegex, "").replace(/\s+/g, " ").trim();
  }

  // 5️⃣ Capitalize each word
  if (capitalize) {
    text = text
      .toLowerCase()
      .split(" ")
      .map(w => w.charAt(0).toUpperCase() + w.slice(1))
      .join(" ");
  }

  return text;
}

const URL_PATTERN = /\b((?:https?:\/\/|www\.)[^\s<>"]+)/i;
const URL_GLOBAL_PATTERN = /\b((?:https?:\/\/|www\.)[^\s<>"]+)/gi;
const TRAILING_PUNCTUATION_PATTERN = /[),.;!?]+$/;

const sanitizeCandidate = (candidate = "") => {
  return candidate.replace(TRAILING_PUNCTUATION_PATTERN, "").trim();
};

const normalizeHref = (candidate) => {
  if (!candidate) {
    return null;
  }

  if (candidate.startsWith("www.")) {
    return `https://${candidate}`;
  }

  return candidate;
};

export const getLinkPreviewFromText = (text = "") => {
  if (typeof text !== "string" || text.trim().length === 0) {
    return null;
  }

  const match = text.match(URL_PATTERN);
  if (!match) {
    return null;
  }

  const sanitizedCandidate = sanitizeCandidate(match[1]);
  const href = normalizeHref(sanitizedCandidate);

  if (!href) {
    return null;
  }

  try {
    const parsed = new URL(href);

    if (!parsed.hostname) {
      return null;
    }

    return {
      href,
      hostname: parsed.hostname.replace(/^www\./, ""),
    };
  } catch (_error) {
    return null;
  }
};

export const getLinkifiedSegmentsFromText = (text = "") => {
  if (typeof text !== "string" || text.length === 0) {
    return [];
  }

  const segments = [];
  let lastIndex = 0;

  for (const match of text.matchAll(URL_GLOBAL_PATTERN)) {
    const matchIndex = match.index ?? -1;
    const candidate = match[1] ?? "";

    if (matchIndex < 0 || !candidate) {
      continue;
    }

    if (matchIndex > lastIndex) {
      segments.push({ type: "text", value: text.slice(lastIndex, matchIndex) });
    }

    const sanitizedCandidate = sanitizeCandidate(candidate);
    const trailingText = candidate.slice(sanitizedCandidate.length);
    const href = normalizeHref(sanitizedCandidate);

    let isValidHref = false;
    if (href) {
      try {
        const parsed = new URL(href);
        isValidHref = Boolean(parsed.hostname);
      } catch (_error) {
        isValidHref = false;
      }
    }

    if (href && isValidHref) {
      segments.push({ type: "link", value: sanitizedCandidate, href });
      if (trailingText) {
        segments.push({ type: "text", value: trailingText });
      }
    } else {
      segments.push({ type: "text", value: candidate });
    }

    lastIndex = matchIndex + candidate.length;
  }

  if (lastIndex < text.length) {
    segments.push({ type: "text", value: text.slice(lastIndex) });
  }

  if (segments.length === 0) {
    return [{ type: "text", value: text }];
  }

  return segments;
};

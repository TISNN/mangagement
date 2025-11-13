export const MENTOR_MARKET_SELECTION_STORAGE_KEY = 'mentor-marketplace-selected-ids';
export const MENTOR_MARKET_SELECTION_EVENT = 'mentor-marketplace-selection-change';

const isBrowser = typeof window !== 'undefined';

export const getStoredMentorMarketplaceSelection = (): Set<string> => {
  if (!isBrowser) return new Set();

  try {
    const raw = window.localStorage.getItem(MENTOR_MARKET_SELECTION_STORAGE_KEY);
    if (!raw) return new Set();

    const parsed = JSON.parse(raw);
    if (!Array.isArray(parsed)) return new Set();

    return new Set<string>(parsed.filter((value): value is string => typeof value === 'string'));
  } catch (error) {
    console.error('[MentorMarketplace] Failed to read selection from storage', error);
    return new Set();
  }
};

export const saveMentorMarketplaceSelection = (ids: Set<string>) => {
  if (!isBrowser) return;

  try {
    const serialized = JSON.stringify(Array.from(ids));
    window.localStorage.setItem(MENTOR_MARKET_SELECTION_STORAGE_KEY, serialized);
  } catch (error) {
    console.error('[MentorMarketplace] Failed to persist selection', error);
  }
};

export const dispatchMentorMarketplaceSelectionChange = (ids: Set<string>) => {
  if (!isBrowser) return;

  window.dispatchEvent(
    new CustomEvent<{ ids: string[] }>(MENTOR_MARKET_SELECTION_EVENT, {
      detail: { ids: Array.from(ids) },
    }),
  );
};



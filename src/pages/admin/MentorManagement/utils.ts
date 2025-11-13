import type { MentorRecord } from './types';

export const filterMentors = (mentors: MentorRecord[], keyword: string) => {
  const value = keyword.trim();
  if (!value) return mentors;

  return mentors.filter(
    (mentor) =>
      mentor.name.includes(value) ||
      mentor.tags.some((tag) => tag.includes(value)) ||
      mentor.languages.some((lang) => lang.includes(value)),
  );
};



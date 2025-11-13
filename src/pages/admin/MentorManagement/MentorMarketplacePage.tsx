import { useEffect, useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';

import { MENTOR_MARKET } from './data';
import type { MentorRecord } from './types';
import { MentorMarketplace } from './components';
import {
  dispatchMentorMarketplaceSelectionChange,
  getStoredMentorMarketplaceSelection,
  saveMentorMarketplaceSelection,
} from './mentorMarketplaceStorage';
import { filterMentors } from './utils';

const MentorMarketplacePage: React.FC = () => {
  const navigate = useNavigate();
  const [search, setSearch] = useState('');
  const [selectedCandidates, setSelectedCandidates] = useState<Set<string>>(
    () => getStoredMentorMarketplaceSelection(),
  );

  useEffect(() => {
    saveMentorMarketplaceSelection(selectedCandidates);
    dispatchMentorMarketplaceSelectionChange(selectedCandidates);
  }, [selectedCandidates]);

  const filteredMarket = useMemo<MentorRecord[]>(
    () => filterMentors(MENTOR_MARKET, search),
    [search],
  );

  const handleToggleCandidate = (mentorId: string) => {
    setSelectedCandidates((prev) => {
      const next = new Set(prev);
      if (next.has(mentorId)) {
        next.delete(mentorId);
      } else {
        next.add(mentorId);
      }
      return next;
    });
  };

  const handleViewDetail = (mentorId: string) => {
    navigate(`/admin/mentors/${mentorId}`);
  };

  const handleBack = () => {
    navigate(-1);
  };

  return (
    <div className="mx-auto max-w-7xl space-y-6 px-4 pb-12 pt-4 sm:px-6 lg:px-8">
      <MentorMarketplace
        mentors={filteredMarket}
        selectedMarketIds={selectedCandidates}
        onToggleCandidate={handleToggleCandidate}
        onViewDetail={handleViewDetail}
        onBack={handleBack}
        search={search}
        setSearch={setSearch}
      />
    </div>
  );
};

export default MentorMarketplacePage;



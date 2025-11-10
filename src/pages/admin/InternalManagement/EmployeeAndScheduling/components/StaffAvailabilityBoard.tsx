import { MapPin, UserCheck } from 'lucide-react';

import type { StaffProfile } from '../../types';

interface StaffAvailabilityBoardProps {
  profiles: StaffProfile[];
  highlightStatus?: StaffProfile['status'][];
}

const STATUS_THEME: Record<StaffProfile['status'], string> = {
  在岗: 'bg-emerald-50 text-emerald-600 dark:bg-emerald-900/30 dark:text-emerald-200',
  请假: 'bg-amber-50 text-amber-600 dark:bg-amber-900/30 dark:text-amber-200',
  培训: 'bg-blue-50 text-blue-600 dark:bg-blue-900/30 dark:text-blue-200',
};

export const StaffAvailabilityBoard: React.FC<StaffAvailabilityBoardProps> = ({ profiles, highlightStatus }) => {
  return (
    <div className="grid gap-4 xl:grid-cols-2">
      {profiles.map((profile) => (
        <div
          key={profile.id}
          className={`flex flex-col rounded-2xl border bg-white p-5 shadow-sm transition hover:border-blue-200 hover:shadow-md dark:border-gray-800 dark:bg-gray-900/70 ${
            highlightStatus?.includes(profile.status) ? 'border-blue-400 ring-1 ring-blue-200 dark:ring-blue-500/40' : 'border-gray-200'
          }`}
        >
          <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
            <div>
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white">{profile.name}</h3>
              <p className="text-sm text-gray-600 dark:text-gray-300">
                {profile.role} · {profile.team}
              </p>
            </div>
            <div className="flex items-center gap-2 text-xs">
              <span className={`inline-flex items-center gap-1 rounded-full px-2.5 py-1 font-semibold ${STATUS_THEME[profile.status]}`}>
                <UserCheck className="h-3.5 w-3.5" />
                {profile.status}
              </span>
              <span className="rounded-full bg-gray-100 px-2.5 py-1 text-gray-600 dark:bg-gray-800/60 dark:text-gray-300">
                负载 {profile.workload}%
              </span>
            </div>
          </div>

          <div className="mt-3 flex flex-wrap gap-2 text-xs text-blue-500 dark:text-blue-200">
            {profile.skills.map((skill) => (
              <span key={skill} className="rounded-full bg-blue-50 px-2.5 py-1 dark:bg-blue-900/30">
                {skill}
              </span>
            ))}
          </div>

          <div className="mt-4 space-y-2 rounded-2xl bg-gray-50 p-4 text-sm text-gray-600 dark:bg-gray-800/60 dark:text-gray-300">
            {profile.availability.map((slot) => (
              <div key={`${profile.id}-${slot.day}-${slot.start}`} className="flex flex-col gap-1 md:flex-row md:items-center md:justify-between">
                <div className="flex items-center gap-2">
                  <span className="inline-flex h-1.5 w-1.5 rounded-full bg-blue-500" />
                  <span className="font-medium text-gray-900 dark:text-gray-200">{slot.day}</span>
                  <span>
                    {slot.start} - {slot.end}
                  </span>
                </div>
                <span className="inline-flex items-center gap-2 text-xs text-gray-500 dark:text-gray-400">
                  <MapPin className="h-3.5 w-3.5" />
                  {slot.location}
                </span>
              </div>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
};


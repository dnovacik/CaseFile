import type Ionicons from '@expo/vector-icons/Ionicons';
import type { EvidenceType } from '@casefile/engine';

import { ui } from '@/i18n/en';

export type EvidenceFilter = 'all' | 'testimony' | 'documents' | 'digital' | 'photos' | 'physical';

export const evidenceFilters: readonly { value: EvidenceFilter; label: string }[] = [
  { value: 'all', label: ui.evidence.filters.all },
  { value: 'testimony', label: ui.evidence.filters.testimony },
  { value: 'documents', label: ui.evidence.filters.documents },
  { value: 'digital', label: ui.evidence.filters.digital },
  { value: 'photos', label: ui.evidence.filters.photos },
  { value: 'physical', label: ui.evidence.filters.physical },
];

const filterOf: Record<EvidenceType, EvidenceFilter> = {
  testimony: 'testimony',
  document: 'documents',
  timeline: 'documents',
  digital: 'digital',
  photograph: 'photos',
  physical: 'physical',
};

export function matchesFilter(type: EvidenceType, filter: EvidenceFilter): boolean {
  return filter === 'all' || filterOf[type] === filter;
}

export const evidenceIcon: Record<EvidenceType, keyof typeof Ionicons.glyphMap> = {
  testimony: 'chatbubble-ellipses-outline',
  document: 'document-text-outline',
  timeline: 'time-outline',
  digital: 'server-outline',
  photograph: 'image-outline',
  physical: 'cube-outline',
};

import { ActionTypes } from '@/enums'

export interface ShareStructureIF {
    valid: boolean;
    changed: boolean;
    shareClasses: ShareClassIF[];
}

export interface ShareClassIF {
    id: number | null;
    type?: string; // Indicates whether class or series
    name: string;
    priority: number;
    hasMaximumShares?: boolean;
    maxNumberOfShares: number | null;
    hasParValue?: boolean;
    parValue?: number | null;
    currency?: string;
    hasRightsOrRestrictions: boolean;
    series?: ShareClassIF[];
    action?: ActionTypes; // Local state indicates corrected/added/removed
}

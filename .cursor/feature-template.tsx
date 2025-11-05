/**
 * FrontDesk Chatwoot Feature Template
 * 
 * Copy this template when creating a new feature.
 * Replace {FeatureName} with your actual feature name.
 */

// ============================================================================
// 1. TYPES
// ============================================================================
// Create: src/services/frontdesk/api/chatwoot/types/my-feature.types.ts
/*
export interface MyFeature {
  id: number;
  name: string;
  // ... other fields
}

export interface MyFeatureListParams {
  page?: number;
  per_page?: number;
  // ... other filters
}
*/

// ============================================================================
// 2. SERVICE METHOD
// ============================================================================
// Add to: src/services/frontdesk/api/chatwoot/services/chatwoot-my-service.service.ts
/*
import { BaseChatwootService } from '../core/base-chatwoot-service';
import { MyFeature, MyFeatureListParams } from '../types/my-feature.types';

export class ChatwootMyServiceService extends BaseChatwootService {
  async listMyFeatures(accountId: number, params?: MyFeatureListParams): Promise<any> {
    return await this.get<any>(
      this.accountScopedUrl(accountId, 'my-features'),
      params
    );
  }

  async getMyFeatureDetails(accountId: number, featureId: number): Promise<any> {
    return await this.get<any>(
      this.accountScopedUrl(accountId, `my-features/${featureId}`)
    );
  }

  async createMyFeature(accountId: number, data: Partial<MyFeature>): Promise<any> {
    return await this.post<any>(
      this.accountScopedUrl(accountId, 'my-features'),
      data
    );
  }
}
*/

// Export from: src/services/frontdesk/api/chatwoot/services/index.ts
// Add to: src/services/frontdesk/api/chatwoot/chatwoot.service.ts

// ============================================================================
// 3. RECOIL ATOM
// ============================================================================
// Add to: src/store/frontdesk/atoms/chatwoot.atoms.ts
/*
import { atom } from 'recoil';
import { MyFeature } from '@/services/frontdesk/api/chatwoot/types/my-feature.types';

export const chatwootMyFeaturesAtom = atom<MyFeature[] | null>({
  key: 'frontdesk.chatwoot.myFeatures',
  default: null,
});
*/

// ============================================================================
// 4. HOOK
// ============================================================================
// Create: src/widgets/frontdesk/providers/chatwoot/hooks/use-my-feature.ts
/*
import { useState, useEffect, useCallback, useMemo } from 'react';
import { useRecoilValue, useRecoilState } from 'recoil';
import { chatwootSelectedAccountAtom, chatwootMyFeaturesAtom } from '@/store/frontdesk/atoms/chatwoot.atoms';
import { chatwootService } from '@/services/frontdesk';
import { extractPayload } from '@/widgets/frontdesk/providers/chatwoot/utils/api-response-utils';
import { MyFeatureListParams } from '@/services/frontdesk/api/chatwoot/types/my-feature.types';

export const useMyFeature = (filters?: MyFeatureListParams) => {
  const accountId = useRecoilValue(chatwootSelectedAccountAtom);
  const [features, setFeatures] = useRecoilState(chatwootMyFeaturesAtom);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  const fetchFeatures = useCallback(async () => {
    if (!accountId) return;

    setLoading(true);
    setError(null);
    try {
      const response = await chatwootService.myService.listMyFeatures(accountId, filters);
      const data = extractPayload(response);
      setFeatures(data);
    } catch (err) {
      setError(err instanceof Error ? err : new Error('Failed to fetch features'));
    } finally {
      setLoading(false);
    }
  }, [accountId, filters, setFeatures]);

  useEffect(() => {
    fetchFeatures();
  }, [fetchFeatures]);

  return {
    features,
    loading,
    error,
    refresh: fetchFeatures,
  };
};
*/

// ============================================================================
// 5. COMPONENT
// ============================================================================
// Create: src/widgets/frontdesk/providers/chatwoot/components/my-feature/my-feature.tsx
/*
import React from 'react';
import { useMyFeature } from '../../hooks/use-my-feature';

export const MyFeatureComponent: React.FC = () => {
  const { features, loading, error, refresh } = useMyFeature();

  if (loading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return (
      <div>
        <p>Error: {error.message}</p>
        <button onClick={refresh}>Retry</button>
      </div>
    );
  }

  if (!features || features.length === 0) {
    return <div>No features found</div>;
  }

  return (
    <div>
      {features.map((feature) => (
        <div key={feature.id}>
          {/* Feature item UI */}
        </div>
      ))}
    </div>
  );
};
*/

// ============================================================================
// 6. USAGE EXAMPLE
// ============================================================================
/*
import { MyFeatureComponent } from '@/widgets/frontdesk/providers/chatwoot/components/my-feature/my-feature';

// In your view component
export const MyView: React.FC = () => {
  return (
    <div>
      <MyFeatureComponent />
    </div>
  );
};
*/

// ============================================================================
// CHECKLIST
// ============================================================================
/*
✅ Created types in types/my-feature.types.ts
✅ Created service methods in services/chatwoot-my-service.service.ts
✅ Exported service from services/index.ts
✅ Added service to chatwoot.service.ts aggregator
✅ Created Recoil atom in atoms/chatwoot.atoms.ts
✅ Created hook in hooks/use-my-feature.ts
✅ Created component in components/my-feature/
✅ Added component to view
✅ Checked Chatwoot reference for UI patterns
✅ Tested with accountId check
✅ Handled loading/error states
✅ Used extractPayload() for API responses
*/


/**
 * API Response Utilities
 *
 * Common utilities for extracting and normalizing API responses
 */

/**
 * Extract payload from Chatwoot API response
 * Handles various response structures:
 * - { payload: [...] }
 * - { data: { payload: [...] } }
 * - { data: [...] }
 * - [...]
 */
export const extractPayload = (response: any): any[] => {
  if (!response) return [];
  
  // Try nested payload first
  if (response.payload) {
    return Array.isArray(response.payload) ? response.payload : [response.payload];
  }
  
  // Try nested data.payload
  if (response.data?.payload) {
    return Array.isArray(response.data.payload) 
      ? response.data.payload 
      : [response.data.payload];
  }
  
  // Try direct data array
  if (response.data && Array.isArray(response.data)) {
    return response.data;
  }
  
  // Try direct array
  if (Array.isArray(response)) {
    return response;
  }
  
  // Return as single item array
  return [response];
};

/**
 * Extract metadata from Chatwoot API response
 */
export const extractMetadata = (response: any): any => {
  if (!response) return {};
  
  // Try nested meta
  if (response.meta) {
    return response.meta;
  }
  
  // Try nested data.meta
  if (response.data?.meta) {
    return response.data.meta;
  }
  
  // Return empty object if no meta found
  return {};
};

/**
 * Extract pagination info from metadata
 */
export const extractPaginationInfo = (meta: any): {
  hasMore: boolean;
  currentPage: number;
  totalPages: number;
} => {
  if (!meta) {
    return {
      hasMore: false,
      currentPage: 1,
      totalPages: 1,
    };
  }

  const currentPage = meta.page || 1;
  const totalPages = meta.total_pages || meta.count || 1;
  const hasMore = currentPage < totalPages;

  return {
    hasMore,
    currentPage,
    totalPages,
  };
};

/**
 * Extract counts from metadata (for conversations)
 */
export const extractCounts = (meta: any): {
  mine: number;
  unassigned: number;
  all: number;
} => {
  if (!meta) {
    return {
      mine: 0,
      unassigned: 0,
      all: 0,
    };
  }

  return {
    mine: meta.mine_count ?? 0,
    unassigned: meta.unassigned_count ?? 0,
    all: meta.all_count ?? meta.total_count ?? 0,
  };
};




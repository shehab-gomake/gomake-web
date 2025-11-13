/**
 * Document Search Utilities
 * 
 * Advanced search and relevance scoring for document search functionality.
 * Provides multi-field search with relevance ranking.
 */

import { DocumentListItem, DocumentAutocompleteOption } from '../types/document.types';

/**
 * Search match type for relevance scoring
 */
interface SearchMatch {
  field: string;
  score: number;
  matchedText?: string;
}

/**
 * Document with relevance score
 */
interface ScoredDocument extends DocumentAutocompleteOption {
  relevanceScore: number;
  matches: SearchMatch[];
}

/**
 * Format date for display
 */
function formatDate(dateString?: string): string {
  if (!dateString) return '';
  
  try {
    const date = new Date(dateString);
    if (isNaN(date.getTime())) return '';
    
    return new Intl.DateTimeFormat('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
    }).format(date);
  } catch {
    return '';
  }
}

/**
 * Format currency amount
 */
function formatCurrency(amount?: number, currency?: string): string {
  if (amount === undefined || amount === null) return '';
  
  const currencySymbol = currency || '';
  return `${currencySymbol}${amount.toLocaleString('en-US', { 
    minimumFractionDigits: 2, 
    maximumFractionDigits: 2 
  })}`;
}

/**
 * Calculate relevance score for a document based on search term
 * 
 * Scoring weights:
 * - Exact match in document number: 100 points
 * - Starts with search term in number: 80 points
 * - Contains search term in number: 60 points
 * - Exact match in client name: 50 points
 * - Starts with search term in client name: 40 points
 * - Contains search term in client name: 30 points
 * - Match in status: 20 points
 * - Match in date: 15 points
 * - Match in amount: 10 points
 */
function calculateRelevanceScore(
  document: DocumentListItem,
  searchTerm: string
): { score: number; matches: SearchMatch[] } {
  if (!searchTerm.trim()) {
    return { score: 0, matches: [] };
  }

  const term = searchTerm.toLowerCase().trim();
  const matches: SearchMatch[] = [];
  let totalScore = 0;

  // Search in document number
  const docNumber = document.number?.toLowerCase() || '';
  if (docNumber === term) {
    matches.push({ field: 'number', score: 100, matchedText: document.number });
    totalScore += 100;
  } else if (docNumber.startsWith(term)) {
    matches.push({ field: 'number', score: 80, matchedText: document.number });
    totalScore += 80;
  } else if (docNumber.includes(term)) {
    matches.push({ field: 'number', score: 60, matchedText: document.number });
    totalScore += 60;
  }

  // Search in client name
  const clientName = document.client?.name?.toLowerCase() || '';
  if (clientName === term) {
    matches.push({ field: 'client', score: 50, matchedText: document.client?.name });
    totalScore += 50;
  } else if (clientName.startsWith(term)) {
    matches.push({ field: 'client', score: 40, matchedText: document.client?.name });
    totalScore += 40;
  } else if (clientName.includes(term)) {
    matches.push({ field: 'client', score: 30, matchedText: document.client?.name });
    totalScore += 30;
  }

  // Search in client code
  const clientCode = document.client?.code?.toLowerCase() || '';
  if (clientCode.includes(term)) {
    matches.push({ field: 'clientCode', score: 25, matchedText: document.client?.code });
    totalScore += 25;
  }

  // Search in status
  const status = document.status?.toLowerCase() || '';
  if (status.includes(term)) {
    matches.push({ field: 'status', score: 20, matchedText: document.status });
    totalScore += 20;
  }

  // Search in date (formatted)
  const formattedDate = formatDate(document.createDate);
  if (formattedDate.toLowerCase().includes(term)) {
    matches.push({ field: 'date', score: 15, matchedText: formattedDate });
    totalScore += 15;
  }

  // Search in amount (as string)
  const amountStr = document.total?.toString() || '';
  if (amountStr.includes(term)) {
    matches.push({ field: 'amount', score: 10, matchedText: formatCurrency(document.total, document.currency) });
    totalScore += 10;
  }

  return { score: totalScore, matches };
}

/**
 * Search and rank documents by relevance
 * 
 * @param documents - Array of documents to search
 * @param searchTerm - Search query string
 * @returns Array of scored and sorted documents
 */
export function searchDocuments(
  documents: DocumentListItem[],
  searchTerm: string
): ScoredDocument[] {
  if (!searchTerm.trim()) {
    // No search term - return all documents sorted by date (newest first)
    return documents
      .map((doc) => ({
        id: doc.id,
        label: `${doc.number || 'N/A'} - ${doc.client?.name || 'Unknown'}`,
        value: doc,
        documentNumber: doc.number,
        documentId: doc.id,
        relevanceScore: 0,
        matches: [],
      }))
      .sort((a, b) => {
        const dateA = new Date(a.value.createDate || 0).getTime();
        const dateB = new Date(b.value.createDate || 0).getTime();
        return dateB - dateA; // Newest first
      });
  }

  // Calculate relevance scores
  const scoredDocs: ScoredDocument[] = documents
    .map((doc) => {
      const { score, matches } = calculateRelevanceScore(doc, searchTerm);
      
      return {
        id: doc.id,
        label: `${doc.number || 'N/A'} - ${doc.client?.name || 'Unknown'}`,
        value: doc,
        documentNumber: doc.number,
        documentId: doc.id,
        relevanceScore: score,
        matches,
      };
    })
    .filter((doc) => doc.relevanceScore > 0) // Only include documents with matches
    .sort((a, b) => {
      // Sort by relevance score (highest first)
      if (b.relevanceScore !== a.relevanceScore) {
        return b.relevanceScore - a.relevanceScore;
      }
      // If scores are equal, sort by date (newest first)
      const dateA = new Date(a.value.createDate || 0).getTime();
      const dateB = new Date(b.value.createDate || 0).getTime();
      return dateB - dateA;
    });

  return scoredDocs;
}

/**
 * Format document for display with enhanced context
 */
export function formatDocumentForDisplay(document: DocumentListItem): {
  number: string;
  clientName: string;
  date: string;
  amount: string;
  status: string;
  hasStatus: boolean;
  hasAmount: boolean;
} {
  return {
    number: document.number || 'N/A',
    clientName: document.client?.name || 'Unknown Customer',
    date: formatDate(document.createDate),
    amount: formatCurrency(document.total, document.currency),
    status: document.status || '',
    hasStatus: !!document.status,
    hasAmount: document.total !== undefined && document.total !== null,
  };
}

/**
 * Debounce function for search input
 */
export function debounce<T extends (...args: any[]) => any>(
  func: T,
  wait: number
): (...args: Parameters<T>) => void {
  let timeout: NodeJS.Timeout | null = null;
  
  return function executedFunction(...args: Parameters<T>) {
    const later = () => {
      timeout = null;
      func(...args);
    };
    
    if (timeout) {
      clearTimeout(timeout);
    }
    timeout = setTimeout(later, wait);
  };
}


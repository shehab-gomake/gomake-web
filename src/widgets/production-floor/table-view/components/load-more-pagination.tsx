import React, { useState, useMemo } from 'react';
import { Button, Stack, Typography } from '@mui/material';
import { useTranslation } from 'react-i18next';

interface LoadMorePaginationProps {
  items: any[];
  itemsPerPage?: number;
  children: (items: any[]) => React.ReactNode;
  tableRef?: React.RefObject<HTMLElement>;
}

export const LoadMorePagination: React.FC<LoadMorePaginationProps> = ({
  items,
  itemsPerPage = 50,
  children,
  tableRef
}) => {
  const { t } = useTranslation();
  const [currentPage, setCurrentPage] = useState(1);
  const [showAll, setShowAll] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  // Calculate pagination
  const pagination = useMemo(() => {
    const totalItems = items.length;
    const totalPages = Math.ceil(totalItems / itemsPerPage);
    const startIndex = (currentPage - 1) * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;
    
    // For large datasets, use virtual rendering when showing all
    let currentItems;
    if (showAll) {
      if (totalItems > 100) {
        // For very large datasets, still paginate but show more items per page
        currentItems = items.slice(0, Math.min(totalItems, 200));
      } else {
        currentItems = items;
      }
    } else {
      currentItems = items.slice(startIndex, endIndex);
    }
    
    return {
      currentItems,
      totalItems,
      totalPages,
      currentPage,
      hasMore: currentPage < totalPages && !showAll,
      showing: showAll ? `All ${totalItems} items` : `${startIndex + 1}-${Math.min(endIndex, totalItems)} of ${totalItems}`
    };
  }, [items, currentPage, itemsPerPage, showAll]);

  const handleLoadMore = () => {
    setCurrentPage(prev => prev + 1);
    // Scroll to top of the table
    setTimeout(() => {
      if (tableRef?.current) {
        tableRef.current.scrollIntoView({ 
          behavior: 'smooth', 
          block: 'start' 
        });
      } else {
        // Fallback to finding the closest table container
        const tableContainer = document.querySelector('.MuiTableContainer-root');
        if (tableContainer) {
          tableContainer.scrollIntoView({ 
            behavior: 'smooth', 
            block: 'start' 
          });
        }
      }
    }, 100); // Small delay to ensure new content is rendered
  };

  const handleReset = () => {
    setCurrentPage(1);
    setShowAll(false);
    // Scroll to top of the table
    setTimeout(() => {
      if (tableRef?.current) {
        tableRef.current.scrollIntoView({ 
          behavior: 'smooth', 
          block: 'start' 
        });
      } else {
        // Fallback to finding the closest table container
        const tableContainer = document.querySelector('.MuiTableContainer-root');
        if (tableContainer) {
          tableContainer.scrollIntoView({ 
            behavior: 'smooth', 
            block: 'start' 
          });
        }
      }
    }, 100); // Small delay to ensure new content is rendered
  };

  const handleShowAll = () => {
    setIsLoading(true);
    setShowAll(true);
    
    // Use requestAnimationFrame to prevent blocking the UI
    requestAnimationFrame(() => {
      // Scroll to top of the table
      setTimeout(() => {
        if (tableRef?.current) {
          tableRef.current.scrollIntoView({ 
            behavior: 'smooth', 
            block: 'start' 
          });
        } else {
          // Fallback to finding the closest table container
          const tableContainer = document.querySelector('.MuiTableContainer-root');
          if (tableContainer) {
            tableContainer.scrollIntoView({ 
              behavior: 'smooth', 
              block: 'start' 
            });
          }
        }
        setIsLoading(false);
      }, 100); // Small delay to ensure new content is rendered
    });
  };

  return (
    <>
      {/* Render current items */}
      {isLoading ? (
        <tr>
          <td colSpan={100} style={{ textAlign: 'center', padding: '20px' }}>
            <Typography variant="body2" color="text.secondary">
              Loading all items...
            </Typography>
          </td>
        </tr>
      ) : (
        children(pagination.currentItems)
      )}
      
      {/* Pagination controls - rendered as table rows */}
      {(pagination.currentPage > 1 || pagination.hasMore) && !isLoading && (
        <>
          <tr>
            <td colSpan={100} style={{ padding: '8px', border: 'none' }}>
              <Stack 
                direction="row" 
                justifyContent="space-between" 
                alignItems="center"
                sx={{ 
                  padding: '8px',
                  backgroundColor: '#f8f9fa',
                  borderRadius: '4px',
                  border: '1px solid #e9ecef'
                }}
              >
                <Typography variant="body2" color="text.secondary">
                  {t('pagination.showing', { showing: pagination.showing })}
                </Typography>
                
                <Stack direction="row" gap={1}>
                  {pagination.currentPage > 1 && !showAll && (
                    <Button
                      variant="outlined"
                      size="small"
                      onClick={handleReset}
                    >
                      {t('pagination.showFirst', { count: itemsPerPage })}
                    </Button>
                  )}
                  
                  {pagination.hasMore && !showAll && (
                    <Button
                      variant="contained"
                      size="small"
                      onClick={handleLoadMore}
                    >
                      {t('pagination.loadMore', { count: itemsPerPage })}
                    </Button>
                  )}

                  {!showAll && pagination.totalItems > itemsPerPage && (
                    <Button
                      variant="outlined"
                      size="small"
                      onClick={handleShowAll}
                      disabled={isLoading}
                    >
                      {isLoading ? 'Loading...' : `Show All (${pagination.totalItems} items)`}
                    </Button>
                  )}
                </Stack>
              </Stack>
            </td>
          </tr>
        </>
      )}
    </>
  );
}; 
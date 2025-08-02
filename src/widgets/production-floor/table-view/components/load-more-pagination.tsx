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

  // Calculate pagination
  const pagination = useMemo(() => {
    const totalItems = items.length;
    const totalPages = Math.ceil(totalItems / itemsPerPage);
    const startIndex = (currentPage - 1) * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;
    const currentItems = items.slice(startIndex, endIndex);
    
    return {
      currentItems,
      totalItems,
      totalPages,
      currentPage,
      hasMore: currentPage < totalPages,
      showing: `${startIndex + 1}-${Math.min(endIndex, totalItems)} of ${totalItems}`
    };
  }, [items, currentPage, itemsPerPage]);

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

  return (
    <>
      {/* Render current items */}
      {children(pagination.currentItems)}
      
      {/* Pagination controls - rendered as table rows */}
      {(pagination.currentPage > 1 || pagination.hasMore) && (
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
                  {pagination.currentPage > 1 && (
                    <Button
                      variant="outlined"
                      size="small"
                      onClick={handleReset}
                    >
                      {t('pagination.showFirst', { count: itemsPerPage })}
                    </Button>
                  )}
                  
                  {pagination.hasMore && (
                    <Button
                      variant="contained"
                      size="small"
                      onClick={handleLoadMore}
                    >
                      {t('pagination.loadMore', { count: itemsPerPage })}
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
import { useVirtualizer } from '@tanstack/react-virtual';
import { useRef } from 'react';
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  TableSortLabel,
  Box,
  Skeleton,
  Typography,
} from '@mui/material';

export interface Column<T> {
  id: keyof T | string;
  label: string;
  width?: number | string;
  align?: 'left' | 'center' | 'right';
  sortable?: boolean;
  render?: (row: T) => React.ReactNode;
}

interface VirtualizedTableProps<T> {
  columns: Column<T>[];
  data: T[];
  isLoading?: boolean;
  rowHeight?: number;
  sortBy?: string;
  sortOrder?: 'asc' | 'desc';
  onSort?: (column: string) => void;
  onRowClick?: (row: T) => void;
}

export function VirtualizedTable<T extends { id: string | number }>({
  columns,
  data,
  isLoading,
  rowHeight = 60,
  sortBy,
  sortOrder,
  onSort,
  onRowClick,
}: VirtualizedTableProps<T>) {
  const parentRef = useRef<HTMLDivElement>(null);

  const virtualizer = useVirtualizer({
    count: data.length,
    getScrollElement: () => parentRef.current,
    estimateSize: () => rowHeight,
    overscan: 10,
  });

  if (isLoading) {
    return (
      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              {columns.map((col) => (
                <TableCell key={String(col.id)}>{col.label}</TableCell>
              ))}
            </TableRow>
          </TableHead>
          <TableBody>
            {[...Array(5)].map((_, i) => (
              <TableRow key={i}>
                {columns.map((col) => (
                  <TableCell key={String(col.id)}>
                    <Skeleton />
                  </TableCell>
                ))}
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    );
  }

  return (
    <TableContainer component={Paper} sx={{ height: 600, overflow: 'auto' }} ref={parentRef}>
      <Table stickyHeader>
        <TableHead>
          <TableRow>
            {columns.map((col) => (
              <TableCell
                key={String(col.id)}
                align={col.align || 'left'}
                sx={{
                  width: col.width,
                  fontWeight: 700,
                  bgcolor: '#002D62',
                  color: '#ffffff',
                  borderBottom: 'none',
                  py: 2
                }}
              >
                {col.sortable && onSort ? (
                  <TableSortLabel
                    active={sortBy === col.id}
                    direction={sortBy === col.id ? sortOrder : 'asc'}
                    onClick={() => onSort(String(col.id))}
                    sx={{
                      color: '#ffffff !important',
                      '& .MuiTableSortLabel-icon': { color: '#ffffff !important' }
                    }}
                  >
                    {col.label}
                  </TableSortLabel>
                ) : (
                  col.label
                )}
              </TableCell>
            ))}
          </TableRow>
        </TableHead>
        <TableBody>
          <Box
            sx={{
              height: `${virtualizer.getTotalSize()}px`,
              width: '100%',
              position: 'relative',
            }}
          >
            {virtualizer.getVirtualItems().map((virtualRow) => {
              const row = data[virtualRow.index];
              return (
                <TableRow
                  key={row.id}
                  onClick={() => onRowClick?.(row)}
                  sx={{
                    position: 'absolute',
                    top: 0,
                    left: 0,
                    width: '100%',
                    height: `${virtualRow.size}px`,
                    transform: `translateY(${virtualRow.start}px)`,
                    cursor: onRowClick ? 'pointer' : 'default',
                    borderBottom: '1px solid rgba(0,0,0,0.05)',
                    transition: 'background-color 0.2s ease',
                    '&:hover': {
                      bgcolor: 'rgba(0, 45, 98, 0.04)',
                    },
                  }}
                >
                  {columns.map((col) => (
                    <TableCell key={String(col.id)} align={col.align || 'left'} sx={{ border: 'none' }}>
                      {col.render ? col.render(row) : (
                        <Typography variant="body2" sx={{ color: 'text.primary', fontWeight: 500 }}>
                          {String(row[col.id as keyof T] || '')}
                        </Typography>
                      )}
                    </TableCell>
                  ))}
                </TableRow>
              );
            })}
          </Box>
        </TableBody>
      </Table>
    </TableContainer>
  );
}

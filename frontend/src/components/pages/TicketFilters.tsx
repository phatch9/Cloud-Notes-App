import React, { useState } from 'react';
import { Box, TextField, MenuItem, FormControl, InputLabel, Select, Button, IconButton, Tooltip } from '@mui/material';
import type { SelectChangeEvent } from '@mui/material/Select';
import {
  FilterList as FilterIcon,
  Sort as SortIcon,
  Clear as ClearIcon,
} from '@mui/icons-material';
import { DEFAULT_FILTERS, DEFAULT_SORT } from '../../types/filters';
import type { FilterOptions, SortOptions } from '../../types/filters';
import type { TicketStatus, TicketPriority } from '../../types/ticket';

interface TicketFiltersProps {
  onFilterChange: (filters: FilterOptions) => void;
  onSortChange: (sort: SortOptions) => void;
  currentUser: { id: string; name: string } | null;
  loading?: boolean;
}

export const TicketFilters: React.FC<TicketFiltersProps> = ({
  onFilterChange,
  onSortChange,
  currentUser,
  loading = false,
}) => {
  const [filters, setFilters] = useState<FilterOptions>(DEFAULT_FILTERS);
  const [sort, setSort] = useState<SortOptions>(DEFAULT_SORT);
  const [showFilters, setShowFilters] = useState(false);

  const handleFilterChange = (field: keyof FilterOptions, value: string | number | boolean) => {
    const newFilters = { ...filters, [field]: value };
    setFilters(newFilters);
    onFilterChange(newFilters);
  };

  const handleSortChange = (field: SortOptions['field']) => {
    const direction = sort.field === field && sort.direction === 'asc' ? 'desc' as const : 'asc' as const;
    const newSort: SortOptions = { field, direction };
    setSort(newSort);
    onSortChange(newSort);
  };

  const resetFilters = () => {
    setFilters(DEFAULT_FILTERS);
    onFilterChange(DEFAULT_FILTERS);
  };

  const statusOptions: Array<{ value: TicketStatus | 'all'; label: string }> = [
    { value: 'all', label: 'All Statuses' },
    { value: 'open', label: 'Open' },
    { value: 'in-progress', label: 'In Progress' },
    { value: 'resolved', label: 'Resolved' },
    { value: 'closed', label: 'Closed' },
  ];

  const priorityOptions: Array<{ value: TicketPriority | 'all'; label: string }> = [
    { value: 'all', label: 'All Priorities' },
    { value: 'low', label: 'Low' },
    { value: 'medium', label: 'Medium' },
    { value: 'high', label: 'High' },
  ];

  const dueDateOptions = [
    { value: 'all', label: 'Any Due Date' },
    { value: 'today', label: 'Due Today' },
    { value: 'week', label: 'Due This Week' },
    { value: 'overdue', label: 'Overdue' },
  ];

  const assigneeOptions = [
    { value: 'all', label: 'All Assignees' },
    ...(currentUser ? [{ value: 'me', label: 'Assigned to Me' }] : []),
    { value: 'unassigned', label: 'Unassigned' },
  ];

  return (
    <Box sx={{ mb: 3 }}>
      <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
        <Box display="flex" alignItems="center" gap={2}>
          <TextField
            size="small"
            placeholder="Search tickets..."
            value={filters.searchQuery}
            onChange={(e) => handleFilterChange('searchQuery', e.target.value)}
            disabled={loading}
            sx={{ width: 300 }}
          />
          <Tooltip title={showFilters ? 'Hide filters' : 'Show filters'}>
            <IconButton
              onClick={() => setShowFilters(!showFilters)}
              color={showFilters ? 'primary' : 'default'}
              disabled={loading}
            >
              <FilterIcon />
            </IconButton>
          </Tooltip>
          <Tooltip title={`Sort by ${sort.field} (${sort.direction})`}>
            <IconButton
              onClick={() => handleSortChange(sort.field)}
              disabled={loading}
              color="primary"
            >
              <SortIcon />
            </IconButton>
          </Tooltip>
          {(filters.status !== 'all' ||
            filters.priority !== 'all' ||
            filters.assignee !== 'all' ||
            filters.dueDate !== 'all') && (
            <Button
              startIcon={<ClearIcon />}
              onClick={resetFilters}
              disabled={loading}
              size="small"
            >
              Clear Filters
            </Button>
          )}
        </Box>
      </Box>

      {showFilters && (
        <Box sx={{ p: 2, bgcolor: 'background.paper', borderRadius: 1, mb: 2 }}>
          <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 2 }}>
            <Box sx={{ width: { xs: '100%', sm: 'calc(50% - 8px)', md: 'calc(33.333% - 11px)', lg: 'calc(25% - 12px)' } }}>
              <FormControl fullWidth size="small">
                <InputLabel>Status</InputLabel>
                <Select
                  value={filters.status}
                  onChange={(e: SelectChangeEvent<TicketStatus | 'all'>) =>
                    handleFilterChange('status', e.target.value)
                  }
                  label="Status"
                  disabled={loading}
                >
                  {statusOptions.map((option) => (
                    <MenuItem key={option.value} value={option.value}>
                      {option.label}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Box>

            <Box sx={{ width: { xs: '100%', sm: 'calc(50% - 8px)', md: 'calc(33.333% - 11px)', lg: 'calc(25% - 12px)' }, display: 'flex' }}>
              <FormControl fullWidth size="small">
                <InputLabel>Priority</InputLabel>
                <Select
                  value={filters.priority}
                  onChange={(e: SelectChangeEvent<TicketPriority | 'all'>) =>
                    handleFilterChange('priority', e.target.value)
                  }
                  label="Priority"
                  disabled={loading}
                >
                  {priorityOptions.map((option) => (
                    <MenuItem key={option.value} value={option.value}>
                      {option.label}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Box>

            <Box sx={{ width: { xs: '100%', sm: 'calc(50% - 8px)', md: 'calc(33.333% - 11px)', lg: 'calc(25% - 12px)' }, display: 'flex' }}>
              <FormControl fullWidth size="small">
                <InputLabel>Assignee</InputLabel>
                <Select
                  value={filters.assignee}
                  onChange={(e: SelectChangeEvent<string>) =>
                    handleFilterChange('assignee', e.target.value)
                  }
                  label="Assignee"
                  disabled={loading || !currentUser}
                >
                  {assigneeOptions.map((option) => (
                    <MenuItem key={option.value} value={option.value}>
                      {option.label}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Box>

            <Box sx={{ width: { xs: '100%', sm: 'calc(50% - 8px)', md: 'calc(33.333% - 11px)', lg: 'calc(25% - 12px)' }, display: 'flex' }}>
              <FormControl fullWidth size="small">
                <InputLabel>Due Date</InputLabel>
                <Select
                  value={filters.dueDate}
                  onChange={(e: SelectChangeEvent<string>) =>
                    handleFilterChange('dueDate', e.target.value)
                  }
                  label="Due Date"
                  disabled={loading}
                >
                  {dueDateOptions.map((option) => (
                    <MenuItem key={option.value} value={option.value}>
                      {option.label}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Box>
          </Box>
        </Box>
      )}
    </Box>
  );
};

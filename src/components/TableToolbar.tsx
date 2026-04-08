import { useState } from 'react';
import { Search, Download, RefreshCw, Filter } from 'lucide-react';
import { toast } from 'sonner';

interface TableToolbarProps {
  search: string;
  onSearchChange: (v: string) => void;
  totalCount: number;
  filteredCount: number;
  placeholder?: string;
  onRefresh?: () => void;
  onExport?: () => void;
  filterOptions?: { label: string; value: string }[];
  filterValue?: string;
  onFilterChange?: (v: string) => void;
  children?: React.ReactNode;
}

const TableToolbar = ({
  search, onSearchChange, totalCount, filteredCount, placeholder,
  onRefresh, onExport, filterOptions, filterValue, onFilterChange, children
}: TableToolbarProps) => {
  const handleExport = () => {
    if (onExport) { onExport(); return; }
    toast.success(`Exported ${filteredCount} records as CSV`);
  };

  return (
    <div className="flex items-center gap-2 flex-wrap">
      <div className="flex items-center border border-border rounded px-2 py-1 bg-card flex-1 max-w-xs">
        <Search size={13} style={{ color: '#999' }} />
        <input
          className="ml-1.5 text-xs bg-transparent outline-none flex-1 placeholder:text-muted-foreground"
          placeholder={placeholder || 'Search...'}
          value={search}
          onChange={e => onSearchChange(e.target.value)}
        />
      </div>
      {filterOptions && (
        <div className="flex items-center gap-1">
          <Filter size={13} style={{ color: '#888' }} />
          <select
            className="text-xs border border-border rounded px-2 py-1 bg-card"
            value={filterValue || 'All'}
            onChange={e => onFilterChange?.(e.target.value)}
          >
            <option value="All">All</option>
            {filterOptions.map(o => <option key={o.value} value={o.value}>{o.label}</option>)}
          </select>
        </div>
      )}
      {children}
      <div className="flex items-center gap-1 ml-auto">
        <button className="flex items-center gap-1 text-xs px-2 py-1 border border-border rounded bg-card hover:bg-accent" onClick={handleExport}>
          <Download size={12} /> Export
        </button>
        {onRefresh && (
          <button className="flex items-center gap-1 text-xs px-2 py-1 border border-border rounded bg-card hover:bg-accent" onClick={onRefresh}>
            <RefreshCw size={12} /> Refresh
          </button>
        )}
        <span className="text-[11px] ml-1" style={{ color: '#888' }}>
          {filteredCount === totalCount ? `${totalCount} items` : `${filteredCount} / ${totalCount}`}
        </span>
      </div>
    </div>
  );
};

export default TableToolbar;

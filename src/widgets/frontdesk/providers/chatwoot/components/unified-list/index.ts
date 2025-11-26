/**
 * Unified List System
 *
 * Production-ready, reusable list/dropdown components for FrontDesk Chatwoot.
 * Provides consistent UI across agents, teams, labels, statuses, priorities, etc.
 *
 * ## Architecture
 *
 * 1. **Types** - Unified type definitions for all list items
 * 2. **UnifiedListDropdown** - Base dropdown component with single/multi-select
 * 3. **List Items** - Specialized renderers for different data types
 * 4. **Selects** - Complete components with triggers and dropdowns
 *
 * ## Usage
 *
 * ### Simple Select (Agent)
 * ```tsx
 * import { AgentSelect } from './unified-list';
 *
 * <AgentSelect
 *   selectedAgent={currentAgent}
 *   agents={availableAgents}
 *   onSelect={(id, agent) => handleAssign(agent)}
 *   currentUserId={myUserId}
 *   variant="inline"
 * />
 * ```
 *
 * ### Filter Select (Team)
 * ```tsx
 * import { TeamSelect } from './unified-list';
 *
 * <TeamSelect
 *   selectedTeam={filters.team}
 *   teams={teams}
 *   onSelect={(id, team) => updateFilters({ team })}
 *   variant="filter"
 *   showAllOption
 * />
 * ```
 *
 * ### Multi-Select (Labels)
 * ```tsx
 * import { LabelSelect } from './unified-list';
 *
 * <LabelSelect
 *   selectedLabels={filters.labels}
 *   labels={labels}
 *   onSelect={(titles, labels) => updateFilters({ labels: titles })}
 *   canCreate={isAdmin}
 *   onCreateClick={() => openCreateModal()}
 * />
 * ```
 *
 * ### Custom Dropdown
 * ```tsx
 * import { UnifiedListDropdown } from './unified-list';
 * import type { GenericListItem } from './unified-list';
 *
 * const items: GenericListItem[] = [
 *   { type: 'generic', id: 1, label: 'Option 1' },
 *   { type: 'generic', id: 2, label: 'Option 2' },
 * ];
 *
 * <UnifiedListDropdown
 *   open={open}
 *   anchorEl={anchorEl}
 *   onClose={handleClose}
 *   items={items}
 *   selectionMode="single"
 *   selectedValue={selected}
 *   onSelect={(id, item) => setSelected(id)}
 * />
 * ```
 *
 * @module unified-list
 */

// Types
export * from './types';

// Styles
export * from './styles';

// Triggers
export * from './triggers';

// Base Dropdown
export { UnifiedListDropdown } from './UnifiedListDropdown';
export type { UnifiedListDropdownProps } from './UnifiedListDropdown';

// List Item Renderers
export * from './list-items';

// Complete Select Components
export * from './selects';


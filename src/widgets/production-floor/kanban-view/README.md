# Enhanced Production Floor Kanban Board

## Overview

The enhanced Kanban board provides a structured, organized view of production tasks organized by categories and stations. This replaces the previous flat structure with a hierarchical organization that makes it easier to manage and track work across different production areas.

## Key Features

### 1. Category-Based Organization

- **Categories**: Production areas are grouped into logical categories (Pre-Press, Design, Printing Press, etc.)
- **Collapsible**: Each category can be expanded or collapsed to focus on specific areas
- **Visual Indicators**: Categories show total stations and active jobs count

### 2. Station-Based Sub-Boards

- **Individual Stations**: Each station has its own Kanban board with status columns
- **Capacity Management**: Shows station capacity and current active job count
- **Limited Display**: Each station shows maximum 4 tasks by default with overflow indicator

### 3. Enhanced Drag & Drop

- **Station Restrictions**: Tasks can only be moved within the same station
- **Category Restrictions**: Tasks cannot be moved across different categories
- **Visual Feedback**: Clear visual indicators for valid drop zones

### 4. Responsive Design

- **Mobile Support**: Optimized layout for mobile devices
- **Adaptive Columns**: Columns stack vertically on mobile
- **Touch-Friendly**: Optimized for touch interactions

## Structure

```
Production Floor Kanban Board
├── Fixed Status Header (Sticky)
│   ├── Production Stations
│   ├── Waiting
│   ├── Urgent
│   ├── In Progress
│   ├── Waiting Approval
│   └── Stuck
└── Scrollable Content Area
    ├── Pre-Press Category (Collapsible)
    │   ├── Design Studio Station Lane
    │   │   ├── Station Header (Name, Capacity, Active)
    │   │   ├── Waiting Column (Job Cards)
    │   │   ├── Urgent Column (Job Cards)
    │   │   ├── In Progress Column (Job Cards)
    │   │   ├── Waiting Approval Column (Job Cards)
    │   │   └── Stuck Column (Job Cards)
    │   ├── Prepress Station 1 Lane
    │   ├── Pre-Press / Plating Lane
    │   └── Prepress Station 2 Lane
    ├── Design Category (Collapsible)
    │   └── Design Station 1 Lane
    └── Printing Press Category (Collapsible)
        ├── Digital Press 1 Lane
        └── Offset Press 1 Lane
```

## Status Column Alignment

The board uses fixed status columns that are consistent across all station lanes:

- **Waiting**: Light blue background
- **Urgent**: Light red background
- **In Progress**: Light green background
- **Waiting Approval**: Light orange background
- **Stuck**: Light red background

All station lanes have the same 5 status columns in the same order, ensuring perfect alignment with the fixed header.

## Components

### 1. ProductionFloorKanbanBoard

Main component that orchestrates the entire Kanban board structure.

**Key Responsibilities:**

- Manages category collapse/expand state
- Organizes missions by station
- Handles search and filtering
- Updates active job counts

### 2. KanbanCategoryComponent

Displays a category with its stations and handles collapse/expand functionality.

**Features:**

- Category header with icon and job counts
- Collapsible content area
- Hover effects and visual feedback

### 3. KanbanStationComponent

Displays an individual station with its Kanban columns.

**Features:**

- Station header with capacity and active job info
- Horizontal Kanban columns (vertical on mobile)
- Responsive layout

### 4. FixedStatusHeader (New)

Fixed sticky header component that displays status columns.

**Features:**

- Sticky positioning at the top
- Color-coded status columns
- Responsive design for mobile
- Matches the screenshot design

### 5. StationLane (New)

Component that displays a station as a horizontal lane with status columns.

**Features:**

- Station header with name, capacity, and active job count
- Horizontal layout with status columns
- Job cards within each status column
- Responsive design

### 6. JobCard (New)

Compact card component for displaying mission information.

**Features:**

- Job code and priority indicator
- Customer name and job type
- Due date and quantity
- Automated tags display
- Hover effects and animations

### 7. KanbanColumnComponent (Enhanced)

Enhanced version of the existing column component with station-specific features.

**New Features:**

- Station-based drag and drop restrictions
- Maximum card display limit (4 by default)
- Overflow indicator for additional cards
- Enhanced visual feedback for drag operations

## Configuration

### Dynamic Categories Generation

The system automatically generates categories and stations from the actual API data:

```typescript
const generateCategoriesFromData = (
  missions: IBoardMissions[]
): ICategory[] => {
  const categoryMap = new Map<string, Map<string, IStation>>();

  // Group missions by action name (category) and machine name (station)
  missions.forEach((mission) => {
    const actionName = mission.currentStation?.actionName || "Unknown";
    const machineName = mission.currentStation?.machineName || "General";
    const machineId = mission.currentStation?.machineId;

    // Creates categories and stations dynamically based on actual data
  });

  return categories;
};
```

### Automatic Station Mapping

The system automatically maps missions to stations based on:

- `currentStation.actionName` - determines the category (e.g., "Pre Press", "Printing", "Design")
- `currentStation.machineName` - determines the specific station (e.g., "Digital Press 1", "Prepress Station")
- `currentStation.machineId` - links to specific machines for tracking

### Category Icons

The system automatically assigns icons based on action names:

- Pre Press: 🎨
- Design: ✏️
- Printing: 🖨️
- Finishing: ✂️
- Quality Control: 🔍
- Packaging: 📦
- Shipping: 🚚
- Unknown/Other: ⚙️

## Usage

### Basic Usage

```tsx
import { ProductionFloorKanbanBoard } from "./production-floor-kanban-board";

function ProductionFloor() {
  return (
    <div>
      <ProductionFloorKanbanBoard />
    </div>
  );
}
```

### Customization

To customize the category generation, modify the `generateCategoriesFromData` function:

```typescript
// Add custom category icons
const categoryIcons: Record<string, string> = {
  "Pre Press": "🎨",
  Design: "✏️",
  Printing: "🖨️",
  "Your Custom Action": "🔧", // Add your custom action
};

// Customize station capacity
const getStationCapacity = (
  actionName: string,
  machineName: string
): number => {
  // Add your custom capacity logic
  return 3; // Default capacity
};
```

## Drag & Drop Behavior

### Rules

1. **Same Station**: Tasks can be moved between status columns within the same station
2. **Same Category**: Tasks can be moved between stations within the same category (future enhancement)
3. **Cross-Category**: Tasks cannot be moved across different categories

### Visual Feedback

- Valid drop zones show blue dashed border
- Invalid drop zones show no special styling
- Dragged items show reduced opacity

## Mobile Support

### Responsive Features

- Categories stack vertically on mobile
- Station columns stack vertically on mobile
- Touch-optimized interactions
- Reduced padding and spacing for mobile

### Mobile-Specific Behavior

- Collapsed categories by default on small screens
- Swipe gestures for navigation
- Optimized card sizes for touch

## Future Enhancements

### Planned Features

1. **Category-to-Category Transfers**: Allow moving tasks between stations in the same category
2. **Custom Station Mapping**: User-configurable station assignment rules
3. **Advanced Filtering**: Filter by category, station, or specific criteria
4. **Performance Optimization**: Virtual scrolling for large datasets
5. **Real-time Updates**: WebSocket integration for live updates

### Configuration Options

1. **Persistent State**: Save collapse/expand state in localStorage
2. **Custom Themes**: Themeable components with CSS variables
3. **Export/Import**: Save and restore board configurations
4. **Analytics**: Track usage patterns and performance metrics

## Troubleshooting

### Common Issues

1. **Tasks Not Appearing in Expected Station**

   - Check the `getStationIdFromMission` function
   - Verify `currentStation` data structure
   - Review station mapping logic

2. **Drag & Drop Not Working**

   - Ensure proper permissions are set
   - Check station ID consistency
   - Verify react-dnd setup

3. **Performance Issues**
   - Limit the number of displayed cards
   - Implement virtual scrolling for large datasets
   - Optimize re-render cycles

### Debug Mode

Enable debug logging by setting:

```typescript
const DEBUG_MODE = true;
```

This will log station assignments and drag/drop operations to the console.

## Contributing

When contributing to this component:

1. **Follow the existing structure** for new categories and stations
2. **Maintain backward compatibility** with existing data
3. **Add proper TypeScript types** for new interfaces
4. **Include mobile responsiveness** in all new features
5. **Update this documentation** for any new features or changes

import { 
  flattenProductionFloorData, 
  formatDateForExport, 
  getExportFilename,
  exportProductionFloorToExcel
} from '../production-floor-export';
import { IStatusesBoardsMissions } from '@/widgets/production-floor/interfaces/production-floor-data-response';
import { IBoardMissions } from '@/widgets/production-floor/interfaces/board-missions';

// Mock data for testing
const mockBoardMission: IBoardMissions = {
  id: '1',
  userId: 'user1',
  boardMissionNumber: 'BM001',
  orderNumber: 'ORD001',
  jobName: 'Test Job',
  agentName: 'Test Agent',
  productName: 'Test Product',
  productId: 'prod1',
  currentStation: {
    actionName: 'Printing',
    employeeName: 'John Doe',
    machineName: 'Machine 1',
    id: 'station1',
    actionId: 'action1',
    boardMissionActionId: 'bma1',
    dueDate: '2024-01-15',
    employeeId: 'emp1',
    isDone: false,
    machineId: 'mach1',
    index: 0,
    isLastStation: false,
    statusId: 'status1'
  },
  nextStation: null,
  statusId: 'status1',
  clientName: 'Test Client',
  clientId: 'client1',
  actionDueDate: '2024-01-15',
  dueDate: '2024-01-15',
  boardMissionCreatedDate: '2024-01-01',
  stationInDate: '2024-01-10',
  tags: ['urgent', 'priority'],
  productItemValue: {},
  orderId: 'order1',
  automatedTags: ['auto1', 'auto2'],
  productType: 'Type A',
  priority: 1,
  showGraphicsApprovalAlert: 0,
  isUrgentWork: true,
  quantity: 100,
  storage: 'Warehouse A'
};

const mockStatusBoard: IStatusesBoardsMissions = {
  boardMissionStatus: {
    boardMissionStatus: {
      id: 'status1',
      name: 'In Progress'
    }
  },
  boardMissions: [mockBoardMission]
};

describe('Production Floor Export Utils', () => {
  describe('flattenProductionFloorData', () => {
    it('should flatten status boards data correctly', () => {
      const result = flattenProductionFloorData([mockStatusBoard]);
      
      expect(result).toHaveLength(1);
      expect(result[0]).toMatchObject({
        status: 'In Progress',
        boardMissionNumber: 'BM001',
        orderNumber: 'ORD001',
        jobName: 'Test Job',
        clientName: 'Test Client',
        productName: 'Test Product',
        productType: 'Type A',
        quantity: 100,
        currentStation: 'Printing',
        currentEmployee: 'John Doe',
        currentMachine: 'Machine 1',
        agentName: 'Test Agent',
        priority: 1,
        isUrgentWork: 'Yes',
        storage: 'Warehouse A',
        tags: 'urgent, priority',
        automatedTags: 'auto1, auto2'
      });
    });

    it('should handle empty data', () => {
      const result = flattenProductionFloorData([]);
      expect(result).toHaveLength(0);
    });

    it('should handle missing optional fields', () => {
      const minimalMission: IBoardMissions = {
        ...mockBoardMission,
        currentStation: {
          ...mockBoardMission.currentStation,
          employeeName: '',
          machineName: ''
        },
        tags: [],
        automatedTags: [],
        storage: undefined,
        quantity: undefined
      };

      const minimalStatusBoard: IStatusesBoardsMissions = {
        boardMissionStatus: {
          boardMissionStatus: {
            id: 'status1',
            name: 'Test Status'
          }
        },
        boardMissions: [minimalMission]
      };

      const result = flattenProductionFloorData([minimalStatusBoard]);
      
      expect(result).toHaveLength(1);
      expect(result[0].currentEmployee).toBe('');
      expect(result[0].currentMachine).toBe('');
      expect(result[0].tags).toBe('');
      expect(result[0].automatedTags).toBe('');
      expect(result[0].storage).toBe('');
      expect(result[0].quantity).toBeUndefined();
    });
  });

  describe('formatDateForExport', () => {
    it('should format valid date strings', () => {
      const result = formatDateForExport('2024-01-15T10:30:00Z');
      expect(result).toMatch(/\d{1,2}\/\d{1,2}\/\d{4}/); // MM/DD/YYYY or similar format
    });

    it('should handle empty date strings', () => {
      const result = formatDateForExport('');
      expect(result).toBe('');
    });

    it('should handle invalid date strings', () => {
      const result = formatDateForExport('invalid-date');
      expect(result).toBe('invalid-date'); // Falls back to original string
    });
  });

  describe('getExportFilename', () => {
    it('should generate filename with timestamp', () => {
      const result = getExportFilename('test-file', 'xlsx');
      
      expect(result).toMatch(/^test-file_\d{4}-\d{2}-\d{2}T\d{2}-\d{2}-\d{2}\.xlsx$/);
    });

    it('should handle different extensions', () => {
      const result = getExportFilename('report', 'pdf');
      
      expect(result).toMatch(/^report_\d{4}-\d{2}-\d{2}T\d{2}-\d{2}-\d{2}\.pdf$/);
    });
  });
});

import { ShiftHandoverLog } from '../../../types/production/execution/shiftHandoverLog';
import { mockForemanLogs } from './foremanLogsData';

const PROCESSES = [
  { name: '再造烟叶前处理工序', code: 'QCL' },
  { name: '再造烟叶原料投用', code: 'YLT' },
  { name: '再造烟叶提取工序', code: 'TQ' },
  { name: '再造烟叶浓缩段CIP站', code: 'CIP' },
  { name: '再造烟叶浓缩工序', code: 'NS' },
  { name: '再造烟叶配料工序', code: 'PL' },
  { name: '再造烟叶配料间香料', code: 'XL' },
  { name: '再造烟叶制浆一楼', code: 'ZJ1' },
  { name: '再造烟叶制浆二楼', code: 'ZJ2' },
  { name: '再造烟叶制浆DCS', code: 'ZJD' },
  { name: '再造烟叶抄造湿部现场', code: 'CZS' },
  { name: '再造烟叶抄造湿部DCS', code: 'CZD' },
  { name: '再造烟叶抄造干部', code: 'CZG' },
  { name: '再造烟叶成品打包', code: 'DB' },
  { name: '再造烟叶成品烘干', code: 'HG' },
  { name: '再造烟叶浆液平衡', code: 'JY' }
];

const generateMockData = (): ShiftHandoverLog[] => {
  const data: ShiftHandoverLog[] = [];
  let idCounter = 1;

  mockForemanLogs.forEach(fLog => {
    // Extract date, shift from foreman log
    const match = fLog.logNo.match(/GDJJB-(ZY|GS)-(\d{8})(\d)-\d+/);
    if (!match) return;
    const pLine = match[1];
    const dateNoDash = match[2];
    const shiftIdx = match[3];

    // For each foreman log, generate 16 operator logs (one for each process)
    PROCESSES.forEach((proc, idx) => {
      const code = `${pLine}${proc.code}`;
      const logNo = `JJB-${code}-${dateNoDash}${shiftIdx}-${String(idx + 1).padStart(2, '0')}`;
      
      const brand = fLog.logName.split('_').pop() || 'HA01';

      data.push({
        id: idCounter++,
        logNo: logNo,
        logName: `${proc.name}_${fLog.teamName}_${fLog.shiftName}_${brand}`,
        taskNo: fLog.productionTaskNo,
        process: proc.name,
        teamName: fLog.teamName,
        shiftName: fLog.shiftName,
        submitter: ['王建国', '刘强', '赵伟'][idCounter % 3],
        submitTime: fLog.submitTime, // simplify to match foreman log
        isManualFill: idCounter % 10 === 0
      });
    });
  });

  return data;
};

export const mockOperatorLogs: ShiftHandoverLog[] = generateMockData();

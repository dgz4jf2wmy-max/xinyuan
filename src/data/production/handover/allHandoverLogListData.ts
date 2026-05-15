import { AllHandoverLogList } from '../../../types/production/execution/allHandoverLogList';
import { mockForemanLogs } from './foremanLogsData';
import { mockOperatorLogs } from './operatorLogsData';

const generateMockData = (): AllHandoverLogList[] => {
  const data: AllHandoverLogList[] = [];
  let idCounter = 1;

  mockForemanLogs.forEach(fLog => {
    const dateStr = fLog.submitTime ? fLog.submitTime.substring(0, 10).replace(/-/g, '_') : '1970_01_01';
    const prodLine = fLog.logNo.includes('-ZY-') ? '再造烟叶线' : '再造梗丝线';
    const brand = fLog.logName.split('_').pop() || '';
    const name = `${dateStr}-${prodLine}-${fLog.teamName}-${fLog.shiftName}-${brand}`;

    const ops = mockOperatorLogs.filter(o => o.taskNo === fLog.productionTaskNo);
    ops.forEach(op => {
      data.push({
        id: idCounter++,
        name: name,
        foremanLogNo: fLog.logNo,
        operatorLogNo: op.logNo
      });
    });
  });

  return data;
};

export const mockAllHandoverLogListData: AllHandoverLogList[] = generateMockData();

import { ForemanShiftHandoverLog } from '../../../types/production/execution/foremanShiftHandoverLog';

const generateMockData = (): ForemanShiftHandoverLog[] => {
  const data: ForemanShiftHandoverLog[] = [];
  let idCounter = 1;
  const teams = ['甲班组', '乙班组', '丙班组'];
  const shifts = ['早班', '中班', '晚班'];
  const brands = ['HA01', 'GS02', 'NX0160L20'];
  const pLines = ['ZY', 'GS', 'ZY'];

  for (let d = 1; d <= 15; d++) {
    const dayStr = d < 10 ? `0${d}` : `${d}`;
    const dateStr = `2026-05-${dayStr}`;
    const dateNoDash = dateStr.replace(/-/g, '');

    for (let shiftIdx = 0; shiftIdx < 3; shiftIdx++) {
      const team = teams[(d + shiftIdx) % 3];
      const shift = shifts[shiftIdx];
      const brand = brands[(d + shiftIdx) % 3];
      const pLine = pLines[(d + shiftIdx) % 3];
      const pLineName = pLine === 'ZY' ? '再造烟叶线' : '再造梗丝线';
      
      const logNo = `GDJJB-${pLine}-${dateNoDash}${shiftIdx + 1}-01`;
      
      let submitTime = '';
      if (shiftIdx === 0) submitTime = `${dateStr} 16:05:00`;
      else if (shiftIdx === 1) submitTime = `${dateStr} 23:55:00`;
      else submitTime = `2026-05-${d < 9 ? `0${d+1}` : d+1} 08:05:00`;

      data.push({
        id: idCounter++,
        logNo: logNo,
        logName: `${dateNoDash}_${shift}_${team}_${pLineName}工段长交接班日志_${brand}`,
        productionTaskNo: `RW-202605-${String(idCounter - 1).padStart(3, '0')}`,
        teamName: team,
        shiftName: shift,
        submitter: '张明',
        submitTime: submitTime
      });
    }
  }
  return data;
};

export const mockForemanLogs: ForemanShiftHandoverLog[] = generateMockData();

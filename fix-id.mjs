import fs from 'fs';

const files = [
  'src/data/plan/agingPlanCreateData.ts',
  'src/data/plan/monthlyAgingPlanAdjustData.ts',
  'src/data/plan/monthlyAgingPlanDetailData.ts',
];

files.forEach(file => {
  let content = fs.readFileSync(file, 'utf8');
  let iter = 0;
  content = content.replace(/\{\s*sequenceNumber/g, () => {
    iter++;
    return `{ id: 'item-${iter}', sequenceNumber`;
  });
  fs.writeFileSync(file, content);
});

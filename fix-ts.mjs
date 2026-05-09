import fs from 'fs';
const files = [
  'src/data/plan/agingPlanCreateData.ts',
  'src/data/plan/monthlyAgingPlanAdjustData.ts',
  'src/data/plan/monthlyAgingPlanDetailData.ts',
  'src/pages/plan/monthly/aging/detail/ExportPreviewModal.tsx',
];

files.forEach(file => {
  let content = fs.readFileSync(file, 'utf8');
  content = content.replace(/processPlanNumber/g, 'sectionPlanNumber');
  fs.writeFileSync(file, content);
});

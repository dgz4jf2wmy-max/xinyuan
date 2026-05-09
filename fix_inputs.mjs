import fs from 'fs';

const files = [
  'src/pages/plan/pool/components/PurchaseOrderApplicationModal.tsx',
  'src/pages/plan/pool/components/NonPurchaseOrderApplicationModal.tsx',
  'src/pages/base/sub-brand/index.tsx',
  'src/pages/plan/annual/create.tsx',
];

files.forEach(file => {
  let content = fs.readFileSync(file, 'utf8');
  content = content.replace(/value=\{d\.deliveryLocation\}/g, "value={d.deliveryLocation ?? ''}");
  content = content.replace(/value=\{d\.deliveryDate\}/g, "value={d.deliveryDate ?? ''}");
  content = content.replace(/value=\{d\.expectedCompletionDate\}/g, "value={d.expectedCompletionDate ?? ''}");
  content = content.replace(/value=\{d\.plannedShippingDate\}/g, "value={d.plannedShippingDate ?? ''}");
  content = content.replace(/value=\{editingItem\?\.brand\}/g, "value={editingItem?.brand ?? ''}");
  content = content.replace(/value=\{editingItem\?\.customerName\}/g, "value={editingItem?.customerName ?? ''}");
  content = content.replace(/value=\{year\}/g, "value={year ?? ''}");
  content = content.replace(/value=\{orderType\}/g, "value={orderType ?? ''}");
  content = content.replace(/value=\{orderDate\}/g, "value={orderDate ?? ''}");
  content = content.replace(/value=\{customer\}/g, "value={customer ?? ''}");
  content = content.replace(/value=\{remarks\}/g, "value={remarks ?? ''}");
  fs.writeFileSync(file, content);
});

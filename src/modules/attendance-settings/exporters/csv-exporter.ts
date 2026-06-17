export function generateCsv(records: any[]): string {
  const header = 'Badge Number,Name,Check Time,Type\n';
  const rows = records
    .map((r) => {
      // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
      const displayType = r.checkType === 'I' ? 'IN' : 'OUT';
      // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
      return `${r.badgeNumber || '-'},${r.name || '-'},${new Date(r.checkTime).toLocaleString()},${displayType}`;
    })
    .join('\n');
  return header + rows;
}

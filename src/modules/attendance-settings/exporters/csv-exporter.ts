const esc = (v: any): string => {
  const s = String(v ?? '-');
  return s.includes(',') || s.includes('"') || s.includes('\n')
    ? `"${s.replace(/"/g, '""')}"`
    : s;
};

const COMPANY_HEADER = (title: string) =>
  'AIRPORT & AVIATION SERVICES (SRI LANKA) LIMITED\n' +
  'BANDARANAIKE INTERNATIONAL AIRPORT\n' +
  'KATUNAYAKE\n' +
  `${title}\n\n`;

export function generateCsv(records: any[], reportType = 'daily'): string {
  const type = reportType.toLowerCase();

  if (type === 'absence') {
    const header = 'Badge Number,Name\n';
    const rows = records
      // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
      .map((r) => `${esc(r.badgeNumber)},${esc(r.name)}`)
      .join('\n');
    return COMPANY_HEADER('ABSENCE REPORT') + header + rows;
  }

  if (type === 'monthly') {
    const header = 'Badge Number,Name,Month,Days Present\n';
    const rows = records
      .map(
        (r) =>
          // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
          `${esc(r.badgeNumber)},${esc(r.name)},${esc(r.month)},${esc(r.daysPresent)}`,
      )
      .join('\n');
    return COMPANY_HEADER('MONTHLY ATTENDANCE REPORT') + header + rows;
  }

  if (type === 'serial') {
    const header = 'Serial No,EPF No,Name\n';
    const rows = records
      // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
      .map((r) => `${esc(r.serialNo)},${esc(r.epfNo)},${esc(r.name)}`)
      .join('\n');
    return COMPANY_HEADER('SERIAL / EPF REPORT') + header + rows;
  }

  // daily (default)
  const header = 'Badge Number,Name,Location,Date,Time,Type\n';
  const rows = records
    .map((r) => {
      // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access,@typescript-eslint/no-unsafe-argument
      const t = new Date(r.checkTime);
      // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
      const displayType = r.checkType === 'I' ? 'I' : 'O';
      return [
        // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
        esc(r.badgeNumber),
        // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
        esc(r.name),
        // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
        esc(r.location),
        esc(t.toLocaleDateString()),
        esc(t.toLocaleTimeString()),
        displayType,
      ].join(',');
    })
    .join('\n');
  return COMPANY_HEADER('DAILY ATTENDANCE REPORT') + header + rows;
}

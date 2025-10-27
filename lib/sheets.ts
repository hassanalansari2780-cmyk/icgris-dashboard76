import { google } from 'googleapis';

const SCOPES = ['https://www.googleapis.com/auth/spreadsheets.readonly'];

function getPrivateKey() {
  // Supports both newline and \n-escaped formats
  const raw = process.env.GOOGLE_SERVICE_ACCOUNT_KEY || '';
  return raw.includes('\\n') ? raw.replace(/\\n/g, '\n') : raw;
}

export async function getSheetsClient() {
  const auth = new google.auth.JWT(
    process.env.GOOGLE_SERVICE_ACCOUNT_EMAIL,
    undefined,
    getPrivateKey(),
    SCOPES
  );
  const sheets = google.sheets({ version: 'v4', auth });
  return sheets;
}

export async function readRange(range: string) {
  const sheets = await getSheetsClient();
  const spreadsheetId = process.env.GOOGLE_SHEETS_SPREADSHEET_ID!;
  const res = await sheets.spreadsheets.values.get({ spreadsheetId, range });
  const values = res.data.values || [];
  if (values.length === 0) return [];
  const [header, ...rows] = values;
  return rows.map((r) => {
    const obj: Record<string, any> = {};
    header.forEach((h: string, i: number) => (obj[h] = r[i] ?? ''));
    return obj;
  });
}

// Small parsers
export const num = (v: any) => (v === '' || v == null ? null : Number(v));
export const str = (v: any) => (v == null ? '' : String(v));

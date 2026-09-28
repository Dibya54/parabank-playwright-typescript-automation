import * as XLSX from 'xlsx';

export class ExcelReader {

  static readExcel(
    filePath: string,
    sheetName: string
  ): Record<string, string>[] {

    const workbook = XLSX.readFile(filePath);

    const worksheet = workbook.Sheets[sheetName];

    if (!worksheet) {
      throw new Error(
        `Sheet "${sheetName}" was not found in the Excel file.`
      );
    }

    const data = XLSX.utils.sheet_to_json<Record<string, string>>(
      worksheet,
      {
        raw: false
      }
    );

    return data;
  }
}
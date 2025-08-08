import * as FileSystem from 'expo-file-system';
import * as Sharing from 'expo-sharing';
import * as XLSX from 'xlsx';
import { Platform } from 'react-native';

export async function downloadExcel({ allDevices = [], filteredDevices = [], searchQuery = '' }) {
  const dataToExport = (searchQuery && searchQuery.trim()) ? filteredDevices : allDevices;

  if (!dataToExport || dataToExport.length === 0) {
    alert('No data to export');
    return;
  }

  // Create workbook
  const ws = XLSX.utils.json_to_sheet(dataToExport);
  const wb = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(wb, ws, 'ScanData');

  const fileName = 'scan-data.xlsx';

  if (Platform.OS === 'web') {
    const wbout = XLSX.write(wb, { bookType: 'xlsx', type: 'array' });
    const blob = new Blob([wbout], { type: 'application/octet-stream' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = fileName;
    link.click();
    URL.revokeObjectURL(link.href);
    return;
  }

  // Mobile: write base64 and share
  const base64 = XLSX.write(wb, { bookType: 'xlsx', type: 'base64' });
  const fileUri = FileSystem.documentDirectory + fileName;

  try {
    await FileSystem.writeAsStringAsync(fileUri, base64, { encoding: FileSystem.EncodingType.Base64 });
    if (await Sharing.isAvailableAsync()) {
      await Sharing.shareAsync(fileUri);
    } else {
      alert('File saved to: ' + fileUri);
    }
  } catch (err) {
    console.error('Export failed', err);
    alert('Failed to export file.');
  }
}

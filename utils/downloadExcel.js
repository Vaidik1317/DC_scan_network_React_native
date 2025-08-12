import * as FileSystem from "expo-file-system";
import { StorageAccessFramework } from "expo-file-system";
import { Platform } from "react-native";
import * as XLSX from "xlsx";

export async function downloadExcel({
  allDevices = [],
  filteredDevices = [],
  searchQuery = "",
}) {
  const dataToExport =
    searchQuery && searchQuery.trim() ? filteredDevices : allDevices;

  if (!dataToExport || dataToExport.length === 0) {
    alert("No data to export");
    return;
  }

  // Create workbook
  const ws = XLSX.utils.json_to_sheet(dataToExport);
  const wb = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(wb, ws, "ScanData");

  const fileName = "scan-data.xlsx";

  // Web
  if (Platform.OS === "web") {
    const wbout = XLSX.write(wb, { bookType: "xlsx", type: "array" });
    const blob = new Blob([wbout], { type: "application/octet-stream" });
    const link = document.createElement("a");
    link.href = URL.createObjectURL(blob);
    link.download = fileName;
    link.click();
    URL.revokeObjectURL(link.href);
    return;
  }

  // Mobile
  const base64 = XLSX.write(wb, { bookType: "xlsx", type: "base64" });

  if (Platform.OS === "android") {
    try {
      // Ask user to pick a folder (e.g., Downloads)
      const permissions =
        await StorageAccessFramework.requestDirectoryPermissionsAsync();
      if (!permissions.granted) {
        alert("Permission required to save the file.");
        return;
      }

      // Create file inside chosen directory
      const fileUri = await StorageAccessFramework.createFileAsync(
        permissions.directoryUri,
        fileName,
        "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
      );

      // Write to file
      await FileSystem.writeAsStringAsync(fileUri, base64, {
        encoding: FileSystem.EncodingType.Base64,
      });

      alert(`File saved as ${fileName}`);
    } catch (err) {
      console.error("Export failed", err);
      alert("Failed to export file.");
    }
  } else {
    // iOS: fall back to app's Documents directory
    const fileUri = FileSystem.documentDirectory + fileName;
    await FileSystem.writeAsStringAsync(fileUri, base64, {
      encoding: FileSystem.EncodingType.Base64,
    });
    alert(`File saved inside app storage: ${fileUri}`);
  }
}

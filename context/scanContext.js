import React, { createContext, useCallback, useContext, useState } from "react";

const ScanContext = createContext();

export const ScanProvider = ({ children }) => {
  const [trigger, setTrigger] = useState(false);
  const [allDevices, setAllDevices] = useState([]);
  const [filteredDevices, setFilteredDevices] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  console.log(allDevices);
  const triggerScan = useCallback(() => setTrigger(true), []);
  const resetTrigger = useCallback(() => setTrigger(false), []);

  return (
    <ScanContext.Provider
      value={{
        trigger,
        triggerScan,
        resetTrigger,
        allDevices,
        setAllDevices,
        filteredDevices,
        setFilteredDevices,
        searchQuery,
        setSearchQuery,
      }}
    >
      {children}
    </ScanContext.Provider>
  );
};

export const useScan = () => useContext(ScanContext);

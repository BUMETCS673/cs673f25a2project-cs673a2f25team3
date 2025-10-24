import { createContext, useState } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";

/*
	100% Human
*/

export const LocalStorage = createContext();

export const LocalStorageProvider = ({ children }) => {
  const storeData = async (value) => {
		const previousData = getData();
		const updatedData = {...previousData, ...value}
		try {
			const jsonValue = JSON.stringify(updatedData);
			await AsyncStorage.setItem('data', jsonValue);
		} catch (e) {
			// saving error
		}
	};
	const getData = async () => {
		try {
			const jsonValue = await AsyncStorage.getItem('data');
			return jsonValue != null ? JSON.parse(jsonValue) : null;
		} catch (e) {
			// error reading value
		}
	};

  return (
    <LocalStorage.Provider value={{ storeData, getData }}>
      {children}
    </LocalStorage.Provider>
  );
};

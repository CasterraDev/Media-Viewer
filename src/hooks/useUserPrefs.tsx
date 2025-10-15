import { UserPrefs } from "@/_types/type";
import { getDefaultFilterPrimative } from "@/utils/clientUtil";
import { useEffect, useState } from "react";

const defaultUserPrefs: UserPrefs = {
  sortType: "",
  mediaRoots: [],
  mediaLoop: false,
  mediaAutoplay: false,
  savedFilter: getDefaultFilterPrimative()
}

const getLocalStorage = (key: string): UserPrefs => {
  let currentValue;
  try {
    currentValue = JSON.parse(
      localStorage.getItem(key) || JSON.stringify(defaultUserPrefs)
    );
  } catch (error) {
    return defaultUserPrefs;
  }

  return currentValue;
}

const useUserPrefs = (subdomain: string) => {
  const key = `user-prefs-${subdomain}`

  const [value, setValue] = useState<UserPrefs>(() => {
    if (!subdomain) return defaultUserPrefs;
    return getLocalStorage(key)
  });

  useEffect(() => {
    if (!subdomain) return;
    const currentValue = getLocalStorage(key);
    setValue(currentValue);
  }, [subdomain])

  useEffect(() => {
    if (!subdomain || !value) return;
    localStorage.setItem(key, JSON.stringify(value))
  }, [value])

  const updateUserPrefs = (userPref: Partial<UserPrefs>) => {
    if (!subdomain) return;
    const currentValue = getLocalStorage(key);
    const updatedUserPrefs = { ...currentValue, ...userPref }
    setValue(updatedUserPrefs);
  }

  return { userPrefs: value, updateUserPrefs };
};

export default useUserPrefs;

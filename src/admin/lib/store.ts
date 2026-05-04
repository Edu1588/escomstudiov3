export const getLocalData = (key: string, defaultValue: any) => {
  const data = localStorage.getItem(key);
  return data ? JSON.parse(data) : defaultValue;
};

export const setLocalData = (key: string, value: any) => {
  localStorage.setItem(key, JSON.stringify(value));
};

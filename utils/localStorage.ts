export function saveToLocalStorage(key: string, data: any): void {
  localStorage.setItem(key, JSON.stringify(data))
}

export function loadFromLocalStorage(key: string): any {
  const data = localStorage.getItem(key)
  return data ? JSON.parse(data) : null
}


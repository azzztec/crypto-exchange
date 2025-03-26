const API_URL = 'https://namig.pro/api'

const apiInstance = {
  get: (url: string, init?: RequestInit) =>
    fetch(`${API_URL}${url}`, { ...init, method: 'GET' }),
}

export default apiInstance

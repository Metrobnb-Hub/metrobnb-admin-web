export const useClearCache = () => {
  const clearAll = () => {
    // Clear cookies
    const cookies = document.cookie.split(";")
    cookies.forEach(cookie => {
      const eqPos = cookie.indexOf("=")
      const name = eqPos > -1 ? cookie.substr(0, eqPos) : cookie
      document.cookie = name + "=;expires=Thu, 01 Jan 1970 00:00:00 GMT;path=/"
    })
    
    // Clear storage
    localStorage.clear()
    sessionStorage.clear()
    
    // Reload
    window.location.reload()
  }
  
  return { clearAll }
}

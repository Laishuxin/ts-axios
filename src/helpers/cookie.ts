const cookie = {
  read(cookieName: string): string | null {
    const match = document.cookie.match(new RegExp('(^|;\\s*)(' + cookieName + ')=([^;]*)'))
    return match ? match[3] : null
  }
}
export default cookie

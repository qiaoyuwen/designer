export const base64ToFile = (dataurl: string, filename = 'file') => {
  let arr = dataurl.split(',')
  if (arr.length <= 0) { return undefined }
  let mime = arr[0].match(/:(.*?);/)![1]
  let suffix = mime.split('/')[1]
  let bstr = atob(arr[1])
  let n = bstr.length
  let u8arr = new Uint8Array(n)
  while (n--) {
    u8arr[n] = bstr.charCodeAt(n)
  }
  return new File([u8arr], `${filename}.${suffix}`, {
    type: mime
  })
}

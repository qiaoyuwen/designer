import { HttpUtils } from '@/http/request'

export async function uploadFileRequest (file: File): Promise<string | undefined> {
  const formData = new FormData();
  formData.append('file', file);
  return HttpUtils.postJson('/file/upload', formData).then(res => {
    return (res as string)
  })
    .catch(() => {
      return undefined;
    })
}

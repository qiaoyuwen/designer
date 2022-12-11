import { HttpUtils } from '@/http/request'
import { ApiConfig } from '@/configs/api'

export async function uploadFileRequest (file: File): Promise<string | undefined> {
  const formData = new FormData();
  formData.append('file', file);
  return HttpUtils.postJson(ApiConfig.main.fileUpload, formData).then(res => {
    return (res as string)
  })
    .catch(() => {
      return undefined;
    })
}

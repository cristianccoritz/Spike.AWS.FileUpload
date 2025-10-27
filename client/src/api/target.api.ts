import axios from 'axios'
import UpsertTargetRequest from 'models/UpsertTargetRequest'
import FileUploadResponse from 'models/FileUploadResponse'

const apiUrl = process.env.REACT_APP_DNC_URL
const uploadApiUrl =
  'https://f1wmw8xa65.execute-api.us-east-2.amazonaws.com/Prod/api/oid'

class TargetApi {
  public static create = async (
    request: UpsertTargetRequest
  ): Promise<string> => {
    const response = await axios.post<string>(`${apiUrl}/targets`, request)

    return response.data
  }

  public static update = async (
    request: UpsertTargetRequest
  ): Promise<string> => {
    const response = await axios.put<string>(
      `${apiUrl}/targets/${request.targetId}`,
      request
    )

    return response.data
  }

  public static upload = async (
    data: File,
    channel: string
  ): Promise<FileUploadResponse> => {
    const formData = new FormData()

    formData.append('file', data)
    formData.append('channel', channel)

    const response = await axios.post<FileUploadResponse>(
      `${uploadApiUrl}/fileupload`,
      formData,
      {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      }
    )

    return response.data
  }
}

export default TargetApi

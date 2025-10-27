import { MailAddressParams } from './MailAddress'

class FileUploadResponse {
  total: number
  channel: string
  mailAddressList: MailAddressParams[]

  constructor(
    total: number,
    channel: string,
    mailAddressList: MailAddressParams[]
  ) {
    this.total = total
    this.channel = channel
    this.mailAddressList = mailAddressList
  }
}

export default FileUploadResponse

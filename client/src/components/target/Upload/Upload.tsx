import {
  Alert,
  Button,
  CircularProgress,
  Dialog,
  DialogContent,
  DialogTitle,
  FormControl,
  InputLabel,
  MenuItem,
  Select
} from '@mui/material'
import React, { useEffect, useState } from 'react'
import {
  ECActions,
  StyledContainerGrid,
  StyledItemGrid,
  VisuallyHiddenInput,
  SCResultsWrapper
} from './styles'
import { Column, EntityResults } from '@tranzact/platform_react-components'
import { ECAlertMessage, ECSpinner } from './styles'
import Target from 'models/Target'
import SaveResponse from 'models/SaveResponse'
import CloudUploadIcon from '@mui/icons-material/CloudUpload'
import DncList from 'models/DncList'
import { channels } from 'consts/channels'
import TargetApi from 'api/target.api'
import { Sorting, OrderBy } from 'models'
import { fileUploadedColumns } from 'consts/gridColumns'
import FileUploadResponse from 'models/FileUploadResponse'

export interface UploadProps {
  isOpen: boolean
  handleClose: () => void
  targetValue?: Target | null
}

const Upload: React.FC<UploadProps> = ({ isOpen, handleClose }) => {
  const isEdit: boolean = false
  const mailChannel = channels.find(c => c.value.toLowerCase() == 'mail')

  const [isInitialLoading, setIsInitialLoading] = useState(false)
  const [response, setResponse] = useState<SaveResponse | null>(null)
  const [openAlert, setOpenAlert] = useState(false)
  const [file, setFile] = useState<File | null>(null)
  const [fileName, setFileName] = useState<string | null>(null)
  const [isSaving, setIsSaving] = useState(false)
  const [isSaved, setIsSaved] = useState(false)
  const [fileUploadResponse, setFileUploadResponse] =
    useState<FileUploadResponse | null>(null)

  const [target, setTarget] = useState<{
    channel: string | undefined
    dncLists: DncList[]
    value: string | undefined
    notes: string | undefined
  }>({
    channel: mailChannel?.key,
    dncLists: [],
    value: '',
    notes: ''
  })

  const sort = {
    by: 'street1',
    isAsc: true
  }

  useEffect(() => {
    if (!isInitialLoading) {
      setIsInitialLoading(true)

      return
    }
  }, [isInitialLoading])

  useEffect(() => {
    if (openAlert === false) return

    const timer = setTimeout(() => handleCloseAlert(), 300000)
    return () => clearTimeout(timer)
  }, [openAlert])

  const handleSave = async (): Promise<void> => {
    setOpenAlert(false)
    setIsSaving(true)

    let response = await TargetApi.upload(file!, target.channel!)
    let message = `Total of "${response.total}" mail addresses processed for "${response.channel}" channel`

    setFileUploadResponse(response)
    setResponse(new SaveResponse(message))
    setIsSaving(false)
    setIsSaved(true)
    setOpenAlert(true)
  }

  const handleCloseAlert = async () => {
    setOpenAlert(false)
    handleClose()
  }

  const handleFieldChange = (field: string, value: any): void => {
    if (field == 'channel') {
      changeChannel(target.channel!)
      return
    }

    setTarget({
      ...target,
      [field]: value
    })
  }

  const handleSelect = (id: string): void => {}

  const handleSort = async (sortArgs: {
    by: string
    isAsc: boolean
  }): Promise<void> => {
    const sorting = new Sorting(
      sortArgs.by,
      sortArgs.isAsc ? OrderBy.Asc : OrderBy.Desc
    )
  }

  const handleFileChange = (target: HTMLInputElement) => {
    let file = target.files![0]

    if (file) {
      setFile(file)
      setFileName(file.name)
    }
  }

  const changeChannel = (selectedChannel: string): void => {
    setTarget({
      ...target,
      ['channel']: selectedChannel
    })
  }

  const formattedColumns = fileUploadedColumns
    .filter(column => !!column.isVisible)
    .map(column => {
      const formatted: Column = JSON.parse(JSON.stringify(column))
      return formatted
    })

  const formattedResults = fileUploadResponse?.mailAddressList.map(row => {
    const formatted = JSON.parse(JSON.stringify(row))
    return formatted
  })

  return (
    <Dialog
      id="modal-upload-targets"
      fullWidth
      open={isOpen}
      sx={{
        '& .MuiPaper-root': {
          overflowY: 'visible'
        }
      }}
    >
      <DialogTitle>Upload Targets</DialogTitle>
      <DialogContent style={{ padding: 0, paddingTop: '10px' }}>
        <form>
          <StyledContainerGrid container>
            <StyledItemGrid>
              <div>
                <FormControl fullWidth>
                  <InputLabel id="channel-label">Channel</InputLabel>
                  <Select
                    value={target.channel}
                    labelId="channel-label"
                    label="Channel"
                    error={!target.channel}
                    required
                    onChange={e => handleFieldChange('channel', e.target.value)}
                    inputProps={{
                      'data-testid': 'channel-selector'
                    }}
                    disabled={isSaving || isEdit || isSaved}
                  >
                    {channels.map(({ key, value }) => (
                      <MenuItem key={key} value={key}>
                        {value}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </div>
            </StyledItemGrid>
            <StyledItemGrid xs={6}>
              <div>
                <FormControl fullWidth size="medium">
                  <Button
                    component="label"
                    variant="contained"
                    startIcon={<CloudUploadIcon />}
                  >
                    Upload file
                    <VisuallyHiddenInput
                      type="file"
                      onChange={e => {
                        handleFileChange(e.target)
                      }}
                    />
                  </Button>
                </FormControl>
              </div>
            </StyledItemGrid>
            <StyledItemGrid xs={6}>
              <FormControl>
                {fileName && (
                  <p style={{ fontSize: 14 }}>Selected file: {fileName}</p>
                )}
              </FormControl>
            </StyledItemGrid>

            <StyledItemGrid>
              <ECActions>
                <Button
                  variant="outlined"
                  onClick={handleClose}
                  disabled={isSaving || isSaved}
                  style={{ marginRight: '10px' }}
                >
                  Cancel
                </Button>
                <Button
                  variant="contained"
                  onClick={handleSave}
                  disabled={isSaving}
                >
                  {isSaving ? (
                    <>
                      Sending...
                      <ECSpinner>
                        <CircularProgress color="primary" size={20} />
                      </ECSpinner>
                    </>
                  ) : (
                    <>Send</>
                  )}
                </Button>
              </ECActions>
            </StyledItemGrid>

            {openAlert && response && (
              <StyledItemGrid>
                <ECAlertMessage>
                  <Alert
                    severity={response.successful ? 'success' : 'error'}
                    onClose={handleCloseAlert}
                  >
                    {response.message}
                  </Alert>
                </ECAlertMessage>
              </StyledItemGrid>
            )}
          </StyledContainerGrid>
          {openAlert && response && (
            <StyledItemGrid>
              <SCResultsWrapper>
                <EntityResults
                  stickyHeader
                  columns={formattedColumns}
                  results={formattedResults}
                  size="small"
                  sort={sort}
                  onSelectRow={handleSelect}
                  onSort={handleSort}
                />
              </SCResultsWrapper>
            </StyledItemGrid>
          )}
        </form>
      </DialogContent>
    </Dialog>
  )
}

export default Upload

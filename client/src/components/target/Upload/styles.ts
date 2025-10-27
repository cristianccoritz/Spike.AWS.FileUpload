import { Grid } from '@mui/material'
import styled from 'styled-components'

const xsSize = 300
const smSize = 400
const mdSize = 600
const spinnerSize = 30

enum ResizeElements {
  Source = '.audits-page-container .top-section',
  Target = '.audits-page-container .table-container'
}

const createObserver = (): ResizeObserver =>
  new ResizeObserver(entries => {
    const difference = entries[0].contentRect.height - 0
    const addition = difference > 0 ? difference : 0
    const tableEl: HTMLDivElement | null = document.querySelector(
      ResizeElements.Target
    )

    if (tableEl) {
      tableEl.style.setProperty('height', `calc(100vh - ${230 + addition}px)`)
    }
  })

export const VisuallyHiddenInput = styled('input')({
      clip: 'rect(0 0 0 0)',
      clipPath: 'inset(50%)',
      height: 1,
      overflow: 'hidden',
      position: 'absolute',
      bottom: 0,
      left: 0,
      whiteSpace: 'nowrap',
      width: 1
    });

export const ECAutoCompleteField = styled('div')`
  ${({ theme }) =>
    theme.unstable_sx({ width: { xs: xsSize, sm: smSize, md: mdSize } })};

  &[aria-disabled='true'] {
    width: ${xsSize - spinnerSize + 'px'};
    width: ${({ theme }) =>
      theme.unstable_sx({
        width: {
          xs: xsSize - spinnerSize,
          sm: smSize - spinnerSize,
          md: mdSize - spinnerSize
        }
      })};

    #list-selector-label {
      color: rgba(0, 0, 0, 0.6);
      span {
        color: rgba(0, 0, 0, 0.6);
      }
    }
  }
`

export const StyledContainerGrid = styled(Grid)`
  padding-left: 24px;
  padding-right: 24px;
`

export const StyledItemGrid = styled(Grid)`
  margin-bottom: 20px !important;
  padding: 5px;
  width: 100%;
`

export const ECActions = styled('div')`
  margin-top: ${({ theme }) => theme.spacing(2)};
  text-align: right;

  a:first-of-type {
    margin-right: 20px;
  }
`

export const ECSpinner = styled('span')`
  padding-left: 10px;
  display: flex;
`

export const ECAlertMessage = styled('div')(({ theme }) =>
  theme.unstable_sx({ width: 'auto' })
)

export const SCResultsWrapper = styled('div')`
  & .table-container {
    ${() => {
      const sourceEl = document.querySelector(ResizeElements.Source)
      const difference = sourceEl
        ? sourceEl.getBoundingClientRect().height - 0
        : 0
      return `height: calc(50vh - ${difference > 0 ? difference : 0}px);`
    }}

    th {
      background-color: ${({ theme }) => theme.dataTable.headerBackground};
      padding: 16px;
    }
  }

  & .results-pagination {
    justify-content: flex-end;
  }

  & td {
    padding: 12px 15px !important;
  }
`
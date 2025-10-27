import { Column, TableCellType } from '@tranzact/platform_react-components'

export const targetColumns = [
  new Column({
    name: 'id',
    label: 'Id',
    isVisible: false,
    isAsc: true,
    align: 'left',
    isSortable: false,
    defaultSort: false,
    cell: {
      type: TableCellType.SingleText,
      truncateText: false,
      maxWidth: 100
    }
  }),
  new Column({
    name: 'formattedValue',
    label: 'Target',
    isVisible: true,
    isAsc: true,
    align: 'left',
    isSortable: false,
    defaultSort: false,
    cell: {
      type: TableCellType.SingleText,
      truncateText: false,
      maxWidth: 300
    }
  }),
  new Column({
    name: 'channel',
    label: 'Channel',
    isVisible: true,
    isAsc: true,
    align: 'left',
    isSortable: false,
    defaultSort: false,
    cell: {
      type: TableCellType.SingleText,
      truncateText: false,
      maxWidth: 10
    }
  }),
  new Column({
    name: 'dncLists',
    label: 'DNC Lists',
    isVisible: true,
    isAsc: true,
    align: 'left',
    isSortable: false,
    defaultSort: false,
    cell: {
      type: TableCellType.SingleText,
      truncateText: false,
      maxWidth: 250
    }
  }),
  new Column({
    name: 'id',
    label: 'Action',
    isVisible: true,
    isAsc: true,
    align: 'left',
    isSortable: false,
    defaultSort: false,
    cell: {
      type: TableCellType.Action,
      maskable: true,
      truncateText: false,
      maxWidth: 10
    },
    minWidth: 10
  })
]

export const reasonColumns = [
  new Column({
    name: 'id',
    label: 'Id',
    isVisible: false,
    isAsc: true,
    align: 'left',
    isSortable: false,
    defaultSort: false,
    cell: {
      type: TableCellType.SingleText,
      truncateText: false,
      maxWidth: 100
    }
  }),
  new Column({
    name: 'name',
    label: 'Name',
    isVisible: true,
    isAsc: true,
    align: 'left',
    isSortable: true,
    defaultSort: true,
    cell: {
      type: TableCellType.SingleText,
      truncateText: false,
      maxWidth: 100
    }
  }),
  new Column({
    name: 'type',
    label: 'Type',
    isVisible: true,
    isAsc: true,
    align: 'left',
    isSortable: true,
    defaultSort: true,
    cell: {
      type: TableCellType.SingleText,
      truncateText: false,
      maxWidth: 100
    }
  }),
  new Column({
    name: 'dncLists',
    label: 'DNC Lists',
    isVisible: true,
    isAsc: true,
    align: 'left',
    isSortable: true,
    defaultSort: false,
    cell: {
      type: TableCellType.SingleText,
      truncateText: false,
      maxWidth: 100
    }
  }),
  new Column({
    name: 'litigatorsCheck',
    label: 'Litigators Check',
    isVisible: true,
    isAsc: true,
    align: 'left',
    isSortable: false,
    defaultSort: false,
    cell: {
      type: TableCellType.SingleText,
      truncateText: false,
      maxWidth: 100
    },
    minWidth: 100
  }),
    new Column({
    name: 'dncBubbleCheck',
    label: 'DNC Bubble Check',
    isVisible: true,
    isAsc: true,
    align: 'left',
    isSortable: false,
    defaultSort: false,
    cell: {
      type: TableCellType.SingleText,
      truncateText: false,
      maxWidth: 100
    },
    minWidth: 100
  }),
  new Column({
    name: 'action',
    label: 'Action',
    isVisible: true,
    isAsc: true,
    align: 'left',
    isSortable: false,
    defaultSort: false,
    cell: {
      type: TableCellType.Action,
      maskable: true,
      truncateText: false,
      maxWidth: 100
    },
    minWidth: 100
  })
]

export const dncListColumns = [
  new Column({
    name: 'id',
    label: 'Id',
    isVisible: false,
    isAsc: true,
    align: 'left',
    isSortable: false,
    defaultSort: false,
    cell: {
      type: TableCellType.SingleText,
      truncateText: false,
      maxWidth: 100
    }
  }),
  new Column({
    name: 'name',
    label: 'Name',
    isVisible: true,
    isAsc: true,
    align: 'center',
    isSortable: true,
    defaultSort: true,
    cell: {
      type: TableCellType.SingleText,
      truncateText: false,
      maxWidth: 100
    }
  }),
  new Column({
    name: 'channel',
    label: 'Channel',
    isVisible: true,
    isAsc: true,
    align: 'center',
    isSortable: true,
    defaultSort: false,
    cell: {
      type: TableCellType.SingleText,
      truncateText: false,
      maxWidth: 100
    }
  }),
  new Column({
    name: 'type',
    label: 'Type',
    isVisible: true,
    isAsc: true,
    align: 'center',
    isSortable: true,
    defaultSort: false,
    cell: {
      type: TableCellType.SingleText,
      truncateText: false,
      maxWidth: 100
    }
  })
]

export const fileUploadedColumns = [
  new Column({
    name: 'street1',
    label: 'Street 1',
    isVisible: true,
    isAsc: true,
    align: 'left',
    isSortable: false,
    defaultSort: true,
    cell: {
      type: TableCellType.SingleText,
      truncateText: false,
      maxWidth: 100
    }
  }),
  new Column({
    name: 'street2',
    label: 'Street 2',
    isVisible: true,
    isAsc: true,
    align: 'left',
    isSortable: false,
    defaultSort: false,
    cell: {
      type: TableCellType.SingleText,
      truncateText: false,
      maxWidth: 100
    }
  }),
  new Column({
    name: 'city',
    label: 'City',
    isVisible: true,
    isAsc: true,
    align: 'center',
    isSortable: false,
    defaultSort: false,
    cell: {
      type: TableCellType.SingleText,
      truncateText: false,
      maxWidth: 100
    }
  }),
  new Column({
    name: 'state',
    label: 'State',
    isVisible: true,
    isAsc: true,
    align: 'center',
    isSortable: false,
    defaultSort: false,
    cell: {
      type: TableCellType.SingleText,
      truncateText: false,
      maxWidth: 50
    }
  }),
  new Column({
    name: 'zipCode',
    label: 'ZIP Code',
    isVisible: true,
    isAsc: true,
    align: 'center',
    isSortable: false,
    defaultSort: false,
    cell: {
      type: TableCellType.SingleText,
      truncateText: false,
      maxWidth: 50
    }
  })
]

// Column definition for components/Tables/DataTable.vue.
// `type` decides how a column is sorted and which filter its header shows:
//   text   -> substring search        number -> min/max range
//   date   -> start/end date range    select -> pick one of `options`
export type DataTableColumnType = 'text' | 'number' | 'date' | 'select'

export interface DataTableColumn<T> {
    id: string
    header: string
    value: (row: T) => unknown
    type?: DataTableColumnType
    options?: { label: string, value: string }[]
    display?: (row: T) => string | number
    sortable?: boolean
    // Sort this column newest/largest first when its sort is switched on.
    sortDesc?: boolean
    filterable?: boolean
    align?: 'center'
    class?: string
}

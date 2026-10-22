<template>
    <div class="flex-1 min-w-0 p-8">
        <div v-if="$slots.toolbar" class="mb-3 flex flex-wrap items-center gap-3">
            <slot name="toolbar" :selected-rows="selectedRows" :get-visible-rows="getVisibleRows" />
        </div>
        <div ref="card" class="bg-white rounded-lg shadow-lg overflow-hidden" :class="containerClass">
            <UTable
                ref="table"
                :style="{ maxHeight: tableMaxHeight }"
                v-model:column-filters="columnFilters"
                v-model:row-selection="rowSelection"
                v-model:column-pinning="columnPinning"
                :sorting="sorting"
                :data="data"
                :columns="tableColumns"
                :get-row-id="getRowId"
                :row-selection-options="{ enableRowSelection: (row) => canSelect ? canSelect(row.original) : true }"
                :meta="{ class: { tr: 'group' } }"
                :empty="empty"
                sticky
                :ui="mergedUi"
            >
                <template v-for="col in columns" :key="col.id" #[`${col.id}-header`]="{ column }">
                    <div class="flex items-center gap-2 whitespace-nowrap" :class="{ 'justify-center': col.align === 'center' }">
                        <span>{{ col.header }}</span>

                        <UPopover v-if="column.getCanFilter()">
                            <button
                                type="button"
                                class="p-0.5 rounded cursor-pointer"
                                :class="{ 'bg-white text-blue-700': column.getIsFiltered() }"
                                :aria-label="`Filter ${col.header}`"
                            >
                                <FunnelIcon class="w-4 h-4" />
                            </button>
                            <template #content>
                                <div class="p-3 w-64 flex flex-col gap-2 text-sm text-[#2d3e4d]">
                                    <p class="font-semibold">Filter {{ col.header }}</p>

                                    <input
                                        v-if="(col.type ?? 'text') === 'text'"
                                        autocomplete="off"
                                        autofocus
                                        class="px-2 py-1 border border-gray-300 rounded"
                                        :placeholder="`Search ${col.header}`"
                                        :value="column.getFilterValue() ?? ''"
                                        @input="column.setFilterValue(($event.target as HTMLInputElement).value || undefined)"
                                    />

                                    <select
                                        v-else-if="col.type === 'select'"
                                        class="px-2 py-1 border border-gray-300 rounded bg-white"
                                        :value="column.getFilterValue() ?? ''"
                                        @change="column.setFilterValue(($event.target as HTMLSelectElement).value || undefined)"
                                    >
                                        <option value="">All</option>
                                        <option v-for="opt in col.options" :key="opt.value" :value="opt.value">{{ opt.label }}</option>
                                    </select>

                                    <template v-else>
                                        <label class="flex flex-col gap-1">
                                            {{ col.type === 'date' ? 'Start date' : 'Minimum' }}
                                            <input
                                                :type="col.type"
                                                autocomplete="off"
                                                class="px-2 py-1 border border-gray-300 rounded"
                                                :value="(column.getFilterValue() as RangeFilter | undefined)?.min ?? ''"
                                                @input="setRangeFilter(column, 'min', ($event.target as HTMLInputElement).value)"
                                            />
                                        </label>
                                        <label class="flex flex-col gap-1">
                                            {{ col.type === 'date' ? 'End date' : 'Maximum' }}
                                            <input
                                                :type="col.type"
                                                autocomplete="off"
                                                class="px-2 py-1 border border-gray-300 rounded"
                                                :value="(column.getFilterValue() as RangeFilter | undefined)?.max ?? ''"
                                                @input="setRangeFilter(column, 'max', ($event.target as HTMLInputElement).value)"
                                            />
                                        </label>
                                    </template>

                                    <button
                                        v-if="column.getIsFiltered()"
                                        type="button"
                                        class="self-start text-xs text-blue-700 hover:underline cursor-pointer"
                                        @click="column.setFilterValue(undefined)"
                                    >
                                        Clear filter
                                    </button>
                                </div>
                            </template>
                        </UPopover>

                        <!-- Each column's sort is switched on/off independently; active sorts apply in column order. -->
                        <button
                            v-if="column.getCanSort()"
                            type="button"
                            class="cursor-pointer"
                            :class="{ 'bg-[#c8c9c9] outline-double outline-black': activeSorts.has(col.id) }"
                            :aria-label="`Sort by ${col.header}`"
                            :aria-pressed="activeSorts.has(col.id)"
                            @click="toggleSort(col.id)"
                        >
                            <NumberedListIcon class="w-4 h-4" />
                        </button>
                    </div>
                </template>

                <template #select-header="{ table }">
                    <div class="flex justify-center gap-2">
                        <span>Select</span>
                        <input
                            type="checkbox"
                            class="cursor-pointer"
                            aria-label="Select all"
                            :checked="table.getIsAllPageRowsSelected()"
                            @change="table.toggleAllPageRowsSelected(($event.target as HTMLInputElement).checked)"
                        />
                    </div>
                </template>
                <template #select-cell="{ row }">
                    <div class="flex justify-center">
                        <input
                            v-if="row.getCanSelect()"
                            type="checkbox"
                            class="cursor-pointer"
                            aria-label="Select row"
                            :checked="row.getIsSelected()"
                            @change="row.toggleSelected(($event.target as HTMLInputElement).checked)"
                        />
                    </div>
                </template>

                <template v-for="col in customCellColumns" :key="col.id" #[`${col.id}-cell`]="{ row }">
                    <slot :name="`${col.id}-cell`" :row="row.original" />
                </template>

                <template #actions-cell="{ row }">
                    <div class="flex justify-evenly">
                        <slot name="actions" :row="row.original" />
                    </div>
                </template>
            </UTable>
        </div>
    </div>
</template>

<script setup lang="ts" generic="T">
import type { TableColumn } from '@nuxt/ui';
import { NumberedListIcon } from '@heroicons/vue/24/outline';
import { FunnelIcon } from '@heroicons/vue/24/solid';
import type { DataTableColumn, DataTableColumnType } from '~/types/dataTable';

type RangeFilter = { min?: string, max?: string }
type CellValue = string | number | undefined
// Just the part of a table column the filter popover uses.
type FilterableColumn = { getFilterValue: () => unknown, setFilterValue: (value: unknown) => void }
type TableUi = { root?: string, thead?: string, tbody?: string, tr?: string, th?: string, td?: string }

const props = withDefaults(defineProps<{
    data: T[]
    columns: DataTableColumn<T>[]
    getRowId: (row: T) => string
    selectable?: boolean
    canSelect?: (row: T) => boolean
    // Ids of the columns whose sort starts switched on.
    defaultSorts?: string[]
    empty?: string
    containerClass?: string
    ui?: TableUi
}>(), {
    selectable: false,
    defaultSorts: () => [],
    empty: 'No records found',
});

defineSlots<{
    toolbar?: (props: { selectedRows: T[], getVisibleRows: () => T[] }) => any
    actions?: (props: { row: T }) => any
    // `<column id>-cell` replaces the default text of that column's cells.
    [cell: `${string}-cell`]: (props: { row: T }) => any
}>();

const slots = useSlots();
const customCellColumns = computed(() => props.columns.filter((col) => slots[`${col.id}-cell`]));
const table = useTemplateRef('table');

const activeSorts = ref(new Set(props.defaultSorts));
const sorting = computed(() =>
    props.columns
        .filter((col) => activeSorts.value.has(col.id))
        .map((col) => ({ id: col.id, desc: col.sortDesc ?? false }))
);
function toggleSort(id: string) {
    const next = new Set(activeSorts.value);
    if (!next.delete(id)) {
        next.add(id);
    }
    activeSorts.value = next;
}

const columnFilters = ref<{ id: string, value: unknown }[]>([]);
const rowSelection = ref<Record<string, boolean>>({});
// Actions (and Select) stay pinned on the right so they're reachable when the table scrolls sideways.
const columnPinning = ref<{ left: string[], right: string[] }>({
    left: [],
    right: [...(slots.actions ? ['actions'] : []), ...(props.selectable ? ['select'] : [])],
});

// The table owns its scroll area so the horizontal scrollbar and sticky header stay on screen
// at any window size or zoom level, instead of being pushed below the fold by a long table.
// `table-scrollbar` (assets/css/main.css) keeps its scrollbars visible even where the OS hides them.
// Backgrounds go on the cells (not the row) so pinned cells cover what scrolls under them.
const tableUi: Required<TableUi> = {
    root: 'table-scrollbar max-h-[max(20rem,calc(100dvh-16rem))]',
    // Header/body share the cell colours so no hairline seams show between cells.
    thead: 'bg-[#c5d0d8]',
    tbody: 'divide-y-0 bg-white [&>tr:hover]:bg-[#e8f0f7]',
    tr: 'data-[selected=true]:bg-transparent',
    th: 'px-4 py-3 text-sm font-normal text-[#2d3e4d] bg-[#c5d0d8] border-b-2 border-[#a8b5bf] whitespace-nowrap',
    td: 'px-6 py-4 text-sm text-[#2d3e4d] whitespace-normal bg-white border-b border-gray-200 group-hover:bg-[#e8f0f7]',
};
// Fit the table into the space left below it in the window, so its bottom (horizontal) scrollbar
// is always on screen. Recalculated on resize, which browsers also fire when the page is zoomed.
const MIN_TABLE_HEIGHT = 160;
const card = useTemplateRef<HTMLElement>('card');
const tableMaxHeight = ref<string>();
function fitTableToWindow() {
    if (!card.value) {
        return;
    }
    const top = card.value.getBoundingClientRect().top + window.scrollY;
    // 32px matches the p-8 padding below the card.
    tableMaxHeight.value = `${Math.max(MIN_TABLE_HEIGHT, window.innerHeight - top - 32)}px`;
}
onMounted(() => {
    fitTableToWindow();
    window.addEventListener('resize', fitTableToWindow);
});
onBeforeUnmount(() => window.removeEventListener('resize', fitTableToWindow));

const mergedUi = computed(() => Object.fromEntries(
    Object.entries(tableUi).map(([slot, classes]) => [slot, `${classes} ${props.ui?.[slot as keyof TableUi] ?? ''}`])
));
const pinnedEdge = 'shadow-[-6px_0_6px_-6px_rgba(0,0,0,0.3)]';

// Normalise raw values so empty cells are `undefined` (always sorted last) and
// dates become YYYY-MM-DD strings that compare correctly as text.
function normalize(type: DataTableColumnType, raw: unknown): CellValue {
    if (raw === null || raw === undefined || raw === '') {
        return undefined;
    }
    switch (type) {
        case 'number': {
            const num = Number(raw);
            return Number.isNaN(num) ? undefined : num;
        }
        case 'date': {
            const date = raw instanceof Date ? raw : new Date(String(raw));
            return Number.isNaN(date.getTime()) ? undefined : date.toISOString().split('T')[0];
        }
        default:
            return String(raw);
    }
}

function matchesFilter(type: DataTableColumnType, value: CellValue, filter: unknown) {
    switch (type) {
        case 'select':
            return value === filter;
        case 'number':
        case 'date': {
            const { min, max } = filter as RangeFilter;
            if (value === undefined) {
                return false;
            }
            const toComparable = (bound: string) => type === 'number' ? Number(bound) : bound;
            return (!min || value >= toComparable(min)) && (!max || value <= toComparable(max));
        }
        default:
            return (value ?? '').toString().toLowerCase().includes(String(filter).toLowerCase().trim());
    }
}

function setRangeFilter(column: FilterableColumn, bound: 'min' | 'max', value: string) {
    const next = { ...(column.getFilterValue() as RangeFilter | undefined), [bound]: value || undefined };
    column.setFilterValue(next.min || next.max ? next : undefined);
}

const tableColumns = computed<TableColumn<T>[]>(() => {
    const dataColumns: TableColumn<T>[] = props.columns.map((col) => {
        const type = col.type ?? 'text';
        const align = col.align === 'center' ? 'text-center' : '';
        return {
            id: col.id,
            accessorFn: (row: T) => normalize(type, col.value(row)),
            cell: ({ row }) => {
                if (col.display) {
                    return col.display(row.original);
                }
                const value = row.getValue<CellValue>(col.id);
                return col.options?.find((opt) => opt.value === value)?.label ?? value ?? '';
            },
            enableSorting: col.sortable ?? true,
            enableColumnFilter: col.filterable ?? true,
            sortUndefined: 'last',
            sortingFn: (a, b, id) => {
                const aValue = a.getValue<CellValue>(id)!;
                const bValue = b.getValue<CellValue>(id)!;
                return typeof aValue === 'number' && typeof bValue === 'number'
                    ? aValue - bValue
                    : String(aValue).localeCompare(String(bValue), undefined, { numeric: true, sensitivity: 'base' });
            },
            filterFn: (row, id, filter) => matchesFilter(type, row.getValue<CellValue>(id), filter),
            meta: { class: { th: align, td: `${align} ${col.class ?? ''}` } },
        };
    });

    if (slots.actions) {
        dataColumns.push({
            id: 'actions',
            header: 'Actions',
            enableSorting: false,
            meta: { class: { th: `text-center ${pinnedEdge}`, td: pinnedEdge } },
        });
    }
    if (props.selectable) {
        // Fixed width: the pinned Actions column is offset by this column's `size`, so they must match.
        const selectWidth = 'w-[100px] min-w-[100px] max-w-[100px]';
        dataColumns.push({
            id: 'select',
            size: 100,
            enableSorting: false,
            meta: { class: { th: `text-center ${selectWidth}`, td: `text-center ${selectWidth}` } },
        });
    }
    return dataColumns;
});

const selectedRows = computed(() => props.data.filter((row) => rowSelection.value[props.getRowId(row)]));

// Rows in their current filtered + sorted order (used for CSV export).
function getVisibleRows(): T[] {
    return table.value?.tableApi.getRowModel().rows.map((row) => row.original) ?? [];
}
</script>

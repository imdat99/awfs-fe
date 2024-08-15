import {
    Box,
    Checkbox,
    Table,
    TableBody,
    TableCell,
    TableCellProps,
    TableContainer,
    TableHead,
    TableRow,
} from '@mui/material';
import React, { useMemo } from 'react';
import { randomId } from 'Utils/helper';


export type Render<T> = (v: T, i?: number) => React.ReactNode | JSX.Element | string | number | null;

export interface IColumn<T = any> {
  label?: React.ReactNode;
  headProps?: TableCellProps;
  props?: TableCellProps;
  dataIndex: keyof T;
  key?: string;
  render?: Render<T>;
}

interface EnhancedTableProps<T> {
    rows: T[];
    columns: IColumn<T>[];
    title?: React.ReactNode;
    onSelect?: (selected: string[], isAll: boolean) => void;
    onRowChange?: React.FormEventHandler<HTMLTableRowElement>;
    getRowKey?: (row: T) => string | number;
    onRowClick?: (row: T) => void;
}
const EnhancedTable = <T,>({
    rows,
    columns,
    title,
    onRowChange,
    getRowKey,
    onSelect,
    onRowClick,
}: EnhancedTableProps<T>) => {
    const [selected, setSelected] = React.useState<string[]>([]);

    React.useEffect(() => {
        if (onSelect)
            onSelect(
                selected,
                rows.length > 0 && selected.length === rows.length,
            )
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [rows.length, selected])
    const handleSelectAllClick = (
        event: React.ChangeEvent<HTMLInputElement>,
    ) => {
        if (event.target.checked) {
            const newSelected = rows.map((row, i) => String(getRowKey ? getRowKey(row) : i))
            setSelected(newSelected)
            return
        }
        setSelected([])
    }

    const handleClick = (event: React.MouseEvent<unknown>, id: string) => {
        const selectedIndex = selected.indexOf(id)
        let newSelected: string[] = []

        if (selectedIndex === -1) {
            newSelected = newSelected.concat(selected, id)
        } else if (selectedIndex === 0) {
            newSelected = newSelected.concat(selected.slice(1))
        } else if (selectedIndex === selected.length - 1) {
            newSelected = newSelected.concat(selected.slice(0, -1))
        } else if (selectedIndex > 0) {
            newSelected = newSelected.concat(
                selected.slice(0, selectedIndex),
                selected.slice(selectedIndex + 1),
            )
        }
        setSelected(newSelected)
    }

    const isSelected = (id: string) => selected.indexOf(id) !== -1
    const indeterminate = useMemo(
        () => selected.length > 0 && selected.length < rows.length,
        [rows, selected],
    )
    const checked = useMemo(
        () => rows.length > 0 && selected.length === rows.length,
        [rows, selected],
    )
    return (
        <Box sx={{ width: '100%' }}>
            <TableContainer>
                {title}
                <Table aria-labelledby="tableTitle">
                    <TableHead>
                        <TableRow className='app-table-head'>
                            <TableCell padding="checkbox">
                                <Checkbox
                                    color="primary"
                                    indeterminate={indeterminate}
                                    checked={checked}
                                    onChange={handleSelectAllClick}
                                    inputProps={{
                                        'aria-label': 'select all desserts',
                                    }}
                                />
                            </TableCell>
                            {columns.map(
                                (column, index) =>
                                    column.label && (
                                        <TableCell
                                            className={`app-table-cell cell-${index}`}
                                            {...column?.[
                                                column?.headProps
                                                    ? 'headProps'
                                                    : 'props'
                                            ]}
                                            
                                            key={column.key || index}
                                        >
                                            {column.label}
                                        </TableCell>
                                    ),
                            )}
                        </TableRow>
                    </TableHead>

                    <TableBody>
                        {rows.length === 0 && (
                            <TableRow>
                                <TableCell colSpan={columns.length + 1} sx={{
                                    textAlign: 'center',
                                    padding: '20px',
                                }}>
                                    Không có dữ liệu
                                </TableCell>
                            </TableRow>
                        )}
                        {rows.map((row, index) => {
                            const key = String(getRowKey ? getRowKey(row) : index);
                            const isItemSelected = isSelected(key)
                            return (
                                <TableRow
                                    onClick={() => onRowClick && onRowClick(row)}
                                    data-rowindex={key}
                                    hover
                                    sx={{
                                        cursor: onRowClick ? 'pointer' : 'default',
                                    }}
                                    role="checkbox"
                                    aria-checked={isItemSelected}
                                    tabIndex={-1}
                                    key={key}
                                    selected={isItemSelected}
                                    classes={{
                                        selected: 'app-row-selected',
                                    }}
                                    onChange={onRowChange}
                                >
                                    <TableCell padding="checkbox">
                                        <Checkbox
                                            onClick={(event) =>
                                            {
                                                event.stopPropagation();
                                                handleClick(event, key)
                                            }
                                            }
                                            color="primary"
                                            checked={isItemSelected}
                                        />
                                    </TableCell>
                                    {columns.map((column) => (
                                        <TableCell
                                            key={randomId(index)}
                                            {...column?.props}
                                        >
                                            {column.render ? column.render(row, index) : row[column.dataIndex as keyof T] as React.ReactNode}
                                        </TableCell>
                                    ))}
                                </TableRow>
                            )
                        })}
                    </TableBody>
                </Table>
            </TableContainer>
        </Box>
    )
}

export default EnhancedTable;

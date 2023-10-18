import { useEffect, useRef } from 'react';
import { AgGridReact } from 'ag-grid-react';
import 'ag-grid-enterprise';
import 'ag-grid-community/dist/styles/ag-grid.css';
import { CellValueChangedEvent, ColDef, FirstDataRenderedEvent, RowDoubleClickedEvent, SelectionChangedEvent } from "ag-grid-community";
import "./ag-grid.scss"
import useMediaQuery from '@mui/material/useMediaQuery';
import { useTheme } from '@mui/material/styles';

type gridProps = {
    columns: ColDef[],
    rows: any[] | undefined,
    rowHeight: number,
    onCellValueChanged?: (event: CellValueChangedEvent) => void,
    autoFit?: boolean,
    onRowDoubleClicked?: (event: RowDoubleClickedEvent) => void,
    onSelectionChanged?: (event: SelectionChangedEvent) => void
}

const AgGrid = (props: gridProps) => {

    const theme = useTheme();
    const isMdOrLess =
        useMediaQuery(theme.breakpoints.down('md'));

    const { columns, rows, rowHeight, onCellValueChanged, autoFit, onRowDoubleClicked, onSelectionChanged } = props
    const gridRef = useRef<AgGridReact>(null);

    useEffect(() => {
        if (!rows && gridRef.current!.api)
            gridRef.current!.api.showLoadingOverlay();
    }, [rows, gridRef])

    const onFirstDataRendered = (event: FirstDataRenderedEvent) => {
        if (isMdOrLess)
            gridRef.current!.columnApi.autoSizeAllColumns(false)
        else if (autoFit)
            event.api.sizeColumnsToFit()
    }

    return (
        <AgGridReact
            ref={gridRef}
            rowData={rows}
            columnDefs={columns}
            rowHeight={rowHeight}
            headerHeight={60}
            onCellValueChanged={onCellValueChanged}
            onFirstDataRendered={onFirstDataRendered}
            onRowDoubleClicked={onRowDoubleClicked}
            onSelectionChanged={onSelectionChanged}
            rowSelection="single"
        />
    );
};

export default AgGrid;
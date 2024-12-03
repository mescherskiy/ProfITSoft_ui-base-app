import React from 'react'
import TableMUI from '@mui/material/Table';

function Table({
    ariaLabel,
    children,
    stickyHeader,
}) {
  return (
    <TableMUI stickyHeader aria-label="sticky table">
        {children}
    </TableMUI>
  )
}

export default Table
import React from 'react'
import TableHeadMUI from '@mui/material/TableHead';

function TableHead({
    children,
}) {
  return (
    <TableHeadMUI>
        {children}
    </TableHeadMUI>
  )
}

export default TableHead
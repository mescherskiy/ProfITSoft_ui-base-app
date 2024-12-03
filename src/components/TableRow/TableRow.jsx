import React from 'react'
import TableRowMUI from '@mui/material/TableRow';

function TableRow({
    onClick,
    children,
    hover,
    role,
    tabIndex,
    style,
    classes,
}) {
  return (
    <TableRowMUI onClick={onClick} style={style} hover={hover} role={role} tabIndex={tabIndex} key={tabIndex + 1} className={classes}>
        {children}
    </TableRowMUI>
  )
}

export default TableRow
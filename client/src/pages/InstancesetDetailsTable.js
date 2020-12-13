import React, {useEffect} from 'react';
import PropTypes from 'prop-types';
import clsx from 'clsx';
import { lighten, makeStyles } from '@material-ui/core/styles';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableContainer from '@material-ui/core/TableContainer';
import TableHead from '@material-ui/core/TableHead';
import TablePagination from '@material-ui/core/TablePagination';
import TableRow from '@material-ui/core/TableRow';
import TableSortLabel from '@material-ui/core/TableSortLabel';
import Toolbar from '@material-ui/core/Toolbar';
import Typography from '@material-ui/core/Typography';
import Paper from '@material-ui/core/Paper';
import Checkbox from '@material-ui/core/Checkbox';
import IconButton from '@material-ui/core/IconButton';
import Tooltip from '@material-ui/core/Tooltip';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import Switch from '@material-ui/core/Switch';
import DeleteIcon from '@material-ui/icons/Delete';
import FilterListIcon from '@material-ui/icons/FilterList';
import Collapse from "@material-ui/core/Collapse";
import Box from "@material-ui/core/Box";
import KeyboardArrowDownIcon from '@material-ui/icons/KeyboardArrowDown';
import KeyboardArrowUpIcon from '@material-ui/icons/KeyboardArrowUp';
import axios from 'axios'

// async function createDataAsync(){
//
//     try{
//         const data = await axios.get("http://localhost:8080/instanceset")
//         console.log(data)
//     }
//     catch (e){
//         console.log(e)
//     }
//
//
// }
//
// createDataAsync()


// function createDetailsData(BackupName, Image, Innodb_buffer_pool_size, key_buffer_size, max_heap_table_size,
//                            Storage, expire_logs_days, max_connections, default_time_zone, log_bin_trust_function_creators,
//                            tmp_table_size, long_query_time){
//     return {
//         BackupName, Image, Innodb_buffer_pool_size, key_buffer_size, max_heap_table_size,
//         Storage, expire_logs_days, max_connections, default_time_zone, log_bin_trust_function_creators
//         tmp_table_size, long_query_time,
//     }
// }


function createData(resource) {
    const { name, namespace, creationTimestamp, generation } = resource.metadata
    const { backupContainer, replicas } = resource.spec
    const { backupName, image } = resource.spec.template.spec
    const { accessModes } = resource.spec.template.spec.volumeClaim.spec
    const { storage } = resource.spec.template.spec.volumeClaim.spec.resources.requests
    let templateObject = { image, storage, backupName }
    let template_lastObject = {}
    resource.spec.template.spec.options.forEach((e)=>{
        switch (e["name"]){
            case "backupName":
            case "innodb_buffer_pool_size":
            case "key_buffer_size":
            case "max_heap_table_size":
                templateObject[e["name"]] = e["value"]
                return;
            case "expire_logs_days":
            case "max_connections":
            case "default-time-zone":
            case "tmp_table_size":
                template_lastObject[e["name"]] = e["value"]
                return;
        }
    })
    const { } = resource.status

    console.log(templateObject, template_lastObject)

    return { name, namespace, creationTimestamp, backupContainer, replicas , accessModes,
        resource,
        template:[
             templateObject ,
            // 3{
            //     BackupName, Image, Innodb_buffer_pool_size, key_buffer_size, max_heap_table_size,
            //     Storage, expire_logs_days, max_connections, default_time_zone, log_bin_trust_function_creators
            //     tmp_table_size, long_query_time,
            // }
        ],
        template_last: [
            template_lastObject
        ]
    };
}



// const rows = [
//     createData('Cupcake', 305, 3.7, 67, 2, 2, 2,'poster-im'),
//     createData('Donut', 452, 25.0, 51,  2, 2, 2, ''),
// ];

function descendingComparator(a, b, orderBy) {
    if (b[orderBy] < a[orderBy]) {
        return -1;
    }
    if (b[orderBy] > a[orderBy]) {
        return 1;
    }
    return 0;
}

function getComparator(order, orderBy) {
    return order === 'desc'
        ? (a, b) => descendingComparator(a, b, orderBy)
        : (a, b) => -descendingComparator(a, b, orderBy);
}

function stableSort(array, comparator) {
    const stabilizedThis = array.map((el, index) => [el, index]);
    stabilizedThis.sort((a, b) => {
        const order = comparator(a[0], b[0]);
        if (order !== 0) return order;
        return a[1] - b[1];
    });
    return stabilizedThis.map((el) => el[0]);
}



const headCells = [
    { id: 'choice', numeric: false, disablePadding: false, label: 'choice' },
    { id: 'name', numeric: false, disablePadding: true, label: 'Name' },
    { id: 'Creation_Time', numeric: false, disablePadding: true, label: 'Creation Time' },
    { id: 'Backup_Container', numeric: true, disablePadding: false, label: 'Backup Container' },
    { id: 'Replicas', numeric: true, disablePadding: false, label: 'Replicas  (개수)' },
    { id: 'Access_Modes', numeric: true, disablePadding: false, label: 'Access Modes' },
    // { id: 'Namespace', numeric: false, disablePadding: true, label: 'Namespace' }
    // { id: 'protein', numeric: true, disablePadding: false, label: 'Protein (g)' },
];

function EnhancedTableHead(props) {
    const { classes, onSelectAllClick, order, orderBy, numSelected, rowCount, onRequestSort } = props;
    const createSortHandler = (property) => (event) => {
        onRequestSort(event, property);
    };

    return (
        <TableHead>
            <TableRow>
                <TableCell padding="checkbox">
                    <Checkbox
                        indeterminate={numSelected > 0 && numSelected < rowCount}
                        checked={rowCount > 0 && numSelected === rowCount}
                        onChange={onSelectAllClick}
                        inputProps={{ 'aria-label': 'select all instanceset' }}
                    />
                </TableCell>
                {headCells.map((headCell) => (
                    <TableCell
                        key={headCell.id}
                        align={headCell.numeric ? 'right' : 'left'}
                        padding={headCell.disablePadding ? 'none' : 'default'}
                        sortDirection={orderBy === headCell.id ? order : false}
                    >
                        <TableSortLabel
                            active={orderBy === headCell.id}
                            direction={orderBy === headCell.id ? order : 'asc'}
                            onClick={createSortHandler(headCell.id)}
                        >
                            {headCell.label}
                            {orderBy === headCell.id ? (
                                <span className={classes.visuallyHidden}>
                  {order === 'desc' ? 'sorted descending' : 'sorted ascending'}
                </span>
                            ) : null}
                        </TableSortLabel>
                    </TableCell>
                ))}
            </TableRow>
        </TableHead>
    );
}

EnhancedTableHead.propTypes = {
    classes: PropTypes.object.isRequired,
    numSelected: PropTypes.number.isRequired,
    onRequestSort: PropTypes.func.isRequired,
    onSelectAllClick: PropTypes.func.isRequired,
    order: PropTypes.oneOf(['asc', 'desc']).isRequired,
    orderBy: PropTypes.string.isRequired,
    rowCount: PropTypes.number.isRequired,
};

const useToolbarStyles = makeStyles((theme) => ({
    root: {
        paddingLeft: theme.spacing(2),
        paddingRight: theme.spacing(1),
    },
    highlight:
        theme.palette.type === 'light'
            ? {
                color: theme.palette.secondary.main,
                backgroundColor: lighten(theme.palette.secondary.light, 0.85),
            }
            : {
                color: theme.palette.text.primary,
                backgroundColor: theme.palette.secondary.dark,
            },
    title: {
        flex: '1 1 100%',
    },
}));

const EnhancedTableToolbar = (props) => {
    const classes = useToolbarStyles();
    const { numSelected } = props;

    return (
        <Toolbar
            className={clsx(classes.root, {
                [classes.highlight]: numSelected > 0,
            })}
        >
            {numSelected > 0 ? (
                <Typography className={classes.title} color="inherit" variant="subtitle1" component="div">
                    {numSelected} selected
                </Typography>
            ) : (
                <Typography className={classes.title} variant="h6" id="tableTitle" component="div">
                    Instanceset Details
                </Typography>
            )}

            {numSelected > 0 ? (
                <Tooltip title="Delete">
                    <IconButton aria-label="delete">
                        <DeleteIcon />
                    </IconButton>
                </Tooltip>
            ) : (
                <Tooltip title="Filter list">
                    <IconButton aria-label="filter list">
                        <FilterListIcon />
                    </IconButton>
                </Tooltip>
            )}
        </Toolbar>
    );
};

EnhancedTableToolbar.propTypes = {
    numSelected: PropTypes.number.isRequired,
};

const useStyles = makeStyles((theme) => ({
    root: {
        width: '100%',
        marginRight: '10%',
        marginBottom: '1%'
    },
    paper: {
        width: '100%',
        marginBottom: theme.spacing(2),
    },
    table: {
        // minWidth: 750,
    },
    visuallyHidden: {
        border: 0,
        clip: 'rect(0 0 0 0)',
        height: 1,
        margin: -1,
        overflow: 'hidden',
        padding: 0,
        position: 'absolute',
        top: 20,
        width: 1,
    },
}));

const useRowStyles = makeStyles({
    root: {
        '& > *': {
            borderBottom: 'unset',
        },
    },
});

function Row(props) {

    const { row, isItemSelected, labelId, selected, setSelected,
        namespace
    } = props;
    const [open, setOpen] = React.useState(false);

    const handleClick = (event, name) => {
        const selectedIndex = selected.indexOf(name);
        let newSelected = [];

        if (selectedIndex === -1) {
            newSelected = newSelected.concat(selected, name);
        } else if (selectedIndex === 0) {
            newSelected = newSelected.concat(selected.slice(1));
        } else if (selectedIndex === selected.length - 1) {
            newSelected = newSelected.concat(selected.slice(0, -1));
        } else if (selectedIndex > 0) {
            newSelected = newSelected.concat(
                selected.slice(0, selectedIndex),
                selected.slice(selectedIndex + 1),
            );
        }
        setSelected(newSelected);
    };

    const preventHandleClick = (event) => {
        event.stopPropagation();
        return setOpen(!open)
    };

    // console.log(namespace, row.namespace)




    return <>
                <TableRow
                    hover
                    onClick={(event) => handleClick(event, row.name)}
                    role="checkbox"
                    aria-checked={isItemSelected}
                    tabIndex={-1}
                    key={row.name}
                    selected={isItemSelected}
                >
                    <TableCell padding="checkbox">
                        <Checkbox
                            checked={isItemSelected}
                            inputProps={{ 'aria-labelledby': labelId }}
                        />
                    </TableCell>
                    <TableCell>
                        <IconButton aria-label="expand row" size="small" onClick={preventHandleClick}>
                            {open ? <KeyboardArrowUpIcon /> : <KeyboardArrowDownIcon />}
                        </IconButton>
                    </TableCell>
                    <TableCell component="th" id={labelId} scope="row" padding="none">
                        {row.name}
                    </TableCell>
                    <TableCell align="right">{row.creationTimestamp}</TableCell>
                    <TableCell align="right">{row.backupContainer}</TableCell>
                    <TableCell align="right">{row.replicas}</TableCell>
                    <TableCell align="right">{row.accessModes}</TableCell>
                </TableRow>
                <TableRow>
                    <TableCell style={{ paddingBottom: 0, paddingTop: 0 }} colSpan={6}>
                        <Collapse in={open} timeout="auto" unmountOnExit>
                            <Box margin={1}>
                                <Typography variant="h6" gutterBottom component="div">
                                    Template
                                </Typography>
                                <Table size="small" aria-label="purchases">
                                    <TableHead>
                                        <TableRow>
                                            <TableCell>Backup Name</TableCell>
                                            <TableCell>Image</TableCell>
                                            <TableCell>Innodb_buffer_pool_size</TableCell>
                                            <TableCell>Key_buffer_size</TableCell>
                                            <TableCell>max_heap_table_size</TableCell>
                                            <TableCell>Storage</TableCell>
                                        </TableRow>
                                    </TableHead>
                                    <TableBody>

                                        {row.template.map((historyRow, index) => (
                                            <TableRow key={index}>
                                                <TableCell component="th" scope="row">
                                                    {historyRow.backupName}
                                                </TableCell>
                                                <TableCell>{historyRow.image}</TableCell>
                                                <TableCell>{historyRow.innodb_buffer_pool_size}</TableCell>
                                                <TableCell>{historyRow.key_buffer_size}</TableCell>
                                                <TableCell>{historyRow.max_heap_table_size}</TableCell>
                                                <TableCell>{historyRow.storage}</TableCell>

                                            </TableRow>
                                        ))}
                                    </TableBody>
                                </Table>
                                <Table size="small" aria-label="purchases">
                                    <TableHead>
                                        <TableRow>
                                            <TableCell>Expire_logs_days</TableCell>
                                            <TableCell>Max_connections</TableCell>
                                            <TableCell>Default_time_zone</TableCell>
                                            <TableCell>Tmp_table_size</TableCell>
                                            <TableCell>Long_query_time</TableCell>
                                        </TableRow>
                                    </TableHead>
                                    <TableBody>
                                        {row.template_last.map((historyRow, index) => (
                                            <TableRow key={index}>
                                                <TableCell component="th" scope="row">
                                                    {historyRow.expire_logs_days}
                                                </TableCell>
                                                <TableCell>{historyRow.max_connections}</TableCell>
                                                <TableCell>{historyRow["default-time-zone"]}</TableCell>
                                                <TableCell>{historyRow["tmp_table_size"]}</TableCell>
                                                <TableCell>{historyRow.long_query_time}</TableCell>
                                            </TableRow>
                                        ))}
                                    </TableBody>
                                </Table>
                            </Box>
                        </Collapse>
                    </TableCell>
                </TableRow>

                    </>


}

export default function InstancesetDetailsTable(props) {

    const classes = useStyles();
    const [order, setOrder] = React.useState('asc');
    const [orderBy, setOrderBy] = React.useState('name');
    const [selected, setSelected] = React.useState([]);
    const { namespace } = props;
    const [page, setPage] = React.useState(0);
    // const [dense, setDense] = React.useState(false);
    const [rows, setRows] = React.useState([]);
    const [rowsPerPage, setRowsPerPage] = React.useState(5);

    const handleRequestSort = (event, property) => {
        const isAsc = orderBy === property && order === 'asc';
        setOrder(isAsc ? 'desc' : 'asc');
        setOrderBy(property);
    };

    const handleSelectAllClick = (event) => {
        if (event.target.checked) {
            const newSelecteds = rows.map((n) => n.name);
            setSelected(newSelecteds);
            return;
        }
        setSelected([]);
    };


    const handleChangePage = (event, newPage) => {
        setPage(newPage);
    };

    const handleChangeRowsPerPage = (event) => {
        setRowsPerPage(parseInt(event.target.value, 10));
        setPage(0);
    };

    // const handleChangeDense = (event) => {
    //     setDense(event.target.checked);
    // };

    const isSelected = (name) => selected.indexOf(name) !== -1;

    const emptyRows = rowsPerPage - Math.min(rowsPerPage, rows.length - page * rowsPerPage);

    React.useEffect(()=>{
        const callInstancesets = async () => {
            try{
                const response = await axios.get(`http://localhost:8080/instanceset/${namespace}`)
                if(response.data){
                    setRows(response.data.map((e)=> {
                        return createData(e)
                    }))
                    console.log(rows)
                }
            }
            catch (e){
                console.log(e)
            }
        }

        callInstancesets()
    }, [namespace])


    return (
        <div className={classes.root}>
            <Paper className={classes.paper}>
                <EnhancedTableToolbar numSelected={selected.length} />
                <TableContainer>
                    <Table
                        className={classes.table}
                        aria-labelledby="tableTitle"
                        size={'medium'}
                        aria-label="enhanced table"
                    >
                        <EnhancedTableHead
                            classes={classes}
                            numSelected={selected.length}
                            order={order}
                            orderBy={orderBy}
                            onSelectAllClick={handleSelectAllClick}
                            onRequestSort={handleRequestSort}
                            rowCount={rows.length}
                        />
                        <TableBody>
                            {stableSort(rows, getComparator(order, orderBy))
                                .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                                .map((row, index) => {
                                    const isItemSelected = isSelected(row.name);
                                    const labelId = `enhanced-table-checkbox-${index}`;
                                    console.log(row.namespace, namespace)
                                    return ( row.namespace === namespace ?
                                        <Row row={row} isItemSelected={isItemSelected} labelId={labelId}
                                             namespace={namespace}
                                            selected={selected} setSelected={setSelected}
                                        /> : <></>
                                    );
                                })}
                            {emptyRows > 0 && (
                                <TableRow style={{ height: (55) * emptyRows }}>
                                    <TableCell colSpan={6} />
                                </TableRow>
                            )}
                        </TableBody>
                    </Table>
                </TableContainer>
                <TablePagination
                    rowsPerPageOptions={[5, 10, 25]}
                    component="div"
                    count={rows.length}
                    rowsPerPage={rowsPerPage}
                    page={page}
                    onChangePage={handleChangePage}
                    onChangeRowsPerPage={handleChangeRowsPerPage}
                />
            </Paper>
        </div>
    );
}

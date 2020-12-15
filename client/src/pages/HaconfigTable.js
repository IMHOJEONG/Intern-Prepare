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
import DeleteIcon from '@material-ui/icons/Delete';
import FilterListIcon from '@material-ui/icons/FilterList';
import Collapse from "@material-ui/core/Collapse";
import Box from "@material-ui/core/Box";
import KeyboardArrowDownIcon from '@material-ui/icons/KeyboardArrowDown';
import KeyboardArrowUpIcon from '@material-ui/icons/KeyboardArrowUp';
import axios from 'axios'

function createData(resource) {

    const { name, namespace, creationTimestamp, generation } = resource.metadata
    const owner_name  = resource.metadata.ownerReferences[0].name
    const { healthCheckPeriod, healthCheckTimeout } = resource.spec
    const { timeSpan, errorCount } = resource.spec.healthCheckRules[0];
    const { healthcheckConditions } = resource.status;
    const { instances } = resource.spec
    const sourcename = resource.spec.topology.name
    const sourcephase = resource.spec.topology.phase
    const { children } = resource.spec.topology
    let templateObject = { timeSpan, errorCount, sourcename, sourcephase,
        children: children, healthcheckConditions: healthcheckConditions
    }

    let template_lastObjects = [];
    instances.forEach((instance, instanceindex) => {

        instance.addresses.forEach((address) => {
            let perObject = {};
            perObject['name'] = instance.name
            perObject['host'] = address.host
            perObject['port'] = address.port
            perObject['type'] = address.type
            template_lastObjects = template_lastObjects.concat(perObject)
        })

    })

    const { } = resource.status

    return { name, namespace, creationTimestamp, owner_name, healthCheckPeriod, healthCheckTimeout,
        resource,
        template:[
            templateObject ,
            // 3{
            //     BackupName, Image, Innodb_buffer_pool_size, key_buffer_size, max_heap_table_size,
            //     Storage, expire_logs_days, max_connections, default_time_zone, log_bin_trust_function_creators
            //     tmp_table_size, long_query_time,
            // }
        ],
        template_last:
            template_lastObjects

    };
}

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
    { id: 'Owner_Instanceset', numeric: true, disablePadding: false, label: 'Owner Instanceset' },
    { id: 'Health_Check_Period', numeric: true, disablePadding: false, label: 'Health_Check_Period (초)' },
    { id: 'Health_Check_Timeout', numeric: true, disablePadding: false, label: 'Health_Check_Timeout ()' },
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
                    Haconfigs Details
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
            <TableCell align="right">{row.owner_name}</TableCell>
            <TableCell align="right">{row.healthCheckPeriod}</TableCell>
            <TableCell align="right">{row.healthCheckPeriod}</TableCell>
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
                                    <TableCell colSpan={2}>Health Check Rules</TableCell>
                                    <TableCell colSpan={3}>Topology</TableCell>
                                    <TableCell colSpan={2}>Health Check Conditions</TableCell>
                                </TableRow>
                                <TableRow>
                                    <TableCell>Error Count</TableCell>
                                    <TableCell>Time Span</TableCell>
                                    <TableCell>Source</TableCell>
                                    <TableCell>Source Phase</TableCell>
                                    <TableCell>Replica</TableCell>
                                    <TableCell>Name</TableCell>
                                </TableRow>
                            </TableHead>
                            <TableBody>

                                {row.template.map((historyRow, index) => (
                                    <TableRow key={index}>
                                        <TableCell component="th" scope="row">
                                            {historyRow.errorCount}
                                        </TableCell>
                                        <TableCell component="th" scope="row">
                                            {historyRow.timeSpan}
                                        </TableCell>
                                        <TableCell>{historyRow.sourcename}</TableCell>
                                        <TableCell>{historyRow.sourcephase}</TableCell>
                                        <TableCell>

                                                {
                                                    historyRow["children"].map((replica, index) => (
                                                        <TableRow>
                                                        <TableCell>
                                                            {replica.name}
                                                        </TableCell>
                                                        <TableCell>
                                                            {replica.phase}
                                                        </TableCell>
                                                        </TableRow>
                                                    ))
                                                }
                                        </TableCell>
                                        <TableCell>

                                                {
                                                    historyRow["healthcheckConditions"].map((replica, index) => (
                                                        <TableRow>
                                                        <TableCell>
                                                            {replica.name}
                                                        </TableCell>
                                                        <TableCell>
                                                            {replica["results"][0].timestamp}
                                                        </TableCell>
                                                        </TableRow>
                                                            ))
                                                }


                                        </TableCell>

                                    </TableRow>
                                ))}
                                {

                                }
                            </TableBody>
                        </Table>
                        <Table size="small" aria-label="purchases">
                            <TableHead>
                                <TableRow>
                                    <TableCell>Name</TableCell>
                                    <TableCell>Host</TableCell>
                                    <TableCell>Port</TableCell>
                                    <TableCell>Type</TableCell>
                                </TableRow>
                            </TableHead>
                            <TableBody>
                                {row.template_last.map((historyRow, index) => (
                                    <TableRow key={index}>
                                        <TableCell component="th" scope="row">
                                            {historyRow.name}
                                        </TableCell>
                                        <TableCell>{historyRow.host}</TableCell>
                                        <TableCell>{historyRow.port}</TableCell>
                                        <TableCell>{historyRow.type}</TableCell>
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

export default function HaconfigTable(props) {

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

    const isSelected = (name) => selected.indexOf(name) !== -1;

    const emptyRows = rowsPerPage - Math.min(rowsPerPage, rows.length - page * rowsPerPage);

    React.useEffect(()=>{
        const callInstancesets = async () => {
            try{
                const response = await axios.get(`http://localhost:8080/customresource/haconfig/${namespace}`)
                if(response.data){
                    setRows(response.data.map((e)=> {
                        return createData(e)
                    }))
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
                                    return <Row row={row} isItemSelected={isItemSelected} labelId={labelId}
                                                 namespace={namespace}
                                                 selected={selected} setSelected={setSelected}
                                            />
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

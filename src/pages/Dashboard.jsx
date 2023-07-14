import { Box, Button, Container,  Paper, Table, TableBody, TableCell, TableContainer, TableHead, TablePagination, TableRow, } from '@mui/material';
import axios from 'axios';
import React, { useMemo } from 'react'
import { Link } from 'react-router-dom';
import { backendUrl } from '../utils';
import { toast } from 'react-toastify';
import ShareModal from '../components/ShareModal';

function Dashboard(props) {
    const fetchFiles = useMemo(() => props.fetchFiles, [props.fetchFiles])
    const access_token = useMemo(() =>  props?.access_token, [props?.access_token]);
    const [open, setOpen] = React.useState(false);
    const handleOpen = () => setOpen(true);
    const handleClose = () => setOpen(false);    
    React.useEffect(() =>{
        fetchFiles();
    },[fetchFiles])
    const rows = props.fileData.map((el, idx) =>{
        return {
            file_name: el.file_name,
            id: el.file_id,
            is_public: el.is_public,
            "sr.no.": idx + 1,
        }
    })
    const [page, setPage] = React.useState(0);
    const [rowsPerPage, setRowsPerPage] = React.useState(5);
    const handleChangePage = (event, newPage) => {
        setPage(newPage);
    };
    const handleChangeRowsPerPage = (event) => {
        setRowsPerPage(+event.target.value);
        setPage(0);
    };
    const columns = [
        { id: "sr.no.", label: "Sr. No.", minWidth: 170, align: "center" },
        { id: "file_name", label: "File Name", minWidth: 100, align: "center" },
        { id: "actions", label: "Actions", minWidth: 100, align: "center" },
    ];
    const togglePublicHandler = async (id) => {
    try{
        const res = await axios.patch(backendUrl+"dashboard/", {
            operation: "toggle",
            file_id:id
        }, {
            headers:{
                Authorization:`Bearer ${access_token}`
            }
        })
        console.log(res);
        fetchFiles(() => toast.success(res?.data?.message));
    }catch(err){
        toast.error(err?.response?.data)
    }
}
const [listOfUsers, setListOfUsers] =  React.useState([]);
React.useEffect(() => {
    const fetchUsers = async () =>{
        try{
            const res = await axios.get(backendUrl+"iam/users/", {headers:{
                Authorization:`Bearer ${access_token}`
            }})
            console.log(res);
            setListOfUsers(res?.data?.result?.filter(el => el?.email !==  props?.user?.email));
            console.log(res?.data?.result?.filter(el => el?.email !==  props?.user?.email))
        }catch(err){
            toast.error(err?.response?.data)
        }
    } 
    fetchUsers()
    // eslint-disable-next-line react-hooks/exhaustive-deps
},[]);
React.useEffect(() => {
    console.log(listOfUsers)
},[listOfUsers])
  return (
    <Container maxWidth={"100%"}>
            <Paper sx={{ width: "100%", overflow: "hidden", my: 6 }}>
                <TableContainer sx={{ maxHeight: 440 }}>
                    <Table stickyHeader aria-label="sticky table">
                        <TableHead>
                            <TableRow>
                                {columns.map((column) => (
                                    <TableCell
                                        key={column.id}
                                        align={column.align}
                                    >
                                        {column.label}
                                    </TableCell>
                                ))}
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {rows
                                .slice(
                                    page * rowsPerPage,
                                    page * rowsPerPage + rowsPerPage
                                )
                                .map((row) => {
                                    return (
                                        <TableRow
                                            hover
                                            tabIndex={-1}
                                            key={row.code}
                                            style={{ textDecoration: "none" }}
                                        >
                                            {columns.map((column) => {
                                                if(column?.id === "actions") return <TableCell
                                                key={column.id}
                                                align={column.align}
                                            >
                                                <Box sx={{display:"flex", justifyContent:"center", alignItems:"center", gap: 2}}>
                                            <Button variant='outlined' component={Link} to={`/file/${row.id}`}>View PDF</Button>
                                            <Button onClick={() => togglePublicHandler(row?.id)} variant='contained' color={row.is_public?"error":"success"}>Make {row.is_public ? "Private" :"Public" }</Button>
                                            <Button onClick={() => handleOpen()} variant='outlined' color='warning' disabled={row?.is_public}>Share with</Button>
                                            {<ShareModal fileId={row?.id} users={listOfUsers} open={open} handleClose={handleClose} access_token={access_token}/>}
                                            </Box>
                                            </TableCell>
                                                const value = row[column.id];
                                                return (
                                                    <TableCell
                                                        key={column.id}
                                                        align={column.align}
                                                    >
                                                    {value}
                                                    </TableCell>
                                                );
                                            })}
                                        </TableRow>
                                    );
                                })}
                        </TableBody>
                    </Table>
                </TableContainer>
                <TablePagination
                    rowsPerPageOptions={[5, 10, 25, 100]}
                    component="div"
                    count={rows.length}
                    rowsPerPage={rowsPerPage}
                    page={page}
                    onPageChange={handleChangePage}
                    onRowsPerPageChange={handleChangeRowsPerPage}
                />
            </Paper>
        </Container>
  )
}

export default Dashboard
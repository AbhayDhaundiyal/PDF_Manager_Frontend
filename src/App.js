import React, { useCallback, useState } from "react";
import "./styles.css";
import LogInForm from "./LogInForm";
import SignUpForm from "./SignUpForm";
import { AppBar, Box, Button, CssBaseline, Grid, Modal, Toolbar, Typography } from '@mui/material';
import { Route, Routes, Navigate, BrowserRouter,  Link } from "react-router-dom";
import FileUploadIcon from '@mui/icons-material/FileUpload';
import Dashboard from "./pages/Dashboard";
import HighlightOffIcon from '@mui/icons-material/HighlightOff';
import { toast } from "react-toastify";
import axios from "axios";
import { backendUrl } from "./utils";
import File from "./pages/File";
export default function App() {
  const [state, setState] = useState(true);
  const [user, setUser] = React.useState(JSON.parse(localStorage.getItem("user"))|| null)
  const [file, setFile] = useState("");
  function handleFileChange(e){
    console.log(e.target?.value)
    if(e.target.files.length > 0){
      setFile(e.target.files[0]);
    }else{
      setFile(null);
    }
  }
  const [open, setOpen] = React.useState(false);
  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);
  const [fileData, setFileData] = React.useState([]);
  const fetchFiles  = useCallback(async (extraStuff = null) => {
    try{
      const res  = await axios.get(backendUrl+"dashboard/", {headers:{
        Authorization: `Bearer ${user.access_token}`
      }})
      console.log(res?.data?.result);
      setFileData(res?.data?.result);
      if(extraStuff){
        extraStuff()
      }
    }catch(err){
      toast.error(err?.response?.data);
    }
  },[user]);
  const handleFileUploadSubmit = async(e) =>{
    e.preventDefault();
    if(!file){
      toast.error("No files selected baka!");
      return;
    }
    const formData = new FormData();
    formData.append("file", file);
    formData.append("fileName", file.name);
    try{
      const res = await axios.post(backendUrl+ "dashboard/", formData, {
        headers:{
          Authorization:`Bearer ${user?.access_token}`
        }
      })
      toast.success(res?.data?.message);
      setFile("");
      handleClose();
      fetchFiles();
    }catch(err){
      toast.error(err?.response?.data);
    }
  }
  const style = {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    width: 400,
    bgcolor: 'background.paper',
    boxShadow: 24,
    p: 4,
  };
  React.useEffect(()=>{
    localStorage.setItem("user", JSON.stringify(user));
  },[user])
  const Form = () => {
    return <><div className="acc-page">
    <div id="container"><Grid container spacing={2}>
    <Grid item xs={6} id = "grid_item">
      <div style={{cursor:"pointer"}} className={state ? "select" : "selected"} onClick={() => setState(false)}>
        <span id = "text">Login</span>
      </div>
    </Grid>
    <Grid item xs={6} id = "grid_item">
      <div style={{cursor:"pointer"}} className={state ? "selected" : "select"}  onClick={() => setState(true)}>
        <span id = "text">Register</span>
      </div>
    </Grid>
    </Grid>
    <div>
      {state ? <SignUpForm/> : <LogInForm setUser={setUser}/>}
    </div></div></div></>
  }
  if(!user) return <BrowserRouter><Routes>
  <Route path="/" element={<Form/>} />
  <Route path="/file/:id" element={<File user={user} access_token={user?.access_token}/>}/>
  <Route path="*" element={<Navigate to={"/"} />} />
</Routes>
</BrowserRouter>
  return (
    <>
    
      <BrowserRouter>
      <>
        <CssBaseline/>
      <AppBar position="static" sx={{background:"#344a72"}} component="nav">
        <Toolbar>
          <Typography
            variant="h6"
            component="div"
            sx={{ flexGrow: 1, display: { xs: 'none', sm: 'block' } }}
          >
            PDF Manager
          </Typography>
          <Box sx={{ display: { xs: 'none', sm: 'flex' } , gap: 2}}>
           <Link style={{display:"flex",alignItems:"center", justifyContent:"center", textAlign:"center", textDecoration:"none", color:"white"}} to="/dashboard"><span>Dashboard</span></Link>
            <Button variant="contained" onClick={() => handleOpen()} color="success">Upload</Button>
            <Button variant="contained" onClick={() => {setUser(null)}}>Logout</Button>

          </Box>
        </Toolbar>
        <Modal
        open={open}
        onClose={handleClose}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
      >
        <Box onSubmit={handleFileUploadSubmit} component={"form"} enctype='multipart/form-data' sx={style}>
          <Typography mb={4} id="modal-modal-title" variant="h6" component="h2">
            Upload your file
          </Typography>
          <Box mb={4} sx={{display:"flex", alignItems:"center", gap:2}}>
            <Button variant="contained" component="label" htmlFor="uploadFile" >Select file</Button><span>{!file ? "No file selected yet." : file.name}</span>
            {file && <span style={{cursor:"pointer"}} onClick={() => { setFile(null)}}><HighlightOffIcon/></span>}
            <input accept="application/pdf" onChange={handleFileChange} id="uploadFile" name="uploadFile" hidden type="file"/>
          </Box>
          <Box sx={{display:"flex", justifyContent:"center", alignItems:"center"}}>
            <Button type="submit" disabled={!file} variant="contained" color="success" endIcon={<FileUploadIcon/>}>Upload</Button>
          </Box>
        </Box>
      </Modal>
      </AppBar>
        </>
      <Routes>
          <Route path="/dashboard" element={<Dashboard user={user} access_token={user?.access_token} fetchFiles={fetchFiles} fileData={fileData}/>} />
          <Route path="/file/:id" element={<File user={user} access_token={user?.access_token}/>} />
          
          <Route path="*" element={<Navigate to={"/dashboard"}/>} />
          </Routes>
        </BrowserRouter>
        </>
  );
}

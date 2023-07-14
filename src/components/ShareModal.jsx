import { Box, Button, FormControl, InputLabel, MenuItem, Modal, Select, Typography } from '@mui/material'
import React, { useMemo } from 'react'
import ShareIcon from '@mui/icons-material/Share';
import { toast } from 'react-toastify';
import axios from 'axios';
import { backendUrl } from '../utils';
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
function ShareModal(props) {
    const access_token = useMemo(() => props?.access_token, [props?.access_token]);
    const [selecterUser, setSelectedUser] = React.useState('');

  const handleChange = (event) => {
    setSelectedUser(event.target.value);
  };
  const handleShareSubmit = async (e) => {
    e.preventDefault();
    if(!selecterUser){
      toast.error("No user email selected!");
    }
    console.log(selecterUser);
    try {
      const res = await axios.patch(backendUrl+"dashboard/", {
        operation: "share",
        "second_user": selecterUser,
        file_id: props?.fileId
      },{
        headers:{
          Authorization:`Bearer ${access_token}`
        }
      });
      console.log(res);
      toast.success(res?.data)
    } catch (error) {
      toast.error(error?.response?.data)
    }
    setSelectedUser("");
    props.handleClose()
  }
  return (
    <Modal
        open={props.open}
        onClose={props.handleClose}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
      >
        <Box onSubmit={handleShareSubmit} component={"form"} enctype='multipart/form-data' sx={style}>
          <Typography mb={4} id="modal-modal-title" variant="h6" component="h2">
           Share your file
          </Typography>
          <Box mb={4} sx={{display:"flex", alignItems:"center", gap:2}}>
          <FormControl fullWidth>
        <InputLabel id="demo-simple-select-label">User email</InputLabel>
        <Select
          labelId="demo-simple-select-label"
          id="demo-simple-select"
          value={selecterUser}
          label="User email"
          onChange={handleChange}
        >
            {props.users.map(el => <MenuItem  key={el.email} value={el.email}>{el.email}</MenuItem>)}
        </Select>
      </FormControl>

          </Box>
          <Box sx={{display:"flex", justifyContent:"center", alignItems:"center"}}>
            <Button type="submit" variant="contained" color="success" endIcon={<ShareIcon/>}>Share</Button>
          </Box>
        </Box>
      </Modal>
  )
}

export default ShareModal
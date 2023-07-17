import axios from 'axios';
import React, { useEffect, useMemo, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { toast } from 'react-toastify';
import { backendUrl } from '../utils';
import { Document, Page, pdfjs } from 'react-pdf';
import Comment from '../components/Comment';
import { Typography } from '@mui/material';
import "jodit/build/jodit.min.css";
import parse from "html-react-parser";
import * as moment from 'moment';
pdfjs.GlobalWorkerOptions.workerSrc = `//cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjs.version}/pdf.worker.js`;
const PDFViewer = ({ base64Data }) => {
    const [numPages, setNumPages] = useState(null);
    const handleLoadSuccess = (pdf) => {
        setNumPages(pdf.numPages);
      };
    useEffect(() => {
      // Load the PDF data
      // (base64Data is the data encoded as application/octet-stream;base64)
      pdfjs.getDocument({ data: base64Data }).promise
        .then(pdf => {
          setNumPages(pdf.numPages);
        })
        .catch(error => {
          console.error('Error while loading PDF:', error);
        });
    }, [base64Data]);
  
    return (
      <div style={{display:"flex", justifyContent:"center", alignItems:"center",}}>
        <Document
        file={base64Data}
        onLoadSuccess={handleLoadSuccess}
        renderMode="canvas" // Set renderMode to "canvas"
        className={"ren"}

      >
        {Array.from(new Array(numPages), (el, index) => (
          <Page
            key={`page_${index + 1}`}
            pageNumber={index + 1}
            renderTextLayer={false} // Disable the TextLayer
            //width={210}
            renderAnnotationLayer={false}
          />
        ))}
      </Document>
      </div>
    );
  }
  

function File(props) {
    const {id} = useParams();
    const accessToken = useMemo(() => props?.access_token, [props?.access_token]);
    const [description, setDescription] = useState("");
    const [viewFileData, setViewFileData] = React.useState(null);
    const {isPublic, setIsPublic} = React.useState(false);
    const navigate = useNavigate()
    React.useEffect(() => {
        const fetchFile = async () =>{
            try{
                const res = await axios.get(backendUrl+`dashboard/file/${id}/`, {
                    headers:{
                        Authorization:`Bearer ${accessToken || ""}`,
                        "Content-Type":"application/pdf"
                    },
                    responseType: 'arraybuffer' 
                })
                console.log(res?.data);
                const blobToBase64 = (blob, callback) => {
                    const reader = new FileReader();
                    reader.onloadend = () => {
                        const base64 = reader.result;
                        callback(base64);
                    };
                    reader.readAsDataURL(blob);
                };
                const blob = new Blob([res?.data]);
                    blobToBase64(blob, rtData => {
                        if(setViewFileData)setViewFileData(rtData)
                    });
            }catch(err){
                toast.error("You are not allowed to view this file or this file does not exist!");
            }
        }
        const fetchFileStatus = async() => {
          try {
            const res = await axios.get(backendUrl + `dashboard/file_detail/${id}/`);
            console.log(res?.data)
            if(!props?.user && !res?.data?.is_public){
              navigate("/");
              return;
            }
            if(setIsPublic){
              console.log(setIsPublic)
              setIsPublic(res?.data?.is_public);
            }
            
          } catch (error) {
            console.log(error)
            toast.error(error?.response?.data);
            navigate("/");
            return;
          }
        }
        fetchFileStatus();
        fetchFile();
    },[id, accessToken, navigate, setIsPublic, props?.user])
    const [comments, setComments] = React.useState([]);
    console.log(comments)
    const fetchComments = useMemo((extraStuff) =>  async() => {
      try{
        const res = await axios.get(backendUrl + `dashboard/file/${id}/${0}/`, {
          headers:{
            Authorization: `Bearer ${accessToken}`
          }
        })
        setComments(res?.data)
        if(extraStuff){
          extraStuff();
        }
      }catch(err){
        toast.error(err?.response?.data)
      }
    },[accessToken, id])
    const commentDude = async (callback) => {
      try{
        const res = await axios.post(backendUrl + `dashboard/file/${id}/${0}/`, {
          content: description
        }, {headers:{
          Authorization: `Bearer ${accessToken}`
        }})
        toast.success(res?.data)
        callback("")
        fetchComments()
      }catch(err){
        toast.error(err?.response?.data)
      }
    }

    React.useEffect(() => {
      fetchComments();
    },[fetchComments, props?.user, isPublic]) 
    if(!viewFileData) return <></>
  return (
    <>
    <PDFViewer base64Data={viewFileData}/>
    <div style={{display:"flex", justifyContent:"center", alignItems:"center", marginTop:"30px"}}>
        <div style={{width:"595px"}}>
            <Typography>Comments</Typography>
          {props.user && <Comment content={description}
          setContent={setDescription}
          placeholder={"Comment here...."}
          commentDude={commentDude}/>}
          <div style={{display:"flex", gap:"20px", flexDirection:"column"}}>
            {comments.length === 0 && <span>No commments yet.... </span>}
          {comments.map((el, idx)=> 
            <div style={{border:"1px solid rgba(0,0,0,0.4)", borderRadius:"10px", padding: "4px 20px"}} key={idx}>
              <div style={{display:"flex", justifyContent:"space-between"}}><span><strong>{el?.name+` <${el?.email}>`}</strong> commented:</span> <span>{moment(el?.created_at)?.fromNow()}</span></div>
              <div className="jodit-wysiwyg">{parse(el?.content)}</div>
            </div>)}
          </div>
          </div>
      </div>
    </>
  )
}

export default File
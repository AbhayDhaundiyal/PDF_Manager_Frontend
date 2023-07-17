import { Button, } from '@mui/material';
import React, { useMemo, useRef } from 'react'
import JoditEditor from "jodit-react";

function Comment({ placeholder, content, setContent, commentDude }) {
    const editor = useRef(null);
    //console.log(content);
    const config = useMemo(() => {
        return {
            readonly: false, // all options from https://xdsoft.net/jodit/docs/,
            placeholder: placeholder || "Start typings...",
        };
    }, [placeholder]);
    console.log(content)
    return (
        <>
            <JoditEditor
                ref={editor}
                value={content}
                config={config}
                tabIndex={0} // tabIndex of textarea
                //onBlur={(newContent) => setContent(newContent)} // preferred to use only this option to update the content for performance reasons
                onChange={(newContent) => setContent(newContent)}
            />
            <Button onClick={() => {commentDude(setContent)}} sx={{my: 4}} variant='contained' color='primary'>Comment</Button>
            </>
    );
}

export default Comment
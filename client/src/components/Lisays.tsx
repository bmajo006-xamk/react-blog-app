import {Dispatch, SetStateAction, useRef} from 'react';
import {Dialog, DialogTitle, DialogContent, TextField, Button, Stack} from '@mui/material';
import {useNavigate, NavigateFunction} from 'react-router-dom';
import React from 'react';
import ReactQuill from 'react-quill';

interface Props {

    apiKutsu : (arg0 : string, arg1? : any) => void
    openDialog : boolean
    setOpenDialog : Dispatch<SetStateAction<boolean>>
}

const Lisays : React.FC<Props> = (props : Props) : React.ReactElement => {

    const navigate : NavigateFunction = useNavigate();

    const lomakeRef : any = useRef<HTMLFormElement>();
    const quillRef : any = useRef<any>();

    const tallenna = (e : React.FormEvent) : void => {
        e.preventDefault();
    
        props.apiKutsu("POST", {
            
            otsikko : String(lomakeRef.current?.title.value),
            sisalto : quillRef.current.getEditorContents(),
            kayttajaId : 1,
            kayttaja : "",
            tykkaykset : 0,
            eiTykkaykset : 0,
            julkaistu : true,
            createdAt :0,
            updatedAt : 0
        })
        props.setOpenDialog(false);
    }

    const cancelDialog = () : void => {
        props.setOpenDialog(false);
    }

    return (


        <Dialog
            maxWidth= "md"
            fullWidth= {true}
            open={props.openDialog}
            onClose={cancelDialog}
        >
            <DialogTitle
                sx={{
                    fontSize: 24,
                    fontWeight: 'bold',
                    textAlign: 'center',
                    
                }}>Add new writing to blog </DialogTitle>
            <DialogContent
                style={{
                    paddingTop : 10
                }}>
                <Stack
                    spacing = {1}
                    component = "form"
                    ref={lomakeRef}
                    onSubmit={tallenna}
                >
                <TextField
                    name="title"
                    label="title"
                />
                <ReactQuill
                    ref={quillRef}
                    style={{
                        height: 450,
                        marginBottom: 60
                    }}
                />
                <Button
                    variant="contained"
                    type="submit"
                    size="medium"
                    sx={{
                        marginBottom: 20,
                        backgroundColor: '#bdc3c7',
                        fontColor: '#000000'
                    }}
                >Add</Button>
                <Button
                    variant="outlined"
                    size="medium"
                    onClick={cancelDialog}
                >Cancel</Button>
                </Stack>
            </DialogContent>
        </Dialog>



    )
}
export default Lisays;
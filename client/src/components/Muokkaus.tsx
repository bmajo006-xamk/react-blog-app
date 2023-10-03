import {Dispatch, SetStateAction, useRef} from 'react';
import {Dialog, DialogTitle, DialogContent, Stack, Button, TextField } from '@mui/material';
import ReactQuill from 'react-quill';
import {useNavigate, NavigateFunction} from 'react-router-dom';


interface Blogiteksti{
    id : number
    otsikko : string
    sisalto : string
    kuva : string
    kayttaja : string
    tykkaykset : number
    eiTykkaykset : number
    julkaistu : boolean
    createdAt : string
    updatedAt : string
}


interface Props {

    apiKutsu : (arg0 : string, arg1? : any, arg2? : number) => void
    openEditDialog : boolean
    setOpenEditDialog : Dispatch<SetStateAction<boolean>>
    editData : Blogiteksti

}

const Muokkaus : React.FC<Props> = (props : Props) : React.ReactElement => {

    const navigate : NavigateFunction = useNavigate();

    const lomakeRef : any = useRef<HTMLFormElement>();
    const quillRef : any = useRef<any>(); 



    const save = (e : React.FormEvent) : void => {

        e.preventDefault();

        props.apiKutsu("PUT", {
            otsikko : lomakeRef.current?.title.value,
            sisalto : quillRef.current.getEditorContents(),
            julkaistu : true
        }, props.editData.id);

        props.setOpenEditDialog(false);
        navigate("/");

    }
    const cancelEdit = () : void => {
    
    props.setOpenEditDialog(false);

    }

    return (
        <Dialog
            maxWidth= "md"
            fullWidth= {true}
            open={props.openEditDialog}
            onClose={cancelEdit}>
            <DialogTitle
                sx={{
                    fontSize: 24,
                    fontWeight: 'bold',
                    textAlign: 'center',
                }}>Muokkaa blogitekstiä</DialogTitle>
            <DialogContent
                 style={{
                    paddingTop : 10
                }}>
                <Stack 
                    spacing={2}
                    component="form"
                    ref={lomakeRef}
                    onSubmit={save}>
                    <TextField
                        name= "title"
                        label="title"
                        defaultValue={props.editData.otsikko}
                        sx={{
                            fontWeight: "bold",
                        }}
                    >{props.editData.otsikko}</TextField>
                <ReactQuill
                    ref={quillRef}
                    defaultValue={props.editData.sisalto}
                    style={{
                        height: 450,
                        marginBottom: 60
                    }}/>
                    
                    <Button
                        variant="contained"
                        type="submit"
                        size="medium"
                        sx={{
                            marginBottom: 20,
                            backgroundColor: '#bdc3c7'
                        }}
                    >Save edits</Button>
                    <Button
                        variant="outlined"
                        onClick={cancelEdit}
                    >Cancel</Button>


                </Stack>
        
            </DialogContent>
        </Dialog>



    )
}
export default Muokkaus;
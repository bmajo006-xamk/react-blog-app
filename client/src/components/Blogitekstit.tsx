import react, {useState, useEffect, Dispatch, SetStateAction, useRef} from 'react';
import {Container, Box, AppBar, Toolbar,Typography, Button, IconButton, Alert, Backdrop, CircularProgress, Stack, Paper, Grid, TextField} from '@mui/material';
import {useNavigate, NavigateFunction} from 'react-router-dom';
import LoginIcon from '@mui/icons-material/Login';
import LogoutIcon from '@mui/icons-material/Logout';
import ThumbDownIcon from '@mui/icons-material/ThumbDown';
import ThumbUpIcon from '@mui/icons-material/ThumbUp';
import DeleteIcon from '@mui/icons-material/Delete';
import EditIcon from '@mui/icons-material/Edit';
import AddIcon from '@mui/icons-material/Add';
import PublishIcon from '@mui/icons-material/Publish';
import UnpublishedIcon from '@mui/icons-material/Unpublished';
import "react-quill/dist/quill.snow.css";
import { format, parseJSON } from 'date-fns';
import Lisays from './Lisays';
import Muokkaus from './Muokkaus';

export interface Blogiteksti{
    id : number
    otsikko : string
    sisalto : string
    kuva : string
    kayttajaId : number
    kayttaja : string
    tykkaykset : number
    eiTykkaykset : number
    julkaistu : boolean
    createdAt : string
    updatedAt : string

}

interface ApiData {
    blogitekstit : Blogiteksti[]
    virhe : string
    haettu : boolean
}

interface fetchAsetukset {
    method : string
    headers? : any
    body? : string
    id? : number
}

interface Props {
    token : string
    kirjautuminen : boolean
    setKirjautuminen : Dispatch<SetStateAction<boolean>>
}

const Blogitekstit : React.FC<Props> = (props : Props) : React.ReactElement => {

    const pages = ['Home', 'Categories', 'About'];
    
    const navigate : NavigateFunction = useNavigate();
    const lomakeRef = useRef<HTMLFormElement>();

    const [apiData, setApiData] = useState<ApiData>({
                                blogitekstit : [],
                                virhe : "",
                                haettu : false
                                });

    const [openDialog, setOpenDialog] = useState<boolean>(false);
    const [openEditDialog, setOpenEditDialog] = useState<boolean>(false);
    const [editData, setEditData] = useState<Blogiteksti>({
                                    id : 0,
                                    otsikko : "",
                                    sisalto : "",
                                    kuva : "",
                                    kayttajaId : 0,
                                    kayttaja: "",
                                    tykkaykset : 0,
                                    eiTykkaykset : 0,
                                    julkaistu : false,
                                    createdAt : "",
                                    updatedAt: ""

                                    });

    const tykkaysKutsu = async (metodi : string, blogiteksti? : Blogiteksti, id? : number) : Promise<void> => {

        let url = `/api/blogitekstit/${id}`;

        let asetukset : fetchAsetukset = {
            method : metodi,
            headers : {
                'Content-Type': 'application/json'
            },
            body : JSON.stringify(blogiteksti)

        }
        try {
            const yhteys = await fetch(url, asetukset);

            if (yhteys.status === 200){
                setApiData({
                    ...apiData,
                    blogitekstit : await yhteys.json(),
                    haettu : true
                })
            } else {
                let virheteksti : string = '';

                if (yhteys.status === 400){
                    virheteksti = "Virhe pyynnön tiedoissa";
                } else {
                    virheteksti = "Palvelimella tapahtui odottamaton virhe";
                }

                setApiData({
                    ...apiData,
                    virhe : virheteksti,
                    haettu : true
                });
            }

        }catch (e: any){
            
            setApiData({
                ...apiData,
                virhe : "Palvelimeen ei saada yhteyttä",
                haettu : true
            })

        }

    }

    const apiKutsu = async (metodi? : string, blogiteksti? : Blogiteksti, id? : number) : Promise<void> => {
    

        let url= (!props.kirjautuminen) ? `/api/blogitekstit` : (id) ? `/api/yllapito/${id}` : `/api/yllapito`;

        let asetukset : fetchAsetukset = {
            method : metodi || "GET"

        };
        if (metodi === "POST" || metodi === "PUT") {
            asetukset = {
                ...asetukset,
                headers : {
                    'Authorization': `Bearer ${props.token}`,
                    'Content-Type': 'application/json'

                },
                body : JSON.stringify(blogiteksti)
            }
        } 
        if (props.kirjautuminen){
            console.log("onnistui");
            asetukset = {
                ...asetukset,
                headers : {
                    'Authorization' : `Bearer ${props.token}`,
                    'Content-Type': 'application/json'
                }
            }
        }
        try{
        
            const yhteys = await fetch(url, asetukset);
            
            if (yhteys.ok){
                setApiData({
                    ...apiData,
                    blogitekstit : await yhteys.json(),
                    haettu : true
                })
                
            } else {
                let virheteksti : string ="";

                switch (yhteys.status){
                    case 400 : virheteksti = "Virhe pyynnön tiedoissa"; break;
                    case 401 : virheteksti = "Virheellinen token"; break;
                    default : virheteksti = "Palvelimella tapahtui odottamaton virhe"; break;
                }
                setApiData({
                    ...apiData,
                    virhe: virheteksti,
                    haettu : true
                })
            }


        }catch (e: any){
            setApiData({
                ...apiData,
                virhe : "Palvelimeen ei saada yhteyttä",
                haettu : true
            });

        }

    }
    useEffect(() => {
        apiKutsu();
    }, [props.kirjautuminen]);

    const kaynnistaHaku = () => {




    }

    const poistaKirjoitus = (id : number) => {
        apiKutsu("DELETE",undefined, id);
    }
    const lisaaTykkayksia = (blogiteksti : Blogiteksti) => {

        tykkaysKutsu("PUT", {
            id : blogiteksti.id,
            otsikko : blogiteksti.otsikko,
            sisalto : blogiteksti.sisalto,
            kuva : blogiteksti.kuva,
            kayttajaId : blogiteksti.kayttajaId,
            kayttaja : blogiteksti.kayttaja,
            tykkaykset : (blogiteksti.tykkaykset+1),
            eiTykkaykset : blogiteksti.eiTykkaykset,
            julkaistu : blogiteksti.julkaistu,
            createdAt : blogiteksti.createdAt,
            updatedAt : blogiteksti.updatedAt
        }, blogiteksti.id);
        
    }
    const vahennaTykkayksia = (blogiteksti : Blogiteksti) => {
        
        tykkaysKutsu("PUT", {
            id : blogiteksti.id,
            otsikko : blogiteksti.otsikko,
            sisalto : blogiteksti.sisalto,
            kuva : blogiteksti.kuva,
            kayttajaId : blogiteksti.kayttajaId,
            kayttaja : blogiteksti.kayttaja,
            tykkaykset : blogiteksti.tykkaykset,
            eiTykkaykset : (blogiteksti.eiTykkaykset+1),
            julkaistu : blogiteksti.julkaistu,
            createdAt : blogiteksti.createdAt,
            updatedAt : blogiteksti.updatedAt
        }, blogiteksti.id);
    }
    const saveEditData = (blogiteksti : Blogiteksti) => {

        setEditData(blogiteksti);
    }
  

    return (
    
    <Container>
    <Box sx={{
        display: 'flex',
        height: '300px',
        margin: 'auto'}}>
        <AppBar
            component="nav"
            sx={{
                backgroundColor:'white'
            }}>
            <Box sx={{
                display: 'top right',
                textAlign: 'right',
                marginTop: '20px'
                }}>
                { (!props.kirjautuminen) ?
                <IconButton
                    sx={[
                        {
                        '&:hover': {
                        color : 'blue'
                        },
                        }
                    ]}
                    onClick= { () => {navigate("/login")}}>
                    <LoginIcon
                        sx={{
                        fontSize: 'medium'
                        }}/>
                    <Typography                    
                        sx={{
                        color:'black',
                        marginLeft: '3px'
                    }}>Log in</Typography>
                </IconButton>
                    :
                <IconButton
                    sx={[
                        {
                        '&:hover': {
                        color : 'blue'
                        }
                        }
                    ]}
                    onClick = { (e) => {
                        localStorage.clear();
                        props.setKirjautuminen(false);
                        }}>
                    <LogoutIcon sx={{fontSize: 'medium'}}/>
                    <Typography                    
                        sx={{
                        color:'black',
                        marginLeft: '3px'
                    }}>Log out</Typography>
                </IconButton>
                }    
            </Box>
                
                <Typography
                className="font-link"
                    sx={{
                        margin:"auto",
                        marginTop:"55px",
                        fontSize:"36px",
                        color:'black'
                    }}>
                MARJUKKA JOENSUU
                </Typography>
                <Toolbar>              
                    <Box 
                        sx={{  
                        display: { xs: 'none', md: 'flex'},
                        marginLeft:'40%'
                        }}>
                    {pages.map((page) => (
                        <Button
                            key={page}
                             sx={{
                                my: 2, 
                                color: 'black', 
                                display: 'block',
                                 }}
                                >
                                 {page}
                        </Button>
                    ))}
                    </Box>

                </Toolbar> 
            </AppBar>
        </Box>
        <Box
            sx={{
            display: 'flex',
            margin:'auto',
            marginBottom: '40px',
            width: '95%'
            }}>
        { (props.kirjautuminen) ?
            
            <Button
                color= 'inherit'
                size='small'
                sx={{
                height: '38px',
                padding: '10px',
                width: '26%',
                backgroundColor: '#E8AA42',
                textAlign: 'center',
                }}
                onClick= { () => {setOpenDialog(true);}}
                >
                    <AddIcon
                        fontSize= 'medium'
                        sx={{
                            marginRight: '5px'
                        }}/>
                Add new blogtext
            </Button>
            : null

        }
        </Box>
        <Box
            sx={{
                display: 'flex',
                margin: 'auto',
                width: '95%'
            }}>
            { Boolean(apiData.virhe) ?
            <Alert severity= "error">{apiData.virhe}</Alert>
            : (apiData.haettu)
            ? 
            <Stack spacing={6}>
            
            {apiData.blogitekstit.map((blogiteksti: Blogiteksti, idx : number) => {
                
                return (

                (blogiteksti.julkaistu) ?
                <Paper 
                    key={idx}
                    elevation={2}
                    sx={{
                        textAlign: 'center',
                        marginTop: '20px',
                        marginBottom: '40px',
                        padding: '20px',
                        width: '100%',
                    }}>
                    <Box
                        sx={{
                            width: '100%',
                            height: '45px',
                            marginBottom: '5px'
                        }}>
                    <Typography
                        variant="h6"
                        sx={{
                            float: 'left',
                        }}>{blogiteksti.kayttaja}</Typography>
                    <Typography
                        variant="h4"
                        sx={{
                            fontWeight: 'bold',
                        }}>{blogiteksti.otsikko}
                    </Typography>
                    </Box>
                <Box
                    sx={{
                        width: '100%'
                    }}>
                    <Typography
                        variant="body2"
                        sx={{
                            marginBottom: '5px',
                            color: 'grey'
                        }}>{format(parseJSON(blogiteksti.createdAt), "dd.MM.yyyy h.m")}
                    </Typography>
                    { (blogiteksti.updatedAt !== blogiteksti.createdAt) ?
                    <Typography
                        variant="body2"
                        sx={{
                            marginBottom: '20px',
                            color: 'grey'
                        }}>Edited {format(parseJSON(blogiteksti.updatedAt), "dd.MM.yyyy h.m")}
                    </Typography>
                    : null
                    }
                </Box>
                {(props.kirjautuminen) ?
                    <Box
                        sx={{
                            float: 'right',
                        }}>
                        <IconButton>
                            <EditIcon
                                onClick={() => {
                                    setOpenEditDialog(true);
                                    saveEditData(blogiteksti);
                                }}
                                fontSize='medium'/>
                        </IconButton>
                        <IconButton>
                            <DeleteIcon
                                onClick={() => {poistaKirjoitus(blogiteksti.id)}}
                                fontSize='medium'/>
                        </IconButton>
                        <IconButton
                             onClick={(e) =>{
                                apiKutsu("PUT", {
                                    id : blogiteksti.id,
                                    otsikko : blogiteksti.otsikko,
                                    sisalto : blogiteksti.sisalto,
                                    kuva : blogiteksti.kuva,
                                    kayttajaId : blogiteksti.kayttajaId,
                                    kayttaja : blogiteksti.kayttaja,
                                    tykkaykset : blogiteksti.tykkaykset,
                                    eiTykkaykset : (blogiteksti.eiTykkaykset+1),
                                    julkaistu : !(blogiteksti.julkaistu),
                                    createdAt : blogiteksti.createdAt,
                                    updatedAt : blogiteksti.updatedAt
                                }, blogiteksti.id)
                            }}>
                            { (blogiteksti.julkaistu) ?
                            <UnpublishedIcon/>
                            :
                            <PublishIcon/>
                            }
                        </IconButton>
                    </Box>
                : null
                }
                    <img
                        width='100%'
                        height='500px'
                        src={`/kuvat/${blogiteksti.kuva}.jpg`}
                    />
                    <Typography
                        variant="h6"
                        sx={{
                            marginBottom: '20px'
                        }}>
                        <span dangerouslySetInnerHTML={{__html : blogiteksti.sisalto}}/>
                    </Typography>
                    <Box
                        sx={{
                            padding: '10px'
                        }}>
                        <Button
                            color="inherit"
                            sx={{
                                backgroundColor: '#F3B9B5',
                                width: '240px',
                                marginRight: '10px'
                            }}
                            onClick= {() => {lisaaTykkayksia(blogiteksti)}}
                            >
                                <ThumbUpIcon
                                    fontSize= 'small'
                                    sx={{
                                        marginRight: '10px',
                                    }}/>
                            Hyvin sanottu ({blogiteksti.tykkaykset})
                        </Button>
                        <Button
                            color="inherit"
                            sx={{
                                backgroundColor: '#F0CB9B',
                                width: '240px'
                            }}
                            onClick= {() => {vahennaTykkayksia(blogiteksti)}}
                            >
                            
                                <ThumbDownIcon
                                    fontSize= 'small'
                                    sx={{
                                        marginRight: '10px'
                                    }}/>
                                En ole samaa mieltä ({blogiteksti.eiTykkaykset})
                        </Button>
                    </Box>
                </Paper>
                : null 
                
                )

            })
            }
                <Lisays openDialog ={openDialog} setOpenDialog={setOpenDialog} apiKutsu={apiKutsu}/>
                <Muokkaus openEditDialog={openEditDialog} setOpenEditDialog={setOpenEditDialog} apiKutsu={apiKutsu} editData={editData}/>
            </Stack>
            : <Backdrop open={true}>
                <CircularProgress color='inherit'/>
            </Backdrop>

            }
        </Box>
    </Container>
    )
}
export default Blogitekstit;
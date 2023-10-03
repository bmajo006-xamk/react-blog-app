import React, {useRef, useState, Dispatch, SetStateAction} from 'react';
import {Backdrop, Button, Box, Paper, TextField, Typography, Stack, Container, Link, Alert} from '@mui/material';
import {useNavigate, NavigateFunction} from 'react-router-dom';


interface Props {
    setToken : Dispatch<SetStateAction<string>>
    setKirjautuminen : Dispatch<SetStateAction<boolean>>
}

interface formError {
    tunnus : boolean
    salasana : boolean
}

const Login : React.FC<Props> = (props : Props) : React.ReactElement => {

    const lomakeRef = useRef<HTMLFormElement>();

    const navigate : NavigateFunction = useNavigate();

    const [virheteksti, setVirheteksti] = useState<String>();

    const kirjaudu = async (e : React.FormEvent) : Promise<void> => {
        e.preventDefault();

        if (lomakeRef.current?.kayttajatunnus.value){
            if (lomakeRef.current?.salasana.value){

                const yhteys = await fetch("/api/auth/login", {
                    method: "POST",
                    headers : {
                        'Content-Type': 'application/json'
                    },
                    body : JSON.stringify({
                        kayttajatunnus : lomakeRef.current?.kayttajatunnus.value,
                        salasana : lomakeRef.current?.salasana.value
                    })
                });

            if (yhteys.ok){
                
                //palauttaa objektin, siksi {}
                let {token} = await yhteys.json();


                props.setToken(token);
                props.setKirjautuminen(true);
                //tallennetaan token localStorageen, käyttäjän koneella
                localStorage.setItem("token", token);
        
                navigate("/");
            } else {

                switch(yhteys.status){
                    case 401 : setVirheteksti("Wrong username or password"); break;
                    default : setVirheteksti("Palvelimella tapahtui odottamaton virhe");
                }
            }
            } 
        }
    }



    return (
    <Container>
        <Backdrop
            open={true}>
            <Paper 
                sx= {{ 
                padding:2,
                width: '360px',
                height: '460px'
                }}>
                <Box
                    component="form"
                    onSubmit= {kirjaudu}
                    ref={lomakeRef}>
                    <Stack
                        spacing={2}
                        sx={{
                            marginBottom: 6
                        }}>
                        <Typography
                            variant= "h4"
                            sx={{
                                color: "black",
                                fontWeight: "bold",
                                marginTop: "30px",
                                marginBottom: "30px"
                            }}>
                            Log in</Typography>
                        <TextField
                            placeholder="Username"
                            sx={{
                                fontColor: "black",
                                fontWeight: "bold"}}                            
                            name="kayttajatunnus"/>
                        <TextField
                            placeholder="Password"
                            name="salasana"
                            type="password"
                            sx={{
                                marginBottom: '20px'
                            }}/>
                    </Stack>
                    { (virheteksti) ? 
                    <Alert 
                        severity="error"
                        sx={{
                            marginBottom: "10px"
                        }}>{virheteksti}</Alert>
                        : <Box sx={{height: 47}}></Box>
                    }       
                    <Stack spacing={2}>
                        <Link
                            variant="h6"
                            sx={{
                                color: "black",
                                fontWeight: "bold"}}   
                            onClick= {(e) => {navigate("/register")}}
                            style={{
                            marginTop:"10px"
                        }}>Register new account</Link>
                          
                        <Button
                            type="submit"
                            variant="contained"
                            sx={[
                                {backgroundColor: 'black'},
                                {height: '50px'},
                                {
                                '&::hover': {
                                    color : 'grey'
                                },
                                }
                            ]}
                            >Log in</Button>
                        </Stack>
                </Box>
            </Paper>
        </Backdrop>
    </Container>
    )
}
export default Login;
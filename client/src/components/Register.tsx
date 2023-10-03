import React, {useRef, useState} from "react";
import {Backdrop, Box, Button, Paper, TextField, Typography, Stack, Alert} from '@mui/material';
import { useNavigate, NavigateFunction } from "react-router-dom";

const Register : React.FC = () : React.ReactElement => {



    const lomakeRef = useRef<HTMLFormElement>();

    const navigate : NavigateFunction = useNavigate();

    const [virheteksti, setVirheteksti] = useState<String>();


    const tallenna = async (e : React.FormEvent) : Promise<void> => {
        e.preventDefault();
        if (lomakeRef.current?.username.value){
            if (lomakeRef.current?.password.value){
                if (lomakeRef.current?.password.value === lomakeRef.current?.verifyPassword.value){

                    const yhteys = await fetch("/api/auth/register",{
                        method : "POST",
                        headers : {
                            'Content-Type': 'application/json'
                        },
                        body : JSON.stringify({
                            kayttajatunnus : lomakeRef.current?.username.value,
                            salasana : lomakeRef.current?.password.value

                        })
                    })

                    if (yhteys.ok){
                        alert("rekisteröityminen onnistui");
                        navigate("/login");

                    } else {

                        switch(yhteys.status){
                            case 409 : setVirheteksti("Username already in use"); break; 
                            default : setVirheteksti("Palvelimella tapahtui odottamaton virhe");

                        }

                    }
                } else {
                    setVirheteksti("Paswords do not match");
                }
            }

        }
    }

    return (
    
    <Backdrop open={true}>
        <Paper
            sx={{
                padding:2,
                width: '360px',
                height: '480px'
            }}>
            <Box
                component="form"
                onSubmit={tallenna}
                ref={lomakeRef}>
                <Stack spacing={2} sx={{marginBottom: 5}}>
                    <Typography
                        variant="h4"
                        sx={{
                            fontWeight: 'bold',
                            marginTop: '30px'
                        }}
                    >Register new account</Typography>
                    <TextField
                        placeholder="Usename"
                        name="username"
                    />
                    <TextField
                        placeholder="Password"
                        type="password"
                        name="password"
                    />
                    <TextField
                        placeholder="Verify password"
                        type="password"
                        name="verifyPassword"
                    />
                </Stack>
                { (virheteksti) ? 
                <Alert 
                    severity="error"
                    sx={{
                        marginBottom: "10px"
                    }}>{virheteksti}</Alert>
                : <Box sx={{height: 47}}></Box>
                }
                <Stack spacing={1}>
                    <Button
                        type="submit"
                        variant="contained"
                        sx={{
                            color: "#000000",
                            backgroundColor: "#E8AA42",
                            height: "45px",
                        }}
                    >Register</Button>
                    <Button
                        variant="outlined"
                        sx={{
                            color: "#000000",
                            borderColor: "#E8AA42",
                            height: "45px"
                        }}
                        onClick={() => {navigate("/login")}}
                    >Cancel</Button>
                </Stack>
            </Box>
        </Paper>
    </Backdrop>
    )
}
export default Register;
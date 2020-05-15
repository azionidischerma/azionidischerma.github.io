import React, { useState } from 'react';

import { makeStyles } from '@material-ui/core/styles';
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import Typography from '@material-ui/core/Typography';
import Button from '@material-ui/core/Button';
import ExitToAppIcon from '@material-ui/icons/ExitToApp';
import IconButton from '@material-ui/core/IconButton';

import { useLocation } from 'react-router-dom'

import * as firebase from "firebase/app";

const useStyles = makeStyles((theme) => ({
    title: {
      flexGrow: 1,
    },
  }));

function Barra() {
    const classes = useStyles();
    var loc = useLocation().pathname
    return (
      <AppBar position="fixed" color="primary" elevation={0}>
        <Toolbar>
          <Typography href="/" variant="h6" className={classes.title}>
            Azioni di scherma
          </Typography>
          {loc === "/maestro" ? 
          <><Button href="/" style={{color:"white"}}>Home</Button>
          <IconButton style={{color:"white"}} aria-label="logout" onClick={() => { firebase.auth().signOut() }}>
            <ExitToAppIcon />
          </IconButton></>:
          (loc === "/atleta" ?
            <><Button href="/" style={{color:"white"}}>Home</Button>
            <IconButton style={{color:"white"}} aria-label="logout" onClick={() => { firebase.auth().signOut() }}>
              <ExitToAppIcon />
            </IconButton></>:
            <Button href="/maestro" style={{color:"white"}}>maestro</Button>
          )
          }
        </Toolbar>
      </AppBar>
    )
  }

export default Barra
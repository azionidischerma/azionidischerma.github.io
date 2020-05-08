import React, { useState } from 'react';
import './App.css';

import { makeStyles } from '@material-ui/core/styles';
import IconButton from '@material-ui/core/IconButton';
import Grid from '@material-ui/core/Grid';
import TextField from '@material-ui/core/TextField';
import AddCircleIcon from '@material-ui/icons/AddCircle';
import SaveIcon from '@material-ui/icons/Save';
import CloseIcon from '@material-ui/icons/Close';
import Snackbar from '@material-ui/core/Snackbar';
import Select from '@material-ui/core/Select';
import InputLabel from '@material-ui/core/InputLabel';
import FormControl from '@material-ui/core/FormControl';
import Divider from '@material-ui/core/Divider';

import * as firebase from "firebase/app";
import '@firebase/firestore'

const useStyles = makeStyles((theme) => ({
    root: {
      flexGrow: 1,
    },
    menuButton: {
      marginRight: theme.spacing(2),
    },
    title: {
      flexGrow: 1,
    },
    formControl: {
      margin: theme.spacing(1),
      minWidth: 180,
    },
  }));

function NuovaSnackBar(props){
    return <Snackbar
        anchorOrigin={{
            vertical: 'bottom',
            horizontal: 'left',
        }}
        open={props.open}
        autoHideDuration={5000}
        onClose={props.handleClose}
        message={props.messaggio}
        action={
            <React.Fragment>
            <IconButton size="small" aria-label="close" color="inherit" onClick={props.handleClose}>
                <CloseIcon fontSize="small" />
            </IconButton>
            </React.Fragment>
        }
        />
}

async function getSequenzeSalvate(listaSequenze, setListaSequenze) {
    if (listaSequenze === undefined){
      console.log("UNDEFINED")
      return
    }
    if (listaSequenze[0] !== "caricamento..."){
        return
    }
    const snapshot = await firebase.firestore().collection(firebase.auth().currentUser.uid).get()
    setListaSequenze([""].concat(snapshot.docs.map(doc => doc.id).filter(id => id !== "c76ln8qXtrzFjQirovu1")))

}

async function getMail(listaMail, setListaMail, nomeSequenza){
  if (listaMail[0].testo !== "caricamento..." || nomeSequenza == ""){
    return false
  }
  let sequenza = firebase.firestore().collection(firebase.auth().currentUser.uid).doc(nomeSequenza)
  sequenza.get().then(docs => setListaMail(docs.data().atleti.map((mail, index) => ({chiave: index, testo: mail}))))
  .catch((err) => {
    console.log(err)
    setListaMail([{chiave: 0, testo: ""}])
  })
  return true
}

function MaestriAtleti(props){
    const classes = useStyles();
    const [selezione, setSelezione] = useState("")
    const [snackAperta, setSnackAperta] = useState(false)
    const [messaggioSnack, setMessaggioSnack] = useState("")
    const [listaSequenze, setListaSequenze] = useState(["caricamento..."])
    const [numeroInput, setNumeroInput] = useState(-1)
    const [listaMail, setListaMail] = useState([{chiave:0, testo:"caricamento..."}])
    const [avvisato, setAvvisato] = useState(false)
  
    const handleChange = (event) => {
      setSelezione(event.target.value)
      setListaMail([{chiave:0, testo:"caricamento..."}])
      setNumeroInput(-1)
    };
    const apriSnack = (messaggio) => {
      setSnackAperta(true)
      setMessaggioSnack(messaggio)
    } 
    const chiudiSnack = (event, reason) => {
      if (reason === 'clickaway') {
        return;
      }
    
      setSnackAperta(false)
    }

    const aggiungiMail = (key, text) => {
        try{
          if(listaMail.map((v) => v.chiave).includes(key)){
            let cambio = listaMail;
            cambio[key].testo = text;
            setListaMail(cambio);
          } else {
            setListaMail(listaMail.concat({chiave: key, testo: text}))
          }
         } catch (err) {
             console.log(err)
          setListaMail(listaMail.concat({chiave: key, testo: text}))
        }
      }

    const salva = () => {
        if (selezione === ""){
            apriSnack("Selezione una sequenza per salvare.")
            return
        }

        let mailData = {
            atleti: listaMail.map((utente) => utente.testo)
        }
        
        const db = firebase.firestore();
        var coll = db.collection(firebase.auth().currentUser.uid)
        coll.doc(selezione).set(mailData, {merge: true});
        getSequenzeSalvate(props.listaSequenze, props.setListaSequenze)
        apriSnack("Salvato.")
        return
      }

    getSequenzeSalvate(listaSequenze, setListaSequenze)
    getMail(listaMail, setListaMail, selezione)
    if (numeroInput === -1 && listaMail[0].testo !== "caricamento..."){
      setNumeroInput(listaMail.length)
    }

    if (listaSequenze.length === 1 && listaSequenze[0] === "" && !avvisato){
      apriSnack("Prima di aggiungere atleti crea delle sequenze di azioni.")
      setAvvisato(true)
    }
  
    return (
      <>
      <NuovaSnackBar open={snackAperta} messaggio={messaggioSnack} handleClose={chiudiSnack}/>
      <Grid
        container
        direction="column"
        justify="flex-start"
        alignItems="center"
        style={{ minHeight: '80vh' }}
      >
       <Grid item xs={12} alignItems="center" style={{marginTop: "40px"}}> 
          <FormControl variant="filled" className={classes.formControl}>
            <InputLabel htmlFor="filled-age-native-simple">Sequenze</InputLabel>
            <Select
              native
              value={selezione}
              onChange={(event) => handleChange(event)}
              inputProps={{
                name: 'azioni',
                id: 'filled-azini-native-simple',
              }}
            >
            {listaSequenze.map((sequenzaN) =><option value={sequenzaN}>{sequenzaN}</option>)}
          </Select>
        </FormControl>
       </Grid>
        {selezione !== "" ? <Grid item xs={12} alignItems="center" style={{marginTop: "40px"}} key={selezione}> 
            <Grid
                container
                direction="column"
                justify="center"
                alignItems="center"
                key={"nuova" + selezione}
            >
            {Array((numeroInput !== -1 ? numeroInput : 1)).fill(1).map((x, y) => x + y - 1).map((chiave) =>
                (
                <Grid item xs={9} alignItems="center" key={"azione" + chiave.toString()}>
                    <TextField 
                    id={"mailAtleta" + chiave.toString()}
                    label="Email atleta" 
                    onChange={(e) => aggiungiMail(chiave, e.target.value)}
                    key={"mailAtleta" + chiave.toString() + listaMail[chiave].testo}
                    defaultValue={listaMail[chiave].testo}
                    />
                </Grid>
                )
            )}
            </Grid>
            <Grid item xs={12} alignItems="center" style={{marginTop: "20px"}}>
            <IconButton color="primary" aria-label="aggiungi" onClick={() => setNumeroInput(numeroInput + 1 ) }>
                <AddCircleIcon />
            </IconButton>
            </Grid>
            <Grid item xs={12} alignItems="center">
            <Divider />
            <IconButton color="primary" aria-label="save" onClick={() => salva() }>
                <SaveIcon />
            </IconButton>
            </Grid>
        </Grid> : undefined}
    </Grid>
    </>
    )
}

export default MaestriAtleti
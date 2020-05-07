import React, { useState } from 'react';
import './App.css';

import PropTypes from "prop-types";

// Material
import { createMuiTheme, makeStyles, ThemeProvider, responsiveFontSizes, withStyles } from '@material-ui/core/styles';
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import Typography from '@material-ui/core/Typography';
import Button from '@material-ui/core/Button';
import IconButton from '@material-ui/core/IconButton';
import ExitToAppIcon from '@material-ui/icons/ExitToApp';
import Grid from '@material-ui/core/Grid';
import TextField from '@material-ui/core/TextField';
import AddCircleIcon from '@material-ui/icons/AddCircle';
import Fab from '@material-ui/core/Fab';
import SaveIcon from '@material-ui/icons/Save';
import CloseIcon from '@material-ui/icons/Close';
import Snackbar from '@material-ui/core/Snackbar';
import Paper from '@material-ui/core/Paper';
import Select from '@material-ui/core/Select';
import InputLabel from '@material-ui/core/InputLabel';
import FormControl from '@material-ui/core/FormControl';
import Divider from '@material-ui/core/Divider';
import MenuItem from '@material-ui/core/MenuItem';

import * as firebase from "firebase/app";
import '@firebase/firestore'
import 'firebaseui'
import StyledFirebaseAuth from 'react-firebaseui/StyledFirebaseAuth';

const firebaseConfig = {
  apiKey: "AIzaSyCe8mQ5RcM_tm7LPvM1kxbJ211Fq7G3fFA",
  authDomain: "scherma-d21ad.firebaseapp.com",
  databaseURL: "https://scherma-d21ad.firebaseio.com",
  projectId: "scherma-d21ad",
  storageBucket: "scherma-d21ad.appspot.com",
  messagingSenderId: "720411353134",
  appId: "1:720411353134:web:d7c17466ebf51edc34ffbf"
};

firebase.initializeApp(firebaseConfig);
firebase.firestore().enablePersistence()
  .catch(function(err) {
      if (err.code === 'failed-precondition') {
          // Multiple tabs open, persistence can only be enabled
          // in one tab at a a time.
          // ...
      } else if (err.code === 'unimplemented') {
          // The current browser does not support all of the
          // features required to enable persistence
          // ...
      }
  });

let theme = createMuiTheme({
  palette: {
    background: {
      default: "#282c34"
    },
    primary: { main: '#282c34' },
    secondary: { main: '#ffffff' },
  },
  status: {
    danger: 'orange',
  },
  typography: {
    h2: {
      color: "#fed111"
    },
    h1: {
      color: "#fed111"
    },
    h5: {
      color: "white"
    },
    h6: {
      color: "white"
    },
  },
});
theme = responsiveFontSizes(theme);

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

const styles = {
  InputLabelProps: {
    color: "white"
  },
  formMosse: {
    color: "white",
    fullWidth: true,
    borderBottom: '2px solid white',
    '&:after': {
      // The MUI source seems to use this but it doesn't work
      borderBottom: '2px solid white',
    },
  }
};

function Barra(props) {
  const classes = useStyles();
  return (
    <AppBar position="fixed" color="primary" elevation={0}>
      <Toolbar>
        <Typography variant="h6" className={classes.title} onClick={() => props.setSchermataMaestro(false)}>
          Scherma
        </Typography>
        {props.schermataMaestro ? 
        <><Button style={{color:"white"}} onClick={() => props.setSchermataMaestro(false)}>Home</Button>
        <IconButton style={{color:"white"}} aria-label="logout" onClick={() => { firebase.auth().signOut() }}>
          <ExitToAppIcon />
        </IconButton></>:
        <Button style={{color:"white"}} onClick={() => props.setSchermataMaestro(true)}>Maestro</Button>
        }
      </Toolbar>
    </AppBar>
  )
}

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

function Atleti(props){
  return (
    <div>Ciao atleti</div>
  )
}

function CreaNuovaSequenza(props){
  const [listaMosse, setListaMosse] = useState([])
  const [listaTempi, setListaTempi] = useState([])
  const [nomeSequenza, setNomeSequenza] = useState("")
  const [numeroInput, setNumeroInput] = useState(1)
  const aggiungiMossa = (key, text) => {
    try{
      if(listaMosse.map((v) => v.chiave).includes(key)){
        let cambio = listaMosse;
        cambio[key].testo = text;
        setListaMosse(cambio);
      } else {
        setListaMosse(listaMosse.concat({chiave: key, testo: text}))
      }
     } catch (err) {
      setListaMosse(listaMosse.concat({chiave: key, testo: text}))
    }
  }
  
  const aggiungiTempo = (key, text) => {
    try{
      if(listaTempi.map((v) => v.chiave).includes(key)){
        let cambio = listaTempi;
        cambio[key].testo = text;
        setListaTempi(cambio);
      } else {
        setListaTempi(listaTempi.concat({chiave: key, testo: text}))
      }
     } catch (err) {
      setListaTempi(listaTempi.concat({chiave: key, testo: text}))
    }
  }

  const salva = () => {
    console.log("SALVO")
    if(nomeSequenza === ""){
      props.apriSnack("Inserisci il nome della sequenza per salvare.")
      return
    } else {
      props.chiudiSnack()
    }
    if(listaMosse.length !== listaTempi.length){
      props.apriSnack("Mancano delle mosse o dei tempi.")
      return
    }
    props.apriSnack("Salvato.")
    console.log(listaMosse)
    console.log(listaTempi)
    return
  }
  
  return (
    <Grid
      container
      direction="column"
      justify="center"
      alignItems="center"
    >
        <Grid item xs={9} justify="center" alignItems="center">
          <TextField 
                id="nomesequenza" 
                label="Nome sequenza" 
                onChange={(e) => setNomeSequenza(e.target.value)}
                />
        </Grid>
        <Grid item xs={9} justify="center" alignItems="center">
          {Array(numeroInput).fill(1).map((x, y) => x + y - 1).map((chiave) =>
            (<Grid
              container
              direction="row"
              justify="center"
              alignItems="center"
              spacing={1}
            >
              <Grid item xs={8} justify="center" alignItems="center">
                <TextField 
                id="azione" 
                label="Azione" 
                onChange={(e) => aggiungiMossa(chiave, e.target.value)}
                />
              </Grid>
              <Grid item xs={4} justify="center" alignItems="center">
                <TextField 
                id="tempo" 
                label="Tempo" 
                onChange={(e) => aggiungiTempo(chiave, e.target.value)}
                />
              </Grid>
            </Grid>)
          )}
        </Grid>
        <Grid item xs={3} justify="flex-start" alignItems="center" style={{marginTop: "20px"}}>
          <IconButton color="primary" aria-label="aggiungi" onClick={() => setNumeroInput(numeroInput + 1 ) }>
            <AddCircleIcon />
          </IconButton>
        </Grid>
        <Grid item xs={12} justify="flex-bottom" alignItems="center">
          <Divider />
          <IconButton color="primary" aria-label="save" onClick={() => salva() }>
            <SaveIcon />
          </IconButton>
        </Grid>
    </Grid>
  )
}

function Azioni(props){
  const classes = useStyles();
  const [state, setState] = useState({
    azioni: '',
    name: 'hai',
  });
  const [nuovaSequenza, setNuovaSequenza] = useState(false)
  const [snackAperta, setSnackAperta] = useState(false)
  const [messaggioSnack, setMessaggioSnack] = useState("")
  const handleChange = name => event => {
    setState({
      ...state,
      [name]: event.target.value,
    });
    if (event.target.value == "creaNuova883745"){
      setNuovaSequenza(true)
    } else {
      setNuovaSequenza(false)
    }
  };
  const apriSnack = (messaggio) => {
    console.log("apri snack")
    setSnackAperta(true)
    setMessaggioSnack(messaggio)
  } 
  const chiudiSnack = (event, reason) => {
    if (reason === 'clickaway') {
      return;
    }
  
    setSnackAperta(false)
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
     <Grid item xs={12} justify="center" alignItems="center" style={{marginTop: "40px"}}> 
        <FormControl variant="filled" className={classes.formControl}>
          <InputLabel htmlFor="filled-age-native-simple">Sequenze</InputLabel>
          <Select
            native
            value={state.azioni}
            onChange={handleChange('azioni')}
            inputProps={{
              name: 'azioni',
              id: 'filled-azini-native-simple',
            }}
          >
          <option value="" />
          <option value={10}>Ten</option>
          <option value={20}>Twenty</option>
          <Divider />
          <option value="creaNuova883745">+ Crea nuova</option>
        </Select>
      </FormControl>
     </Grid>
     {nuovaSequenza ? <CreaNuovaSequenza apriSnack={apriSnack} chiudiSnack={chiudiSnack}/> : undefined}
    </ Grid>
    </>
  )
}

function Finestra(props){
  var margine = "50px";
  return (
    <div className="App">
        <div className="App-body">
          <Paper style={{margin:margine, marginTop:"80px", minHeight:"80vh"}}>
          <IconButton style={{color:"black", position:"fixed", right:margine}} aria-label="logout" onClick={() => { props.chiudiFinestra() }}>
            <CloseIcon />
          </IconButton>
            {props.cosa == "atleti" ? <Atleti apriSnack={props.apriSnack} chiudiSnack={props.apriSnack}/>
             : <Azioni/>}
          </Paper>
        </div>
    </div>
  )
}

class Maestro extends React.Component {
// The component's Local state.
state = {
  isSignedIn: false, // Local signed-in state.
  azioni: false,
  atleti: false
};

// Configure FirebaseUI.
uiConfig = {
  // Popup signin flow rather than redirect flow.
  signInFlow: 'popup',
  signInOptions: [
    firebase.auth.GoogleAuthProvider.PROVIDER_ID,
  ],
  callbacks: {
    // Avoid redirects after sign-in.
    signInSuccessWithAuthResult: () => false
  }
};

// Listen to the Firebase Auth state and set the local state.
componentDidMount() {
  this.unregisterAuthObserver = firebase.auth().onAuthStateChanged(
    (user) => this.setState({ isSignedIn: !!user })
  );
}

// Make sure we un-register Firebase observers when the component unmounts.
componentWillUnmount() {
  this.unregisterAuthObserver();
}

chiudiFinestra = () => {
  this.setState({azioni : false, atleti: false})
}

render() {
  if (this.state.azioni){
    return <Finestra cosa="azioni" chiudiFinestra={this.chiudiFinestra}/>
  }
  if (this.state.atleti){
    return <Finestra cosa="atleti" chiudiFinestra={this.chiudiFinestra}/>
  }
  if (!this.state.isSignedIn) {
    return (
      <div className="App">
        <header className="App-header">
          <StyledFirebaseAuth uiConfig={this.uiConfig} firebaseAuth={firebase.auth()} />
        </header>
      </div>
    );
  }
  else {
    return (
      <div className="App">
        <div className="App-body">
          <Grid
            container
            direction="column"
            justify="center"
            alignItems="center"
            style={{ minHeight: '100vh', minWidth: '100vw' }}
          >
            <Grid item xs={12} sm={6} justify="center" alignItems="center">
              <Typography variant="h4">Benvenuto {firebase.auth().currentUser.displayName}</Typography>
            </Grid>
            <Grid item xs={3} justify="center" alignItems="center">
              <div style={{height:"40px"}}/>
            </Grid>
            <Grid item xs={12} sm={6} justify="center" alignItems="center">
              <Grid
              container
              direction="row"
              justify="center"
              alignItems="center"
              spacing={3}
              >
                <Grid item xs={6} justify="center" alignItems="center">
                  <Button variant="contained" color="secondary" size="large" onClick={() => this.setState({azioni:true})}>
                    Azioni
                  </Button>
                </Grid>
                <Grid item xs={6} justify="center" alignItems="center">
                  <Button variant="contained" color="secondary" size="large" onClick={() => this.setState({atleti:true})}>
                    Atleti
                  </Button>
                </Grid>
              </Grid>
            </Grid>
          </Grid>
        </div>
      </div>
    )
  }
}
}

class CambiaMossa extends React.Component {
  componentDidMount() {
    this.interval = setInterval(() => this.setState({ time: Date.now() }), 1500);
  }
  componentWillUnmount() {
    clearInterval(this.interval);
  }
  render(){
    return <p>{this.props.mosse[Math.floor(Math.random() * this.props.mosse.length)]}</p>
  }
}

function Mossa() {
  const [mosse, setMosse] = useState(["caricamento..."]);
  const db = firebase.firestore();
  if (mosse[0] === "caricamento..."){
    var mosseRef = db.collection("mosse");
    mosseRef.doc("oueHRRQQ7wt6sV087Ynl").get()
    .then(doc => {
      if (!doc.exists) {
        console.log('No such document!');
      } else {
        setMosse(doc.data().lista);
      }
    })
    .catch(err => {
      console.log('Error getting document', err);
    });

  }
  return (
    <div className="App">
      <header className="App-header">
        <CambiaMossa mosse={mosse} />
      </header>
    </div>
    )
 }


function App(props) {
  const [schermataMaestro, setSchermataMaestro] = useState(false);
  return (
    <div>
      <ThemeProvider theme={theme}>
        <Barra schermataMaestro={schermataMaestro} setSchermataMaestro={setSchermataMaestro}/>
          {schermataMaestro ? 
          <Maestro/> :
          <Mossa />}
      </ThemeProvider>
    </div>
  );
}

export default App;

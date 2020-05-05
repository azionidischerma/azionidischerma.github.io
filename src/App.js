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
    primary: { main: '#ffffff' },
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
  console.log(props.schermataMaestro);
  return (
    <AppBar position="fixed" color="transparent" elevation={0}>
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

class Maestro extends React.Component {
// The component's Local state.
state = {
  isSignedIn: false, // Local signed-in state.
  numeroInput: 1,
  erroreInputSocieta: false,
  nomeSocieta:""
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

salva = () => {
  if(this.state.nomeSocieta == ""){
    this.setState({erroreInputSocieta:true})
    return
  } else {
    this.setState({erroreInputSocieta:false})
  }
  return
}

render() {
  console.log(this.props.classes)
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
          <Fab color="primary" aria-label="add" onClick={() => this.salva()} style={{position:"fixed", right: "20px",bottom:"20px"}}>
            <SaveIcon />
          </Fab>
          <Grid
            container
            direction="column"
            justify="center"
            alignItems="center"
            style={{ minHeight: '100vh' }}
          >
            <Grid item xs={3} justify="flex-start" alignItems="flex-start" style={{marginTop: "20px"}}>
              <Typography variant="h4">Benvenuto {firebase.auth().currentUser.displayName}</Typography>
            </Grid>
            <Grid item xs={3} justify="flex-start" alignItems="flex-start" style={{marginTop: "20px"}}>
            <TextField
              id="outlined-secondary"
              label="Nome società"
              variant="outlined"
              color="primary"
              required={true}
              error={this.state.erroreInputSocieta}
              onChange={(e) => this.setState({ nomeSocieta: e.target.value })}
            />
            </Grid>
            <Grid item xs={6} justify="center" alignItems="center">
              <Grid
              container
              direction="row"
              justify="center"
              alignItems="center"
              >
                <Grid item xs={6} justify="center" alignItems="center">
                  {Array(this.state.numeroInput).fill(1).map(() =>
                    (<Grid
                      container
                      direction="row"
                      justify="center"
                      alignItems="center"
                      spacing={1}
                    >
                      <Grid item xs={6} justify="center" alignItems="center">
                        <TextField id="mossa" label="Mossa" InputLabelProps={{color:"primary"}} InputProps={{  className: this.props.classes.formMosse }}/>
                      </Grid>
                      <Grid item xs={6} justify="center" alignItems="center">
                        <TextField id="tempo" label="Tempo" InputLabelProps={this.props.classes.InputLabelProps} InputProps={{  className: this.props.classes.formMosse }}/>
                      </Grid>
                    </Grid>)
                  )}
                </Grid>
              </Grid>
            </Grid>
            <Grid item xs={3} justify="flex-end" alignItems="flex-end" style={{marginTop: "20px"}}>
              <IconButton style={{color:"white"}} aria-label="aggiungi" onClick={() => this.setState({ numeroInput: this.state.numeroInput + 1 }) }>
                <AddCircleIcon />
              </IconButton>
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
  const { classes } = props;
  return (
    <div>
      <ThemeProvider theme={theme}>
        <Barra schermataMaestro={schermataMaestro} setSchermataMaestro={setSchermataMaestro}/>
          {schermataMaestro ? 
          <Maestro classes={classes}/> :
          <Mossa />}
      </ThemeProvider>
    </div>
  );
}

App.propTypes = {
  classes: PropTypes.object.isRequired
};

export default withStyles(styles)(App);

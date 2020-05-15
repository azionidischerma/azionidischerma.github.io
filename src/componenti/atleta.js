import React, { useState } from 'react';
import '../App.css';

import { makeStyles } from '@material-ui/core/styles';
import Grid from '@material-ui/core/Grid';
import CloseIcon from '@material-ui/icons/Close';
import InputLabel from '@material-ui/core/InputLabel';
import FormControl from '@material-ui/core/FormControl';
import Select from '@material-ui/core/Select';

import * as firebase from "firebase/app";
import '@firebase/firestore'
import 'firebaseui'
import StyledFirebaseAuth from 'react-firebaseui/StyledFirebaseAuth';

const useStyles = makeStyles((theme) => ({
    select: {
        color: "white",
        '&:before': {
            borderColor: "white",
        },
        '&:after': {
            borderColor: "white",
        }
    },
    icon: {
        fill: "white",
    },
    formControl: {
      margin: theme.spacing(1),
      minWidth: 180,
      color: "white",
      borderBottom: "3px solid white"
    },
    inputLabel: {
        color:"white",
        borderColor: 'white',
        marginColor: 'white',
      },
  }));

async function getInviti(inviti, setInviti) {
if (inviti === undefined){
    console.log("UNDEFINED")
    return
}
if (inviti[0] !== "caricamento..."){
    return
}
const snapshot = await firebase.firestore().collectionGroup('esercizi').where("atleti", "array-contains", firebase.auth().currentUser.email).get()
console.log(snapshot.docs.map(doc => doc.id).filter(id => id !== "c76ln8qXtrzFjQirovu1"))
// setInviti([""].concat(snapshot.docs.map(doc => doc.id).filter(id => id !== "c76ln8qXtrzFjQirovu1")))

}

function ScegliInvito(){
    const [selezione, setSelezione] = useState("")
    const [inviti, setInviti] = useState(["caricamento..."])
    const classes = useStyles()

    const handleChange = (event) => {
        setSelezione(event.target.value)
      };

    getInviti(inviti, setInviti)

    return  <FormControl variant="standard" color="secondary" className={classes.formControl}>
                <InputLabel className={classes.inputLabel} htmlFor="standard-age-native-simple">Inviti</InputLabel>
                <Select
                native
                value={selezione}
                onChange={(event) => handleChange(event)}
                className={classes.select}
                inputProps={{
                    name: 'inviti',
                    id: 'filled-age-native-simple',
                    classes: {
                        icon: classes.icon,
                    },
                }}
                >
                    <option value=""/>
                    <option value="test">Test</option>
                    {/* {inviti.map((invitoN) =><option value={invitoN}>{invitoN}</option>)} */}
                </Select>
            </FormControl>
}

class Atleta extends React.Component {
    // The component's Local state.
    state = {
      isSignedIn: false, // Local signed-in state.
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
                    <Grid item xs={12} sm={6} alignItems="center">
                        <ScegliInvito />
                    </Grid>
                </Grid>
            </div>
          </div>
        )
      }
    }
    }

export default Atleta
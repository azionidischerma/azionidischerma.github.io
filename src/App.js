import React, { useState } from 'react';
import './App.css';

import * as firebase from "firebase/app";
import '@firebase/firestore'

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
  return <CambiaMossa mosse={mosse} />
 }


function App() {
  return (
    <div className="App">
      <header className="App-header">
        <Mossa />
      </header>
    </div>
  );
}

export default App;

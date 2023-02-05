/**
 * 
 * House of Haunted Root Vegetables
 * 
 * This is the front end for the House of Haunted Root Vegetables game,
 * developed for the 2023 Global Game Jam.
 * 
 * @author John Rooksby
 * @author Gavin Wood
 */

import root1 from './img/roots1.png';
import root2 from './img/roots2.png';
import root3 from './img/roots3.png';
import root4 from './img/roots4.png';
import root5 from './img/roots5.png';
import root6 from './img/roots6.png';
import root7 from './img/roots7.png';
import root8 from './img/roots8.png';
import root9 from './img/roots9.png';
import root10 from './img/roots10.png';
import root11 from './img/roots11.png';
import root12 from './img/roots12.png';

import './App.css';
import { useEffect, useState } from 'react';
import PlayerInput from './components/PlayerInput';

function App() {

  const [roomdescription, setRoomdescription] = useState("")
  const [exits, setExits] = useState([])
  const [exit, setExit] = useState("")
  const [loading, setLoading] = useState(false)
  const [playerName, setPlayerName] = useState({player1: {name:"Robert", alive:true}, player2: {name:"Susan",alive:true}, player3: {name:"Mike",alive:true}, player4: {name:"George", alive:true}, player5: {name:"Melissa",alive:true}})
  const [firstTurn, setFirstTurn] = useState(true)
  const [victim, setVictim] = useState("")
  const [moves, setMoves] = useState(0)

  let loadingText = ""

  // This is stopping fetch from being called on first screen
  useEffect(() => { 
    console.log("moves changed to " + moves )
    if (moves > 0) {
      fetchData()
    }
  }, [moves])

  // Player has selected an exit. Transition speech & loading screen
  useEffect(() => {
    loadingText = "You chose to exit via the " + exit + ". What fate befalls you now?"
    {speechHandler(msg, loadingText)}
  }, [exit])

  // The game has a set number of moves. 
  useEffect(() => {
    let statusMessage = ""
    if (moves >= 5) {
      statusMessage = "Congratulations for winning the game!"
    } else {
      if (moves >1) {
        statusMessage = " Unfortunately " + victim + "is out of the game"
      } 
    }
    {speechHandler(msg, roomdescription + statusMessage)}
  }, [roomdescription])

  // @todo reducer
  useEffect(() => {
    let endText = (moves < 5) ? " is dead" : " wins!"

    if (playerName.player1.name === victim) {
      const updatedPlayerName = {player1: {name:playerName.player1.name + endText, alive:false}}  
      setPlayerName(playerName => ({
        ...playerName,
        ...updatedPlayerName
      }));
    }
    if (playerName.player2.name === victim) {
      const updatedPlayerName = {player2: {name:playerName.player2.name + endText, alive:false}}  
      setPlayerName(playerName => ({
        ...playerName,
        ...updatedPlayerName
      }));
    }
    if (playerName.player3.name === victim) {
      const updatedPlayerName = {player3: {name:playerName.player3.name + endText, alive:false}}  
      setPlayerName(playerName => ({
        ...playerName,
        ...updatedPlayerName
      }));
    }
    if (playerName.player4.name === victim) {
      const updatedPlayerName = {player4: {name:playerName.player4.name + endText, alive:false}}  
      setPlayerName(playerName => ({
        ...playerName,
        ...updatedPlayerName
      }));
    }
    if (playerName.player5.name === victim) {
      const updatedPlayerName = {player5: {name:playerName.player5.name + endText, alive:false}}  
      setPlayerName(playerName => ({
        ...playerName,
        ...updatedPlayerName
      }));
    }
    
  }, [victim])

  const fetchData = () => {

    setLoading(true)

    let names = livingPlayers()
    let formData = new FormData();
    formData.append('exit', exit);
    formData.append('names', names);
    formData.append('count', moves);

    // API call - flask running locally.
    fetch('http://127.0.0.1:5000/',{
      method: 'POST',
      body: formData,
    })
    .then(response => response.json())
    .then(
      data => {
         console.log(data)
         setRoomdescription(data.description)
         setExits(data.exits)
         setVictim(data.victim)
         setLoading(false)
      }
    )
  }

  const livingPlayers = () => {
    let names = []
    if (playerName.player1.alive) {
      names.push(playerName.player1.name)
    }
    if (playerName.player2.alive) {
      names.push(playerName.player2.name)
    }
    if (playerName.player3.alive) {
      names.push(playerName.player3.name)
    }
    if (playerName.player4.alive) {
      names.push(playerName.player4.name)
    }
    if (playerName.player5.alive) {
      names.push(playerName.player5.name)
    }

   
    return names.toString();
  }

  const firstMove = () => {
    setFirstTurn(false)
    setMoves(moves + 1)
  }

  // Handle the exit button click
  const handleClick = (e) => {
    console.log(e.target.value)
    setExit(e.target.value)
    setMoves(moves + 1)
  }

  // Create the exit buttons
  let myExits = exits.map((exit,i) => {
      return (
        <div key={i}>
          <button onClick={handleClick} value={exit}>{exit}</button>
        </div>
      )
    })


  const msg = new SpeechSynthesisUtterance()

  const speechHandler = (msg, text) => {
      msg.text = text
      window.speechSynthesis.speak(msg)
  }


  const handlePlayerName = (e) => {
    console.log(e.target.name)
    const n = e.target.name
    const updatedPlayerName = {[n]: {name : e.target.value, alive:true}}

    setPlayerName(playerName => ({
      ...playerName,
      ...updatedPlayerName
    }));
  }

  const randomImage = () => { 
    let images = [root1,root2,root3,root4,root5,root6,root7,root8,root9,root10,root11,root12]
    let myRandomImage = images[Math.floor(Math.random() * images.length)]
    return myRandomImage
  }

  return (
    <div className="App" style={{ backgroundImage:`url(${randomImage()})`,backgroundRepeat:"no-repeat",backgroundSize:"cover", paddingBottom:"300px" }}>

      <PlayerInput playerNameValue={playerName.player1} playerNameKey={"player1"} handlePlayerName={handlePlayerName}/>
      <PlayerInput playerNameValue={playerName.player2} playerNameKey={"player2"} handlePlayerName={handlePlayerName}/>
      <PlayerInput playerNameValue={playerName.player3} playerNameKey={"player3"} handlePlayerName={handlePlayerName}/>
      <PlayerInput playerNameValue={playerName.player4} playerNameKey={"player4"} handlePlayerName={handlePlayerName}/>
      <PlayerInput playerNameValue={playerName.player5} playerNameKey={"player5"} handlePlayerName={handlePlayerName}/>

      {firstTurn ? 
        <div>
          <div className='h1container'>
            <h1>House of the haunted root vegetables</h1>
          </div>
          <h2>🤖 An AI generated adventure</h2>
          <button onClick={() => { firstMove()}} style={{marginTop:'100px'}} className='startButton'>
              Start Game
          </button>
        </div> 
        : loading ? 
            <div>
              <h1>🤖 Thinking...</h1>
            </div> 
            : 
            <div>
              <p className='description'>{roomdescription}</p>
              {(moves < 5) ? <div>Exits {myExits}</div> : <h1>Winners!</h1>}
            </div>
      }
    </div>
  );
}

export default App;

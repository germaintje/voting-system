"use client"
import { useEffect, useState } from "react"
import Cookies from 'js-cookie'

export default function Dashboard() {
  const [election, setElection] = useState(null);
  const [participants, setParticipants] = useState([]);
  const [selectedParticipant, setSelectedParticipant] = useState(null);


  useEffect(() => {
    const fetchElection = async () => {
      const res = await fetch('http://localhost:8080/rest/getElection/C1/E1')
      const data = await res.json()
      setElection(data)
    }

    fetchElection().catch(console.error)
  }, [])

  async function createElection() {

    const res4 = await fetch('http://localhost:8080/rest/getElection/C1/E1')

    if(!res4.ok) {
      await fetch('http://localhost:8080/rest/createParticipant', {
        method: "POST",
        body: '{"id":"Mark Rutte","name":"Mark Rutte","role":"Participant"}',
        headers: {
          "Content-Type": "application/json",
        },
      })
  
      await fetch('http://localhost:8080/rest/createParticipant', {
        method: "POST",
        body: '{"id":"Barack Obama","name":"Barack Obama","role":"Participant"}',
        headers: {
          "Content-Type": "application/json",
        },
      })
      await fetch('http://localhost:8080/rest/createParticipant', {
        method: "POST",
        body: '{"id":"Donald Trump","name":"Donald Trump","role":"Participant"}',
        headers: {
          "Content-Type": "application/json",
        },
      })
  
      const res = await fetch('http://localhost:8080/rest/createElection', {
        method: "POST",
        body: '{"electionCreatorId": "C1", "electionId": "E1", "electionName": "Election-1", "electionParticipants": "[Mark Rutte, Barack Obama, Donald Trump]"}',
        headers: {
          "Content-Type": "application/json",
        },
      })
      const data = await res.json()
      setElection(data)

    } else {
      const res = await fetch('http://localhost:8080/rest/createElection', {
        method: "POST",
        body: '{"electionCreatorId": "C1", "electionId": "E2", "electionName": "Election-2", "electionParticipants": "[Mark Rutte, Barack Obama, Donald Trump]"}',
        headers: {
          "Content-Type": "application/json",
        },
      })
      alert("Election E1 already exists. creating new election with ID E2 (because it is hardcoded you can only create 2 elections otherwise restart the server to clear the elections)")
      const data = await res.json()
      setElection(data)
    }
    


  }

  async function startElection() {
    const res = await fetch('http://localhost:8080/rest/start', {
      method: "POST",
      body: `{"electionCreatorId": "C1", "electionId": "${election.electionId}"}`,
      headers: {
        "Content-Type": "application/json",
      },
    })
    console.log(election)

    const data = await res.json()

    const electionCreatorId = "C1"
    const electionId = election.electionId
    const resParticipants = await fetch(`http://localhost:8080/rest/getParticipants/${electionCreatorId}/${electionId}`)
    const array = await resParticipants.text()
    const str = array.replace("[", "").replace("]", "");
    let arr = str.split(",");
    let validArray = arr.map(item => item.trim());
    console.log(validArray)
    setParticipants(validArray);
    setSelectedParticipant(null); // Clear the selected participant
    setElection(data)
    return data //updated election
  }

  async function vote() {
    if (!selectedParticipant) {
      alert("Please select a participant to vote for.");
      return;
    }



    const userId = Cookies.get('id')
    const decryptedUserId = userId.split(/(.{6})/)
    console.log(decryptedUserId)

    const res = await fetch('http://localhost:8080/rest/voteForParticipant', {
      method: "POST",
      body: JSON.stringify({
        "electionCreatorId": "C1",
        "participantId": selectedParticipant,
        "voterId": decryptedUserId[1]
      }),
      headers: {
        "Content-Type": "application/json",
      },
    })
    alert(await res.text())
  }

  async function finishElection() {
    const res = await fetch('http://localhost:8080/rest/finish', {
      method: "POST",
      body: `{"electionCreatorId": "C1", "electionId": "${election.electionId}"}`,
      headers: {
        "Content-Type": "application/json",
      },
    })

    const data = await countVotes()
    console.log(data)

    setSelectedParticipant(null);
  }

  async function countVotes() {
    const electionCreatorId = "C1"
    const electionId = "E1"
    const res = await fetch(`http://localhost:8080/rest/getParticipants/${electionCreatorId}/${electionId}`)
    const array = await res.text()
    const str = array.replace("[", "").replace("]", "");
    let arr = str.split(",");


    let validArray = arr.map(item => item.trim());

    const voteCount = []
    for (let index = 0; index < validArray.length; index++) {
      const res = await fetch(`http://localhost:8080/rest/getParticipant/C1/${validArray[index]}`)

      const data = await res.json();

      voteCount.push({
        id: data.id,
        name: data.name,
        voteCount: data.voteCount
      })
    }

    const winner = voteCount.reduce((prev, current) => (prev.voteCount > current.voteCount) ? prev : current);

    // Display the winner
    alert(`The winner is ${winner.name} with ${winner.voteCount} votes.`)
  }

  return (
    <div className="flex justify-around">
      <div className='flex flex-col items-center justify-center mt-20'>
        <p className='text-lg font-bold'>Creating an election</p>
        <button className='bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded mt-5' onClick={createElection}>Create Election</button>
        <div className='mt-5'>
          {election ? (
            <div className='bg-white shadow-lg rounded-lg px-4 py-2'>
              <p className='font-semibold'>Election ID: <span className='font-normal'>{election.electionId}</span></p>
              <p className='font-semibold'>Election name: <span className='font-normal'>{election.electionName}</span></p>
              <p className='font-semibold'>current status: <span className='font-normal'>{election.currentState}</span></p>
            </div>
          ) : null}
        </div>
      </div>
      <div className='flex flex-col items-center justify-center mt-20'>
        <p className='text-lg font-bold'>Starting an election</p>
        <button className='bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded mt-5' onClick={startElection}>Start election</button>
        {participants.map((participant, index) => (
          <div key={index} className={`p-2 mt-2 rounded cursor-pointer ${selectedParticipant === participant ? 'bg-green-200' : 'bg-gray-200'}`} onClick={() => setSelectedParticipant(participant)}>
            {participant}
          </div>
        ))}
      </div>
      <div className='flex flex-col items-center justify-center mt-20'>
        <p className='text-lg font-bold'>Vote for participant</p>
        <button className='bg-yellow-500 hover:bg-yellow-700 text-white font-bold py-2 px-4 rounded mt-5' onClick={vote}>Vote</button>
      </div>
      <div className='flex flex-col items-center justify-center mt-20'>
        <p className='text-lg font-bold'>Finishing election</p>
        <button className='bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded mt-5' onClick={finishElection}>Finish election</button>
      </div>
    </div>
  )
}

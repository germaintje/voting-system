'use client'
import { useState } from "react"
import Cryptr from 'cryptr'
import Cookies from 'js-cookie'
import { useRouter } from "next/navigation"
export default function Home() {
  const [userId, setUserId] = useState()
  const [userName, setUserName] = useState()
  const cryptr = new Cryptr('secret')
  const router = useRouter();

  async function handleSubmit() {
    const encryptedUserId = cryptr.encrypt(userId)
    const _userId = encryptedUserId.split(/(.{6})/)
    console.log(_userId)

    const encryptedmail = cryptr.encrypt(userName)
    const _userName = encryptedmail.split(/(.{6})/)
    console.log(_userName)

    const res = await fetch('http://localhost:8080/rest/createParticipant', {
      method: "POST",
      body: `{"id": "${_userId[1]}","name":"${_userName[1]}" ,"role":"Voter"}`,
      headers: {
        "Content-Type": "application/json",
      },
    })
    Cookies.set('id', encryptedUserId)


    const res2 = await fetch('http://localhost:8080/rest/createParticipant', {
      method: "POST",
      body: '{"id":"C1","name":"electionCreator 1","role":"ElectionCreator"}',
      headers: {
        "Content-Type": "application/json",
      },
    })

    if(!res2.ok) {
      console.log('electionCreator C1 already exists')
    }

    Cookies.set('mail', encryptedmail)


    if (res.ok) {
      alert("you have been logged in");
      router.push('/dashboard')
    } else {
      alert('something went wrong with logging in')
    }
  }
  return (
    <>
      <div>
        <div className='flex flex-col items-center justify-center mt-56'>
          <p>Register</p>
          <input onChange={e => setUserId(e.target.value)} type='text' className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block p-2.5 m-4 text-center" required placeholder='Name'></input>
          <input onChange={e => setUserName(e.target.value)} type='text' className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block p-2.5 m-4 text-center" required placeholder='Mail'></input>
          <button onClick={handleSubmit}>Submit</button>
        </div>
      </div >
    </>

  )
}

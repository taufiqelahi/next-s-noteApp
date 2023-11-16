
'use client'

import { NextApiRequest, NextApiResponse } from 'next'
import { Database } from '../types/supabase'


import { useEffect, useState } from 'react'
import { supabaseBrowserClient } from '../../../utils/supabase_bowser'

type Note = {
  email: string,
  id: string, 
  title: string, 
  description:string,
  created_at: string,
  user_id: string
}
const NotePage = () => {
 
  const [notes, setNotes] = useState<Array<Note>> ([]);

    
  useEffect(() => {

    if (typeof window !== 'undefined') {
     getNotes();
    }
  }, []);

     async function getNotes() {
  const notes= await supabaseBrowserClient.from('notes').select('*')
  if(notes!=null){
     
    setNotes(notes.data??[]);
  }
  

  
}
    
  return (
    <div>
    <h2>Notes:</h2>
    <ul>
      {notes.map((note, index) => (
      <li  key={index}>
          <h1 className=' text-lg font-bold'>{note.title}</h1>
        <p> {note.description}</p>
      </li>
      ))}
    </ul>
  </div>
  )


}



export default NotePage

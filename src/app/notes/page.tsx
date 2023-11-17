
'use client'

import { NextApiRequest, NextApiResponse } from 'next'
import { Database } from '../types/supabase'


import { useEffect, useState } from 'react'
import { supabaseBrowserClient } from '../../../utils/supabase_bowser'
import { RealtimePostgresChangesPayload } from '@supabase/supabase-js'

type Note = {
  email: string,
  id: string, 
  title: string, 
  description:string,
  created_at: string,
  user_id: string
}


const NotePage =  () => {

  const [notes, setNotes] = useState<Array<Note>> ([]);
  const [inputText, setInputText]=useState('');
  let  notesData=[]



    
  useEffect(() => {

    if (typeof window !== 'undefined') {
     getNotes();
    }
  }, []);

     async function getNotes() {
   notesData= (await supabaseBrowserClient.from('notes').select('*')).data
  supabaseBrowserClient
  .channel('notes')
  .on('postgres_changes', { event:'*', schema: 'public', table: 'notes' }, handleInserts)
  .subscribe()


     
    setNotes(notesData??[]);
    
  

  
}
async function addNote(){
  const { error } = await supabaseBrowserClient
.from('notes')
.insert({ title: 'Denmark', description:inputText })

}
function handleInserts(payload: RealtimePostgresChangesPayload<{ [key: string]: any }>): void {
  console.log(payload.eventType);
  if(payload.eventType=="INSERT"){
  notesData=[...notesData, payload.new]
  setNotes(notesData)
  }else if(payload.eventType=="UPDATE"){
   
    const index = notesData.findIndex(obj => obj.id === payload.old.id);
    if(index>-1){
      console.log(index);
      notesData[index]=payload.new;
      notesData=[...notesData]
    
    }
  }else if(payload.eventType=="DELETE"){
   
    

    
    
      notesData=notesData.filter((e)=>e.id!=payload.old.id);
    

  }
   setNotes(notesData)
}
    
  return (
    <div className='grid grid-cols-2 gap-4 h-screen'>
    <div className='sm:col-span-2 md:col-span-1 '>
     
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
  <div className='sm:col-span-2 md:col-span-1 '> Create new notes
  <div className='my-4 mx-4' >
  <textarea  value={inputText}  onChange={(e) => setInputText(e.target.value)} className='h-96 w-full border border-black'  />
  </div>
  <div>
    <button  onClick={addNote} className='h-10 w-20 rounded-xl bg-green-700 my-4'>
      Create
    </button>
  </div>

  


  </div>
  </div>
  )


}



export default NotePage



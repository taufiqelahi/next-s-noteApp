
'use client'


import { Database } from '../types/supabase'
import { ChangeEvent, useEffect, useState } from 'react'
import { supabaseBrowserClient } from '../../../utils/supabase_bowser'
import { RealtimePostgresChangesPayload } from '@supabase/supabase-js'
import { PencilSquareIcon } from '@heroicons/react/24/solid'
import Popup from '../components/popup'


const NotePage = () => {


  const [notes, setNotes] = useState<Array<Database>>([]);
  
  const [note, setNote] = useState<Database>();



  const [isPopupOpen, setPopupOpen] = useState(false);

  let notesData: any = []

  const openPopup = (n:any) => {
   setNote(n)

    setPopupOpen(true);
  };
  const closePopup = () => {
    setPopupOpen(false);
  };
  useEffect(() => {

    if (typeof window !== 'undefined') {
      getNotes();
    }
  }, []);

  async function getNotes() {
    notesData = (await supabaseBrowserClient.from('notes').select('*')).data
    supabaseBrowserClient
      .channel('notes')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'notes' }, handleInserts)
      .subscribe()



    setNotes(notesData ?? []);




  }

  function handleInserts(payload: RealtimePostgresChangesPayload<{ [key: string]: any }>): void {
    console.log(payload.eventType);
    if (payload.eventType == "INSERT") {
      notesData = [...notesData, payload.new]
      setNotes(notesData)
    } else if (payload.eventType == "UPDATE") {

      const index = notesData.findIndex((obj: { id: any }) => obj.id === payload.old.id);
      if (index > -1) {
        console.log(index);
        notesData[index] = payload.new;
        notesData = [...notesData]

      }
    } else if (payload.eventType == "DELETE") {





      notesData = notesData.filter((e: { id: any }) => e.id != payload.old.id);


    }
    setNotes(notesData)
  }

  return (
    <div className='grid grid-cols-2 gap-4 h-screen'>
      <div className='sm:col-span-2 md:col-span-1 mx-4 '>

        <h2 className='my-4'>Notes:</h2>
        <ul >
          {notes.map((note, index) => (
            <li  key={index}>
           
            <div className=' flex justify-between max-w-sm border border-blue-100 shadow-lg my-4  '>
            <div>
            <h1 className=' text-lg font-bold'>{note.title}</h1>
            <p className='  '> {note.description}</p>
          </div>
          <PencilSquareIcon onClick={()=>openPopup(note)}  className="h-6 w-6 text-blue-500" />
          </div>
        
            </li>
          ))}
        </ul>
      </div>
      <div className='sm:col-span-2 md:col-span-1 '> Create new notes
        <div className='my-4 mx-4' >

        </div>
        <div>
          <button onClick={()=>openPopup({})} className='h-10 w-20 rounded-xl bg-green-700 my-4'>
            Create
          </button>
          {isPopupOpen && (
    <Popup note={note} onClose={closePopup} />
          )}
        </div>




      </div>
    </div>
  )


}



export default NotePage



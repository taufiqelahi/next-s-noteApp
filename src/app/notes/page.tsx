
'use client'


import { Database } from '../types/supabase'
import { ChangeEvent, useEffect, useState } from 'react'
import { supabaseBrowserClient } from '../../../utils/supabase_bowser'
import { RealtimePostgresChangesPayload } from '@supabase/supabase-js'
import { PencilSquareIcon } from '@heroicons/react/24/solid'
import UpdateNotePopup from '../components/update_note_popup'
import DeleteNotePopup from '../components/delete_note_popup'


const NotePage = () => {


  const [notes, setNotes] = useState<Array<Database>>([]);

  const [note, setNote] = useState<Database>();



  const [updateNotePopupOpen, setUpdateNotePopupOpen] = useState(false);
  const [deleteNotePopupOpen, setDeleteNotePopupOpen] = useState(false);
  let notesData: any = []

  const openUpdateNotePopup = (n: any) => {
    setNote(n)

    setUpdateNotePopupOpen(true);
  };

  const openDeleteNotePopup = (n: any) => {
    setNote(n)

    setDeleteNotePopupOpen(true);
  };
  const closePopup = () => {
    setDeleteNotePopupOpen(false);
    setUpdateNotePopupOpen(false);
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
    <div className='m-10 gap-4 h-screen'>
     

      <div className='flex justify-between'>

      <h2 className='my-4'>Notes:</h2>
        <button onClick={() => openUpdateNotePopup({})} className=' w-28 rounded-xl bg-green-700 text-white '>
            Create
          </button>
      </div>
        <ul >
          {notes.map((note, index) => (
            <li key={index}>

              <div className=' flex justify-between my-10 border border-blue-100 shadow-lg  '>
                <div>
                  <h1 className=' text-lg font-bold'>{note.title}</h1>
                  <p className='  '> {note.description}</p>
                </div>
                <PencilSquareIcon onClick={() => openUpdateNotePopup(note)} className="h-6 w-6 text-blue-500" />
             
                <PencilSquareIcon onClick={() => openDeleteNotePopup(note)} className="h-6 w-6 text-blue-500" />
        
              </div>

            </li>
          ))}
        </ul>
   
    
         
          {updateNotePopupOpen && (
            <UpdateNotePopup note={note} onClose={closePopup} />
          )}
           {deleteNotePopupOpen && (
            <DeleteNotePopup note={note} onClose={closePopup} />
          )}
        </div>





   
  )


}



export default NotePage



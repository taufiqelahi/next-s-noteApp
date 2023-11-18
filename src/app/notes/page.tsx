
'use client'


import { Database } from '../types/supabase'



import { useEffect, useState } from 'react'
import { supabaseBrowserClient } from '../../../utils/supabase_bowser'
import { RealtimePostgresChangesPayload } from '@supabase/supabase-js'
import {PencilSquareIcon} from '@heroicons/react/24/solid'






const NotePage = () => {
  

  const [notes, setNotes] = useState<Array<Database>>([]);
  const [titleText, settitleText] = useState('');
  const [descriptionText, setdescriptionText] = useState('');
  const [isPopupOpen, setPopupOpen] = useState(false);
  let notesData:any = []
  const openPopup = () => {
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
  async function addNote() {
    const { error } = await supabaseBrowserClient
      .from('notes')
      .insert({ title: titleText, description: descriptionText })
      closePopup();

  }
  function handleInserts(payload: RealtimePostgresChangesPayload<{ [key: string]: any }>): void {
    console.log(payload.eventType);
    if (payload.eventType == "INSERT") {
      notesData = [...notesData, payload.new]
      setNotes(notesData)
    } else if (payload.eventType == "UPDATE") {

      const index = notesData.findIndex((obj: { id: any })  => obj.id === payload.old.id);
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
            <li className=' flex justify-between max-w-sm border border-blue-100 shadow-lg my-4  ' key={index}>
              <div>
              <h1 className=' text-lg font-bold'>{note.title}</h1>
              <p className='  '> {note.description}</p>
              </div>
            
              <PencilSquareIcon  className="h-6 w-6 text-blue-500" />
              

            </li>
          ))}
        </ul>
      </div>
      <div className='sm:col-span-2 md:col-span-1 '> Create new notes
        <div className='my-4 mx-4' >
          
        </div>
        <div>
          <button onClick={openPopup} className='h-10 w-20 rounded-xl bg-green-700 my-4'>
            Create
          </button>
          {isPopupOpen && (
        <div className="fixed top-0 left-0 w-full h-full bg-gray-800 bg-opacity-50 flex justify-center items-center">
          <div className="bg-white p-6 rounded shadow-lg">
            <h2 className="text-2xl font-bold mb-4">create notes</h2>

            <div className="mb-4">
              <label htmlFor="input1" className="block text-gray-700 text-sm font-bold mb-2">
                Title:
              </label>
              <input
                type="text"
               
                value={titleText}
                onChange={(e) => settitleText(e.target.value)}
                className="border rounded w-full p-2"
              />
            </div>

            <div className="mb-4">
              <label htmlFor="input2" className="block text-gray-700 text-sm font-bold mb-2">
                Description:
              </label>
              <textarea
               
                value={descriptionText}
                onChange={(e) => setdescriptionText(e.target.value)}
                className="border rounded w-full p-2"
              />
            </div>

            <button onClick={addNote} className="bg-blue-500 text-white p-2">
              Submit
            </button>

            <button onClick={closePopup} className="bg-red-500 text-white p-2 mt-4">
              Close
            </button>
          </div>
        </div>
      )}
        </div>




      </div>
    </div>
  )


}



export default NotePage



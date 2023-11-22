
'use client'
import React, { useEffect, useState } from 'react'

import { Database } from '../types/supabase'
import { supabaseBrowserClient } from '../../../utils/supabase_bowser';

const UpdateNotePopup = ({ note, onClose }: any) => {


    const [titleText, settitleText] = useState(note.title ?? '');
    const [descriptionText, setdescriptionText] = useState(note.description ?? '');



    async function addNote() {

        if (note.id == undefined) {
            const { error } = await supabaseBrowserClient
                .from('notes')
                .insert({ title: titleText, description: descriptionText })
        } else {

            const { error } = await supabaseBrowserClient
                .from('notes')
                .update({ title: titleText, description: descriptionText }).eq('id', note.id)
        }

        onClose();





    }

    return (
        <div className="fixed top-0 left-0 w-full h-full bg-gray-800 bg-opacity-50 flex justify-center items-center">

            <div className="bg-white p-6 rounded shadow-lg">
                <h2 className="text-2xl font-bold mb-4"></h2>

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
                    {note.id == undefined ? 'Create' : 'Update'}
                </button>

                <button onClick={onClose} className="bg-red-500 text-white p-2 mt-4">
                    Close
                </button>
            </div>
        </div>
    )
}

export default UpdateNotePopup
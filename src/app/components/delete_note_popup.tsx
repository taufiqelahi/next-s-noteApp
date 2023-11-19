import { supabaseBrowserClient } from "../../../utils/supabase_bowser"

const DeleteNotePopup = ({note ,onClose}:any) => {
    async function deleteNote() {
        const { error } = await supabaseBrowserClient
                .from('notes')
                .delete().eq('id', note.id);

                onClose();
    }
  return (


    <div className="fixed top-0 left-0 w-full h-full bg-gray-800 bg-opacity-50 flex justify-center items-center">

    <div className="bg-white p-6 rounded shadow-lg">
        <h2 className="text-2xl font-bold mb-4"></h2>

        <div className="mb-4">
            <label htmlFor="input1" className="block text-gray-700 text-sm font-bold mb-2">
               Are you sure to delete?
            </label>
        
        </div>

      

        <button onClick={deleteNote} className="bg-blue-500 text-white p-2">
            Confirm
        </button>

        <button onClick={onClose} className="bg-red-500 text-white p-2 mt-4">
            Dismiss
        </button>
    </div>
</div>
  )
}

export default DeleteNotePopup
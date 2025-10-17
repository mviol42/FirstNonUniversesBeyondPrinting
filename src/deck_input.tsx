import { useState } from 'react'
import ScryfallApiCallButton from './scryfall_api_call_button'

function DeckInput() {
  const [decklist, setDeckList] = useState('')
  const [errors, setErrors] = useState([])

  return (
    <div className='flex flex-col max-w-2xl mx-auto p-4'> {}
        <h2 className="text-xl font-semibold mb-3 text-white">Find cheapest nonUB, nonSLD printings</h2>
                <div className="mb-6">
                    <textarea
                    id="decklist"
                    rows={10} 
                    className="block 
                        w-full 
                        rounded-xl 
                        text-base 
                        bg-gray-300 
                        border-2
                        text-gray-900
                        placeholder-gray-500
                        focus:ring-blue-500 focus:border-blue-500 focus:ring-2
                        resize-none
                        p-4 
                    "
                    value={decklist}
                    onChange={(e) => setDeckList(e.target.value)}
                    placeholder={`Paste your decklist here.
Example:

4 Sol Ring
3 Arcane Signet
1 Command Tower
...
`}/>
        
        </div>
        <ScryfallApiCallButton decklist={decklist} setDeckList={setDeckList} setErrors={setErrors}/>
        <div>
            {errors.length != 0 && 
                <div className="flex p-4 mb-4 text-sm text-red-800 rounded-lg" role="alert">
                    <div>
                        <ul className="mt-1.5 list-disc list-inside">
                            {errors.map((err, index) => (
                                <li key={index}>{err}</li>
                            ))}
                        </ul>
                    </div>
                </div>
            }
        </div>
    </div>
  )
}

export default DeckInput
import React, { useState } from 'react'

function DeckInput() {
  const [decklist, setDecklist] = useState('')

  return (
    <div className='flex flex-col max-w-2xl mx-auto p-4'> {}
        <h2 className="text-xl font-semibold mb-3 text-gray-800">Paste Decklist</h2>
        <div className="mb-6">
        <textarea
            id="decklist"
            rows={15} 
            className="
                block 
                w-full 
                rounded-xl 
                text-base 
                bg-gray-100 dark:bg-gray-800 
                border-2 border-gray-300 dark:border-gray-700
                text-gray-900 dark:text-white
                placeholder-gray-500 dark:placeholder-gray-400
                focus:ring-blue-500 focus:border-blue-500 focus:ring-2 
                resize-y 
                p-4 
            "
            value={decklist}
            onChange={(e) => setDecklist(e.target.value)}
            placeholder={`Paste your decklist here.
Example:

4 Sol Ring
3 Arcane Signet
1 Command Tower
...
`}/>
        </div>
    </div>
    
  )
}

export default DeckInput
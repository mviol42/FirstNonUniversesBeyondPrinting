import { useState } from 'react';

// Function to extract a single card name from a decklist line.
// This helper is kept here as it is only relevant to the API call logic.
const extractCardName = (line: string) => {
    // This regex attempts to remove a leading quantity (e.g., "4x ", "1 ", "4-")
    // and returns the rest of the line as the card name.
    const match = line.trim().match(/^\s*\d+x?\s+(.*)/);
    return match ? match[1].trim() : line.trim();
};

function timeout(delay: number) {
    return new Promise( res => setTimeout(res, delay) );
}

function ScryfallApiCallButton({decklist = '', setDeckList, setErrors }: any) {
    const [isLoading, setIsLoading] = useState(false)
    
    const getSpecificPrintingsForCards = async () => {
        // Reset states and set loading flag
        setIsLoading(true);
        setErrors([]);

        let errors: string[] = [];

        // We can safely call .split and .filter because decklist defaults to ''
        const lines: string[] = decklist.split('\n').filter((line: string) => line.trim() !== '');
        if (lines.length === 0) {
            errors.push("Please paste a decklist before submitting.");
            setIsLoading(false);
            return;
        }
        
        // Use Promise.all to wait for all API calls to complete
        const updatedLines: string[] = [];
        for (const line of lines)
        {
            const cardName = extractCardName(line);
            if (!cardName) {
                errors.push("Invalid input");
                continue;
            }

            // Await the API call
            let bestSet = await queryScryfallToFindBestPrinting(cardName, errors);

            // Scryfall has a rate limit. Add a small delay between requests.
            await timeout(75); 

            if (bestSet) {
                // Return the updated line with the set code
                updatedLines.push(`${line} [${bestSet}]`);
            } else {
                // If no set was found (error/404), return the original line
                updatedLines.push(line);
            }
        }

        if (errors.length != 0)
        {
            setErrors(errors);
        }

        setDeckList(updatedLines.join("\n"))
        setIsLoading(false);
    }
    
    const checkResponseAndAddError = async (response: Response, cardName: string, errors: string[]) => {
        if (!response.ok) {
            // Scryfall returns 404 if no card is found
            if (response.status === 404) {
                errors.push(`Card not found: "${cardName}"`);
            } else {
                // General HTTP error
                const errorBody = await response.json();
                errors.push(`HTTP Error ${response.status}: ${errorBody.details || 'Failed to fetch card data.'}`);
            }
        }

        return response.ok
    }

    const queryScryfallToFindBestPrinting = async (cardName: string, errors: string[]) => {
        // We search for the exact card name first without secret lair drops and universes beyond, then with SLD and UB
        const firstPassEncodedQuery = encodeURIComponent(`!"${cardName}" -is:promo -set:plst -set_type:memorabilia -set_type:alchemy -set:sld -is:universes_beyond in:paper game:paper sort:usd direction:asc`); 
        const secondPassEncodedQuery = encodeURIComponent(`!"${cardName}" -is:promo -set:plst -set_type:memorabilia -set_type:alchemy in:paper game:paper sort:usd direction:asc`); 
        const apiUrlPrefix = `https://api.scryfall.com/cards/search?q=`;
        const firstPassApiUrl = `${apiUrlPrefix}${firstPassEncodedQuery}`;
        const secondPassApiUrl = `${apiUrlPrefix}${secondPassEncodedQuery}`;

        try {
            let response;
            response = await fetch(firstPassApiUrl);
            if (!checkResponseAndAddError(response, cardName, errors))
            {
                setIsLoading(false);
                return;
            }

            let data = await response.json();
            if (data.data.length === 0)
            {
                // no cards found, we should expand our search
                response = await fetch(secondPassApiUrl);
                if (!checkResponseAndAddError(response, cardName, errors))
                {
                    setIsLoading(false);
                    return;
                }

                data = await response.json();
            }

            // Scryfall search results are in 'data' array; we take the first card.
            return data.data[0].set
        } catch (err) {
            console.error('API Call Error:', err);
        }
    };

    return (
        <button
            onClick={getSpecificPrintingsForCards}
            disabled={isLoading || decklist.trim().length === 0}
            className={`
                w-full 
                py-3 
                rounded-xl 
                font-bold 
                shadow-lg 
                ${(isLoading || decklist.trim().length === 0)
                    ? 'bg-gray-400 text-gray-300 cursor-not-allowed' 
                    : 'bg-black text-white hover:bg-blue-700 focus:ring-4 focus:ring-blue-300'
                }
            `}
        >
            {isLoading ? ('Thinking...') : ('Submit')}
        </button>
    );
};

export default ScryfallApiCallButton;
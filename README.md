# Japanese Text to Anki Deck

The purpose of this script is to create a simple anki deck from a block of japanese text so that you can create study material based on your context.

## How It Works

1. Get all tokens of the block of text
   - All individual kanji
   - All words excluding individual kanji
2. Fetch their meanings and readings
3. Format the information (described in next section)
4. Store it to a file (`anki.txt`)

### Anki Deck Format

```
A;「B」(C)
```

- A: the kanji or word
- B: the reading in hiragana
- C: the meaning in english

## Technologies Used

- node.js [https://nodejs.org/en](https://nodejs.org)
- axios [https://github.com/axios/axios](https://github.com/axios/axios)
- wachigaki [https://socket.dev/npm/package/wakachigaki](https://socket.dev/npm/package/wakachigaki)
- jisho.org [https://jisho.org/api/v1/search/words?keyword=真実](https://jisho.org/api/v1/search/words?keyword=%E7%9C%9F%E5%AE%9F)

## Disclaimer

1. jisho's API will throttle after a few dozen simulataneous requests and cause the script to crash. To fix this
   - Implement logic to handle throttling
   - Break down input into smaller chunks
   - Decrease the size of your input

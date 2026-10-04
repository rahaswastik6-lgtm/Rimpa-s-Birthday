# My Surprise Website ✨

## Run it (VS Code)
1. Open this folder in VS Code (File → Open Folder).
2. Install the **Live Server** extension (Ritwick Dey).
3. Right-click `index.html` → **Open with Live Server**.

## Personalize — edit ONE file: `js/config.js`
| Want to change | Where in config.js |
|---|---|
| Her name / your name | `herName`, `yourName` |
| Secret code | `secretCode` |
| Photos | drop images in `assets/` (`photo1.jpg` … `photo4.jpg`) or change the paths |
| Music | put a song at `assets/music.mp3`, or change `music` (`""` = none) |
| Page text, memories | the opening-page keys at the top, then `welcome`, `memories` |
| The letter | `letter.paragraphs` |
| Final message | `final` |

Add or remove memories by adding or deleting items in their list.
Colours and fonts: the `:root` block at the top of `css/style.css`.

## Tips
- Use square-ish photos (about 800×800 px, under 500 KB each) so it loads fast on phones.
- Missing photos show a soft placeholder; a missing song hides the music button.
- To share it, host the folder on Netlify Drop or GitHub Pages and send her the link.

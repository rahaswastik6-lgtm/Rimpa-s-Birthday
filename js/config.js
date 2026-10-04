/* =====================================================================
   ★ CONFIG — the ONLY file you need to edit to personalise the site ★
   Photos: put images in /assets and match the file names below.
   Music:  put your song in /assets and set `music` (use "" for none).
   ===================================================================== */

const CONFIG = {

  herName: "Rimpa",
  yourName: "Swastik",
  secretCode: "1410",            // exactly 4 digits recommended
  nextPage: "welcome.html",      // page opened after the letter unlocks

  // ★ BIRTHDAY COUNTDOWN — change this ONE value to move the unlock moment.
  // Keep the +05:30 offset: it pins the moment to IST no matter where her phone is.
  birthdayDate: new Date(Date.now()+5000).toISOString(),

  countdown: {
    curtainTitle: "Rimpa's Birthday ✨",
    curtainSub: "Opening at midnight...",
    title: "Something is waiting for you...",
    earlyMessage: "You're a little early 😂",
    almostMessage: "Almost there...",              // replaces earlyMessage in the last hour
    unlockMessage: "Birthday unlocks when the clock hits zero.",
    labels: ["DAYS", "HOURS", "MINUTES", "SECONDS"],
    oldAge: "17",
    newAge: "18",
    birthdayMessage: "Happy 18th, Rimpa 🥳🎂",
    openLine: "Now you're officially allowed to open this thing 😂"
  },

  // VISUAL THEME — sunflower decoration in the background (#sky). sunflower:false = original stars; backgroundPetals:false = no drifting decoration.
  theme: {
    sunflower: true,
    backgroundPetals: true
  },

  // OPENING PAGE — the locked letter. {her} is replaced by herName.
  topLabel: "tor jonno akta chotto jinish banaichi ✨",
  heading: "Okay...\ndon't judge me.",
  subheading: "I made you a little something.",
  envelopeLabel: "for {her} ✨",                       // handwritten on the envelope
  lockedMessage: "jokhon parbi tokhon khulbe",       // smaller line under it
  envelopeNote: "son,ata lock kora so password chara khulbe nah", // little note above the envelope
  entryPhoto: "assets/photo0.jpg",                   // polaroid stuck on the envelope
  photoCaption: "proof this website is about you",
  passwordIntro: "BUT...",
  passwordTitle: "there's one tiny problem.",
  passwordSubtitle: "I locked it.",
  
  submitKey: "😂",                                   // ✨ HERE IS YOUR FUNNY EMOJI BUTTON ✨
  
  promptMessage: "Enter the secret code",
  incompleteMessage: "Four digits, please ✨",

  // one is picked at random after each wrong try
  // (never the same one twice in a row)
  wrongMessages: [
    "Hbe nh abr try kor✨",
    "hochhe na 😂",
    "ato soja na.",
    "chesta kor onek kache esechis.",
    "hbe hbe",
    "1 bochor lagbe mone hocche",
    "Akkar Bakkar try kor"
  ],

  waitMessage: "WAIT...",
  successMessage: "you found it ✨",
  moreMessage: "eber dekhte paris",

  holdTime: 6500,  // ms she gets to read the letter before the next page
                    // (tap the letter to skip)

  // The letter. Blank line = new paragraph.
  // Line breaks inside a paragraph just reflow.
  introLetter: `
    Dear {her},

    Dekh, tor jonno ekta chotto website banai si.

    Amar mone holo, normal birthday wish er bodole ektu alada kichu kori... 😅 Hope you liked it. ✨

    So... welcome. 😅
  `,

  music: "assets/music.mp3",     // optional; the ♪ button only appears after unlocking,
                                 // and hides if the file is missing


  // PAGE 2 — welcome
  welcome: {

    label: "you made it ✨",
    subtitle: "Finally khulte parli",
    photo: "assets/photo2.jpg",

    line: "This little corner of the internet was made just for you.",

    message: [
      "Consider this a small excuse",
      "to make you smile."
    ],

    button: "Let's begin →"
  },


  // PAGE 3 — memories
  memories: {

    label: "chapter one",
    title: "Chotto chotto moments✨",
    subtitle: "kichu moment choto holeo,kintu oguloi mathay rent e thke free te permenantly.",

    items: [

      {
        photo: "assets/photo1.jpg",
        date: "the first one",
        title: "The first one",
        caption: "Idli,dosa,sambar chutney chutney."
      },

      {
        photo: "assets/photo4.jpg",
        date: "that day",
        title: "That day",
        caption: "bebhechilam oi din ami topke jabo."
      },

      {
        photo: "assets/photo3.jpg",
        date: "a random day",
        title: "A spider moment",
        caption: "Abr tor hat theke web berobe"
      }

    ]
  },


  // PAGE 4 — letter
  // "Hey [name]," and the signature are added automatically.
  letter: {

    label: "chapter two",
    title: "A Little Note For You ✨",

    paragraphs: [

      "Happy Poida Dibos, Rimpa 🥳🎂❤️",

      "18 years er hoye geli akhon..🥹✨ Jibone tor onk sopno ache jani, and segulo jano always purno hoy and tui sobsomoy jano happy thakis — not only outside, but also from inside. ✨",

      "Thank you for helping me all the time.. 🫶 You are such a kind,charming and generous girl.. Jerokom achis, tui serokom-i bhalo, nijeke bodlas na. 🫂✨",

      "Thanks for the laughs and long conversations, jeta te tui ulte suye thakis 😂❤️ and also for helping me understand life better.. 🥹",

      "I hope this year will be the best year for you 🎀✨ and if there is any problem with you, just say it to me, I will try my best to fix it. Ik you don't express and trust that much, but you can trust me. 🤝🧿",

      "Jai hok, ato jokhon likhechi, treat ta dibi kintu 😂🎂🍫"

    ],

    next: "There's something else...",
    button: "Continue →"
  },


  // PAGE 5 — final
  final: {

    heading: "I'm really glad I got to know you.",
    sub: "I just wanted to make you special.",
    message: "Anyway... tor jonno akta chiku ar tor pic. ✨",
    photo: "assets/photo5.jpg",
    footer: "Made with a bit of time, a lot of thought ✨"
  },

  // PAGE 6 — the cake surprise (cake.html). {her} = herName. Everything the cake page says lives here.
  cake: {
    page: "cake.html",
    entryButton: "Wait... one last thing 👀",     // the ONE new button on the final page
    introTitle: "One last surprise...",
    introMessage: "Okay... this one is actually fun 😂",
    boxLabel: "For {her} ✨",
    boxNote: "okay... this is actually the last one 😂",
    openButton: "Open it",
    candles: 18,
    wishLine: "Okay, birthday girl...",
    wishTitle: "Make a wish ✨",
    blowInstruction: "Take a breath... and blow 🎂",
    blowHere: "Blow at the candles ↓",
    micNote: "(your mic only listens for the blow — nothing is recorded)",
    micFallback: "Mic not cooperating? Tap the button below 👇",
    manualBlowButton: "Tap to blow instead",
    afterBlow: "Wish made ✨",
    blownTitle: "Happy 18th, {her} 🥳🎂",
    cutTitle: "Now comes the important part 😂",
    cutButton: "Cut the cake 🎂",                  // shown as the big line while she cuts
    cutHint: "Drag the knife down the dotted line (or just tap it)",
    cutDone: "Finally 😂",
    cutDone2: "Now someone has to eat it...",
    cutJoke: "Unfortunately, the website cannot deliver cake. 😭😂",
    finalTitle: "Happy 18th, {her} 🥳🎂✨",
    finalMessage: "Hope this little website made you smile.",
    finalFunny: "Okay, NOW we're actually done. 😂"
  }


};
import { player } from "@/main"
import { format } from "@/utils/formats"

export const News: {
  id: string
  text: string
  condition?(): boolean
}[] = [
  {
    id: 'f1',
    get text() { return `Albert Einstein was <i>not</i> ready for there to be numbers past infinity...` },
  },{
    id: 'f2',
    get text() { return `Do not ask MrRedShark77 about Unreality` },
  },{
    id: 'f3',
    get text() { return `Secret Achievements are so secret you will never find them!` },
  },{
    id: 'f4',
    get text() { return `Dont listen to Hevipelle, there IS 9th and 10th dimensions` },
  },{
    id: 'f5',
    get text() { return `We will not apologize for any grammar mistakes or typos in the previous message` },
  },{
    id: 'f6',
    get text() { return `Albert Einstein was <i>not</i> ready for there to be numbers past infinity...` },
  },{
    id: 'f7',
    get text() { return `Albert Einstein was <i>not</i> ready for there to be numbers past infinity...` },
  },{
    id: 'f8',
    get text() { return `Albert Einstein was <i>not</i> ready for there to be numbers past infinity...` },
  },{
    id: 'f9',
    get text() { return `Next fact is a lie` },
  },{
    id: 'f10',
    get text() { return `Previous fact is true` },
  },{
    id: 'f11',
    get text() { return `Youre closer to ${format(1.79e308)} than 2^1024` },
  },{
    id: 'f12',
    get text() { return `Antimatter Dimensions 2: Electric Boogaloo` },
  },{
    id: 'f13',
    get text() { return `You will read this fact, and that's a fact.` },
  },{
    id: 'f14',
    get text() { return `Didn't you know albert einstein said IMR 0.8 is gonna come out? Me neither....` },
  },{
    id: 'f15',
    get text() { return `Wait, if time circuits are unlocked at the start, does that mean the 4th celestial will unlock the help menu?` },
  },{
    id: 'f16',
    get text() { return `Points are infinitely small.` },
  },{
    id: 'f17',
    get text() { return `A point has zero dimensions.` },
  },{
    id: 'f18',
    get text() { return `The probability of selecting the same point in space twice in a row is zero.` },
  },{
    id: 'f19',
    get text() { return `Generators convert mechanical energy into electrical energy.` },
  },{
    id: 'f20',
    get text() { return `If a time circuit can store time flux does that mean it has a flux capacitor?` },
  },{
    id: 'f21',
    get text() { return `There are an uncountably infinite amount of points on a line.` },
  },{
    id: 'f22',
    get text() { return `In 5 hours, something will happen.` },
  },{
    id: 'f23',
    get text() { return `Fun Fact: There is no point to this fun fact!` },
  },{
    id: 'f24',
    get text() { return `The universe is expanding.` },
  },{
    id: 'f25',
    get text() { return `Fun Fact: Fun facts have been known to expand your mind!` },
  },{
    id: 'f26',
    get text() { return `You are always zero percent of the way to infinity.` },
  },{
    id: 'f27',
    get text() { return `Fun Fact: This fun fact is not infinitely fun!` },
  },{
    id: 'f28',
    get text() { return `Fun Fact: You have spent time reading this fun fact!` },
  },{
    id: 'f29',
    condition: () => player.first.infinity,
    get text() { return `Infinity Power is only finitely powerful for balancing reasons.` },
  },{
    id: 'f30',
    get text() { return `After 1g of mass gain, mass gain will be softcapped! ... <span style="margin-left: 250px"></span> Oh wait, mass is not in this game.` },
  },{
    id: 'f31',
    get text() { return `You are currently in the Normal Fact Ticker` },
  },{
    id: 'f32',
    get text() { return `Fun Fact: Generators generate generation!` },
  },{
    id: 'f33',
    get text() { return `Getting some sleep every once in a while will prevent exhaustion.` },
  },{
    id: 'f34',
    get text() { return `Exponentiation is powerful. Just ask any incremental game player!` },
  },{
    id: 'f35',
    get text() { return `This message contains exactly one order of magnitude of words.` },
  },{
    id: 'f36',
    get text() { return `This is a common representation of a point → <span style="margin-left: 100px"></span> ·` },
  },{
    id: 'f37',
    get text() { return `fact_ticker_message` },
  },{
    id: 'f38',
    get text() { return `If you're looking for demons, this is the wrong game.` },
  },{
    id: 'f39',
    get text() { return `Exporting your save keeps it safer than merely keeping it in localStorage.` },
  },{
    id: 'f40',
    get text() { return `This message is not helpful.` },
  },{
    id: 'f41',
    get text() { return `Mega-Generators produce Kilo-Generators. How meta!` },
  },{
    id: 'f42',
    get text() { return `If you click here, you have clicked here.` },
  },{
    id: 'f43',
    get text() { return `You may click here for a Fact Point. Fact Points do nothing useful.` },
  },{
    id: 'f44',
    get text() { return `Aren't infinity points just lines?` },
  },{
    id: 'f45',
    get text() { return `Fun Fact: We have not refined the fun fact generator!` },
  },{
    id: 'f46',
    get text() { return `Fun Fact: We have expanded the fun fact generator!` },
  },{
    id: 'f47',
    get text() { return `Fun Fact: If you see a dad joke, that means the fun fact generator expander is fully functional!` },
  },{
    id: 'f48',
    get text() { return `<span class="corrupted-text">BEWARE OF NORMAL ENERGY</span>` },
  },{
    id: 'f49',
    get text() { return `Refining things usually makes them better` },
  },{
    id: 'f50',
    get text() { return `🐈‍⬛` },
  },{
    id: 'f51',
    get text() { return `There are six sides to a typical six-sided die.` },
  },{
    id: 'f52',
    get text() { return `Aren't recurring subscriptions just real life autobuyers?` },
  },{
    id: 'f53',
    get text() { return `None of the prior or latter messages indicate any possibility of a randomizer implementation of this game` },
  },{
    id: 'f54',
    condition: () => player.first.infinity,
    get text() { return `The first infinite ordinal is known as omega (ω).` },
  },{
    id: 'f55',
    condition: () => player.first.infinity,
    get text() { return `Omega plus one (ω+1) is a successor ordinal as it is the successor of omega (ω).` },
  },{
    id: 'f56',
    condition: () => player.first.infinity,
    get text() { return `Omega times two (ω2) is a limit ordinal as it can't be reached by successor operations.` },
  },{
    id: 'f57',
    condition: () => player.first.infinity,
    get text() { return `Wouldn't breaking infinity just be moving on to the infinite ordinals?` },
  },{
    id: 'f58',
    get text() { return `The earth is not flat.` },
  },{
    id: 'f59',
    get text() { return `<span class="rainbow-text">Color is a subjective experience.</span>` },
  },{
    id: 'f60',
    condition: () => player.first.infinity,
    get text() { return `Infinity power can't be used to charge your phone sadly.` },
  },{
    id: 'f61',
    get text() { return `If you accelerate time flux fast enough, some would say you can start to see blue sparks.` },
  },{
    id: 'f62',
    get text() { return `Fun Fact: This fun fact has in fact been generated!` },
  },{
    id: 'f63',
    get text() { return `Your fact failed to load.` },
  },{
    id: 'f64',
    get text() { return `Click here to make the fact ticker more unusual.` },
  },{
    id: 'f65',
    get text() { return `Click here to make the fact ticker less unusual.` },
  },{
    id: 'f66',
    get text() { return `Here is a message from the Infinity Fact Ticker: This message says "This message says "This message says "This message says "This message says "This message says...` },
  },{
    id: 'f67',
    get text() { return `Conway's Game of Life is a zero player game.` },
  },{
    id: 'f68',
    get text() { return `uʍop ǝpᴉsdn sᴉ ɹoʇᴉuoɯ ɹnoʎ 'sᴉɥʇ pɐǝɹ uɐɔ noʎ ɟI` },
  },{
    id: 'f69',
    get text() { return `This number has been generated by a pseudorandom number generator: ${Math.floor(Math.random() * 1e6 + 1)}` },
  },{
    id: 'f70',
    get text() { return `The process of matter interacting with antimatter is called annihilation.` },
  },{
    id: 'f71',
    get text() { return `Fun Fact: We are autobuying these fun facts!` },
  },{
    id: 'f72',
    get text() { return `One of the developer's other games is Shark Incremental! The link for Shark Incremental is here: <a href="https://mrredshark77.github.io/shark-incremental">https://mrredshark77.github.io/shark-incremental</a>` },
  },{
    id: 'f73',
    get text() { return `NaN stands for "Not a Number". <span style="margin-left: 250px"></span> (oh and the gwa is in fact meant to be a fact message)` },
  },{
    id: 'f74',
    get text() { return `The first fact message suggestion is “description”` },
  },{
    id: 'f75',
    get text() { return `Looking for a wiki? How foolish of you` },
  },{
    id: 'f76',
    get text() { return `Xenna-/Minga- fans seething` },
  },{
    id: 'f77',
    get text() { return `Fun Fact: These fun facts are not challenging!` },
  },{
    id: 'f78',
    condition: () => player.infinity.break,
    get text() { return `Wouldn't an infinity challenge be impossible to complete?` },
  },{
    id: 'f79',
    get text() { return `Fun Fact: Reading this fun fact achieves the achievement of reading a fun fact!` },
  },{
    id: 'f80',
    get text() { return `Fun Fact: Challenges add a new challenge to your gameplay!` },
  },{
    id: 'f81',
    get text() { return `Fun Fact: "Buy All" means to buy everything that you can afford!` },
  },{
    id: 'f82',
    get text() { return `One does not simply Buy All.` },
  },{
    id: 'f83',
    get text() { return `Fun Fact: M is a letter in the English alphabet!` },
  },{
    id: 'f84',
    get text() { return `The world has not ended today.` },
  },{
    id: 'f85',
    get text() { return `Looking directly at the sun can cause blindness.` },
  },{
    id: 'f86',
    get text() { return `Fun Fact: There is at least one star in the sky!` },
  },{
    id: 'f87',
    get text() { return `It is not possible to write out the number Googolplex (${format('ee100')})` },
  },{
    id: 'f88',
    get text() { return `100,000 is known as a Lakh and 10,000,000 is known as a Crore` },
  },{
    id: 'f89',
    get text() { return `#^#, the Cascading-E notation hyperion seen in the number Godgahlah (E100#^#100), is known as an aperio-hyperion` },
  },{
    id: 'f90',
    get text() { return `There is a layer of ozone in the Earth’s atmosphere` },
  },{
    id: 'f91',
    get text() { return `(any particular style of fact messages you're looking for? should they be actual facts or just treated as a more factual news ticker? btw Fun Facts are meant to be obvious and pointless facts)` },
  },{
    id: 'f92',
    get text() { return `Fun Fact: This fun fact did not take an eternity to write!` },
  },{
    id: 'f93',
    get text() { return `For something to be truly eternal it must have no temporal beginning, something without only a temporal end is only perpetual` },
  },{
    id: 'f94',
    get text() { return `One does not simply play this game for an eternity` },
  },{
    id: 'f95',
    get text() { return `Fun Fact: An aeon is a long time!` },
  },{
    id: 'f96',
    get text() { return `Sharks are fish with skeletons made of cartilage` },
  },{
    id: 'f97',
    get text() { return `Fun Fact: Sharks are aquatic animals!` },
  },{
    id: 'f98',
    get text() { return `If you're looking for the <span class="deep-blue-text">Deep Blue Ocean</span>, this is the wrong game.` },
  },{
    id: 'f99',
    get text() { return `<span class="corrupted-text">NORMAL ENERGY IS APPROACHING...</span>` },
  },{
    id: 'f100',
    condition: () => player.infinity.energy.unlocked,
    get text() { return `Taking the Infinity out of Infinity Energy leaves you with Point Energy and not <span class="corrupted-text">Normal Energy</span> as you would be led to believe... <span class="corrupted-text">Normal Energy</span> is an inscrutable force that even the Shark God cannot understand.` },
  },{
    id: 'f101',
    get text() { return `Ever wondered why there are no fish in this game? It's because the Shark God ate them all.` },
  },{
    id: 'f102',
    get text() { return `Here is what to do if you ever encounter <span class="corrupted-text">Normal Energy</span>: It is too late... there is nothing you can do...` },
  },{
    id: 'f103',
    get text() { return `Studies have shown that this game is 98.567% plagiarized from the hit game Antimatter Dimensions!` },
  },{
    id: 'f104',
    get text() { return `A quantity without units (such as 1) is known as a dimensionless quantity.` },
  },{
    id: 'f105',
    get text() { return `Whale Fact: Whales have existed for at least one year.` },
  },{
    id: 'f106',
    get text() { return `Fun Fact: Water is liquid at room temperature!` },
  },{
    id: 'f107',
    get text() { return `Fun Fact: Stars emit light!` },
  },

  {
    id: 'a1',
    get text() { return `My name is Yoshikage Kira. I'm 33 years old. My house is in the northeast section of Morioh, where all the villas are, and I am not married. I work as an employee for the Kame Yu department stores, and I get home every day by 8 PM at the latest. I don't smoke, but I occasionally drink. I'm in bed by 11 PM, and make sure I get eight hours of sleep, no matter what. After having a glass of warm milk and doing about twenty minutes of stretches before going to bed, I usually have no problems sleeping until morning` },
  },{
    id: 'a2',
    get text() { return `Your number is ${Math.floor(Math.random() * 1000 + 1)}, if it is above 900, congratulations` },
  },{
    id: 'a3',
    get text() { return `You have ${format(player.points,0)} points? Noob` },
  },{
    id: 'a4',
    get text() { return `Give us a dark mode setting please, I don't wanna get flashbanged` },
  },{
    id: 'a5',
    get text() {
      const date = new Date().toString()

      return `Today is ${date}. This is [unknown name], your host for today, bringing you your daily Silksong news. There has been no news to report for Silksong today. This has been your daily news for Silksong for today, ${date}.`
    },
  },{
    id: 'a6',
    get text() { return `ReferenceError: Cannot access 'App' before initialization at main.ts` },
  },{
    id: 'a7',
    get text() { return `Forget the Antimatter Dimensions jokes, how about Derpsmith gives you a paperclip in exchange for the letter "Q" in this news message?` },
  },{
    id: 'a8',
    get text() { return `Have you heard of the chinese godfather? He made them an offer they couldnt understand! ` },
  },{
    id: 'a9',
    get text() { return `You have about 7 points (and some change).` },
  },{
    id: 'a10',
    get text() { return `Breaking news! The TV Tropes article for Antimatter Dimensions no longer state that the "Like feasting on a behind" achievement has been removed!` },
  },

  /*
  {
    id: '',
    get text() { return `` },
  },
  */
]

export const NewsTicker = {
  addPlayer(id: string) {
    if (player.news.includes(id)) return;
    player.news.push(id)
  },

  calculateRandomNews() {
    const CN = News.filter(x => x.condition?.() ?? true)

    return CN[Math.floor(Math.random() * CN.length)]
  },

  get uniqueNews() { return player.news.length },
}

import type { Author, Category, ImageAsset, Post } from "@/lib/types"

/**
 * Built-in content used when Firebase is not configured, and the source for
 * `npm run seed`. Images are placeholders from picsum.photos.
 */

function img(seed: string, alt: string, width = 1080, height = 1350): ImageAsset {
  return { src: `https://picsum.photos/seed/${seed}/${width}/${height}`, alt, width, height }
}

export const sampleCategories: Category[] = [
  { slug: "ljepota", name: "Ljepota", description: "Makeup, njega kože, kosa i nokti: sve što vam treba za blistav izgled.", cover: img("bloom-ljepota", "Ljepota", 600, 600), order: 1 },
  { slug: "makeup", name: "Makeup", parent: "ljepota", description: "Trendovi, tutorijali i provjereni proizvodi.", cover: img("bloom-makeup", "Makeup", 600, 600), order: 1 },
  { slug: "njega-koze", name: "Njega kože", parent: "ljepota", description: "Rutine i sastojci koji zaista djeluju.", cover: img("bloom-skincare", "Njega kože", 600, 600), order: 2 },
  { slug: "kosa", name: "Kosa", parent: "ljepota", description: "Frizure, boje i njega kose.", cover: img("bloom-kosa", "Kosa", 600, 600), order: 3 },
  { slug: "nokti", name: "Nokti", parent: "ljepota", description: "Manikura i nail art inspiracija.", cover: img("bloom-nokti", "Nokti", 600, 600), order: 4 },

  { slug: "zdravlje", name: "Zdravlje", description: "Fitness, prehrana i mentalno zdravlje bez komplikacija.", cover: img("bloom-zdravlje", "Zdravlje", 600, 600), order: 2 },
  { slug: "fitness", name: "Fitness", parent: "zdravlje", description: "Treninzi za svaki nivo.", cover: img("bloom-fitness", "Fitness", 600, 600), order: 1 },
  { slug: "mentalno-zdravlje", name: "Mentalno zdravlje", parent: "zdravlje", description: "Mir, balans i briga o sebi.", cover: img("bloom-mental", "Mentalno zdravlje", 600, 600), order: 2 },
  { slug: "prehrana", name: "Prehrana", parent: "zdravlje", description: "Zdrave navike za tanjir.", cover: img("bloom-prehrana", "Prehrana", 600, 600), order: 3 },

  { slug: "moda", name: "Moda", description: "Trendovi sezone, shopping vodiči i stil.", cover: img("bloom-moda", "Moda", 600, 600), order: 3 },
  { slug: "trendovi", name: "Trendovi", parent: "moda", description: "Šta se nosi ove sezone.", cover: img("bloom-trendovi", "Trendovi", 600, 600), order: 1 },
  { slug: "shopping", name: "Shopping", parent: "moda", description: "Odabrali smo za vas.", cover: img("bloom-shopping", "Shopping", 600, 600), order: 2 },

  { slug: "lifestyle", name: "Lifestyle", description: "Putovanja, gastro, dom i dobar život.", cover: img("bloom-lifestyle", "Lifestyle", 600, 600), order: 4 },
  { slug: "putovanja", name: "Putovanja", parent: "lifestyle", description: "Destinacije i vodiči.", cover: img("bloom-travel", "Putovanja", 600, 600), order: 1 },
  { slug: "gastro", name: "Gastro", parent: "lifestyle", description: "Recepti i restorani.", cover: img("bloom-gastro", "Gastro", 600, 600), order: 2 },
  { slug: "enterijer", name: "Enterijer", parent: "lifestyle", description: "Dom koji inspiriše.", cover: img("bloom-enterijer", "Enterijer", 600, 600), order: 3 },

  { slug: "kultura", name: "Kultura", description: "Filmovi, serije, knjige i događaji.", cover: img("bloom-kultura", "Kultura", 600, 600), order: 5 },
  { slug: "film-i-serije", name: "Film i serije", parent: "kultura", description: "Šta gledati ovog vikenda.", cover: img("bloom-film", "Film i serije", 600, 600), order: 1 },
  { slug: "knjige", name: "Knjige", parent: "kultura", description: "Preporuke za čitanje.", cover: img("bloom-knjige", "Knjige", 600, 600), order: 2 },
]

export const sampleAuthors: Author[] = [
  { slug: "amina-hadzic", name: "Amina Hadžić", role: "Urednica ljepote", bio: "Deset godina testira kreme, ruževe i šampone da vi ne biste morali.", avatar: "https://picsum.photos/seed/bloom-amina/200/200", instagram: "amina.beauty" },
  { slug: "lejla-begic", name: "Lejla Begić", role: "Modna urednica", bio: "Vjeruje da je dobar kaput najbolja investicija i da se trendovi nose samo ako vam pristaju.", avatar: "https://picsum.photos/seed/bloom-lejla/200/200", instagram: "lejla.style" },
  { slug: "tarik-kovac", name: "Tarik Kovač", role: "Lifestyle novinar", bio: "Putuje, kuha i piše o mjestima vrijednim vikenda.", avatar: "https://picsum.photos/seed/bloom-tarik/200/200", instagram: "tarik.putuje" },
]

type SeedPost = Omit<Post, "status" | "readingMinutes" | "gallery" | "cover"> & {
  coverSeed: string
  gallerySeeds?: string[]
  ratio?: [number, number]
}

function body(intro: string, sections: [string, string][], tip?: string) {
  const parts = [intro]
  for (const [heading, text] of sections) parts.push(`## ${heading}\n\n${text}`)
  if (tip) parts.push(`> **Bloom savjet:** ${tip}`)
  return parts.join("\n\n")
}

const seeds: SeedPost[] = [
  {
    slug: "jesenja-skincare-rutina-u-5-koraka",
    title: "Jesenja skincare rutina u 5 koraka",
    excerpt: "Hladniji dani traže bogatiju njegu. Ovo je rutina koju dermatolozi preporučuju za prelazak iz ljeta u jesen.",
    body: body(
      "Kada temperature padnu, koža gubi vlagu brže nego što mislite. Zategnutost, crvenilo i suhe mrlje prvi su znakovi da je vrijeme za promjenu rutine.",
      [
        ["1. Nježno čišćenje", "Zamijenite pjenušave gelove kremastim ili uljnim čistačima. Koža treba biti čista, ali ne i zategnuta nakon umivanja."],
        ["2. Hidratantni tonik", "Tonici s hijaluronskom kiselinom ili glicerinom vraćaju vlagu odmah nakon čišćenja. Nanesite ih dlanovima, dok je koža još vlažna."],
        ["3. Serum s niacinamidom", "Niacinamid jača kožnu barijeru i smiruje crvenilo, što je idealno kada grijanje počne isušivati zrak u stanu."],
        ["4. Bogatija krema", "Potražite ceramide, skvalan i shea maslac. Lagani gel kreme ostavite za proljeće."],
        ["5. SPF i dalje svaki dan", "UVA zraci prolaze kroz oblake i prozore. Zaštitni faktor ne ide u ladicu sa ljetnom garderobom."],
      ],
      "Uvedite jednu novu stvar sedmično kako biste znali šta vašoj koži odgovara.",
    ),
    coverSeed: "skincare-autumn", gallerySeeds: ["skincare-2", "skincare-3"],
    category: "njega-koze", tags: ["skincare", "jesen", "rutina"], author: "amina-hadzic",
    publishedAt: "2026-10-09T08:30:00.000Z", featured: true, likes: 1843, views: 12400,
  },
  {
    slug: "trendovi-jesen-zima-2026",
    title: "10 trendova koji obilježavaju jesen i zimu 2026.",
    excerpt: "Od čokoladno smeđe do oversized kaputa: pregledali smo revije i izdvojili trendove koje ćete zaista nositi.",
    body: body(
      "Sezona hladnijih mjeseci donosi povratak klasike, ali s twistom. Evo šta smo vidjeli na pistama Milana, Pariza i Kopenhagena.",
      [
        ["Čokoladno smeđa je nova crna", "Od kaputa do čizama, smeđa u svim nijansama zamjenjuje crnu kao osnovna boja garderobe."],
        ["Oversized krojevi", "Široka ramena i dugi kaputi do gležnja daju siluetu koja je istovremeno udobna i elegantna."],
        ["Teksture", "Bouclé, antilop i krzno (umjetno, naravno) dodaju dubinu i najjednostavnijim kombinacijama."],
      ],
    ),
    coverSeed: "fashion-fw26", gallerySeeds: ["fashion-fw26-2", "fashion-fw26-3"],
    category: "trendovi", tags: ["trendovi", "jesen", "zima"], author: "lejla-begic",
    publishedAt: "2026-10-08T10:00:00.000Z", featured: true, likes: 2310, views: 18900,
  },
  {
    slug: "vikend-u-mostaru-vodic",
    title: "Vikend u Mostaru: vodič za savršena dva dana",
    excerpt: "Gdje jesti, šta vidjeti i kada izbjeći gužve: lokalni vodič za grad na Neretvi.",
    body: body(
      "Mostar je najljepši u jesen, kada turisti odu, a sunce i dalje grije kamen Starog grada.",
      [
        ["Subota", "Jutro počnite kafom pogleda na Stari most, pa prošetajte Kujundžilukom prije podneva. Popodne rezervišite za Blagaj i vrelo Bune."],
        ["Nedjelja", "Kravice su u oktobru mirne i savršene za šetnju. Na povratku svratite u Počitelj na zalazak sunca."],
        ["Gdje jesti", "Probajte domaću klepu i tufahiju u nekom od malih restorana uz Neretvu, daleko od glavne ulice."],
      ],
      "Parkirajte izvan centra i do Starog grada prošetajte, jer ćete uštedjeti i vrijeme i živce.",
    ),
    coverSeed: "mostar-bridge", gallerySeeds: ["mostar-2", "mostar-3"],
    category: "putovanja", tags: ["putovanja", "bih", "vikend"], author: "tarik-kovac",
    publishedAt: "2026-10-07T07:15:00.000Z", featured: true, likes: 3120, views: 25300,
  },
  {
    slug: "glazirane-usne-kako-do-efekta",
    title: "Glazirane usne: kako postići efekat koji traje",
    excerpt: "Trend koji ne izlazi iz mode. Pokazujemo tri načina, od budžetnog do luksuznog.",
    body: body(
      "Sjajne, pune, ali ne ljepljive usne: tajna je u slojevima.",
      [
        ["Priprema", "Piling i balzam pet minuta prije šminkanja. Višak obrišite maramicom."],
        ["Olovka i boja", "Olovka nijansu tamnija od prirodne boje usana, malo izvan linije u sredini za puniji efekat."],
        ["Glaze", "Sjaj nanesite samo na centar donje i gornje usne, pa utapkajte prstom."],
      ],
    ),
    coverSeed: "glazed-lips", gallerySeeds: ["glazed-lips-2"],
    category: "makeup", tags: ["makeup", "usne", "tutorijal"], author: "amina-hadzic",
    publishedAt: "2026-10-06T16:45:00.000Z", featured: false, likes: 987, views: 7600, ratio: [1080, 1080],
  },
  {
    slug: "trening-od-20-minuta-kod-kuce",
    title: "Trening od 20 minuta koji možete raditi u dnevnom boravku",
    excerpt: "Bez opreme, bez izgovora. Kombinacija snage i kardija za cijelo tijelo.",
    body: body(
      "Dvadeset minuta tri puta sedmično dovoljno je da osjetite razliku za mjesec dana.",
      [
        ["Zagrijavanje (3 min)", "Kruženje ramenima, iskoraci u mjestu i lagani skokovi."],
        ["Krug (4 × 4 min)", "- 40 s čučnjevi\n- 40 s sklekovi (na koljenima je sasvim ok)\n- 40 s iskoraci unazad\n- 40 s plank\n- 40 s odmor"],
        ["Istezanje (2 min)", "Ne preskačite. Vaša leđa će vam biti zahvalna."],
      ],
    ),
    coverSeed: "home-workout", gallerySeeds: ["home-workout-2"],
    category: "fitness", tags: ["fitness", "trening", "kod kuće"], author: "tarik-kovac",
    publishedAt: "2026-10-05T06:00:00.000Z", featured: false, likes: 1450, views: 11200,
  },
  {
    slug: "digitalni-detoks-sedmica-bez-telefona",
    title: "Sedmica bez telefona prije spavanja: šta se promijenilo",
    excerpt: "Isprobali smo digitalni detoks. Rezultati su nas iznenadili, posebno kada je riječ o snu.",
    body: body(
      "Pravilo je bilo jednostavno: telefon ostaje u kuhinji od 21 sat.",
      [
        ["Prve dvije večeri", "Nemir i refleksno posezanje za džepom. Čitanje je pomoglo više nego što smo očekivali."],
        ["Treći do peti dan", "Uspavljivanje je brže, a jutra su mirnija jer nema skrolanja odmah po buđenju."],
        ["Zaključak", "Ne morate potpuno odustati od ekrana. Granica od sat vremena prije spavanja već čini razliku."],
      ],
      "Kupite klasičnu budilicu, jer je to najveći izgovor da telefon ostane pored kreveta.",
    ),
    coverSeed: "digital-detox",
    category: "mentalno-zdravlje", tags: ["mentalno zdravlje", "san", "navike"], author: "amina-hadzic",
    publishedAt: "2026-10-04T19:20:00.000Z", featured: false, likes: 2040, views: 15800,
  },
  {
    slug: "bosanski-lonac-moderni-recept",
    title: "Bosanski lonac na moderan način",
    excerpt: "Klasik naših baka, prilagođen za užurbane radne dane. Spremno za sat i po.",
    body: body(
      "Bosanski lonac je jelo koje se ne žuri, ali uz par trikova možete ga imati na stolu i radnim danom.",
      [
        ["Sastojci", "- 500 g junetine\n- 2 glavice luka\n- 3 krompira\n- 2 mrkve\n- 1 paprika\n- kupus, paradajz, bijeli luk, biber u zrnu"],
        ["Priprema", "Meso kratko zapecite, pa slažite slojeve povrća. Prelijte vodom, poklopite i kuhajte na tihoj vatri sat i po."],
      ],
    ),
    coverSeed: "bosanski-lonac", gallerySeeds: ["bosanski-lonac-2"],
    category: "gastro", tags: ["recepti", "tradicionalno"], author: "tarik-kovac",
    publishedAt: "2026-10-03T11:00:00.000Z", featured: false, likes: 2780, views: 21000, ratio: [1080, 1080],
  },
  {
    slug: "kaputi-sezone-shopping-vodic",
    title: "Kaputi sezone: 12 modela za svaki budžet",
    excerpt: "Od klasičnog trenča do vunenog oversized kaputa: izabrali smo modele koje vrijedi kupiti.",
    body: body(
      "Dobar kaput nosite godinama, pa se isplati odvojiti vrijeme za izbor.",
      [
        ["Do 150 KM", "Trench kaputi u bež i maslinastoj boji, savršeni za prelazni period."],
        ["Do 300 KM", "Vuneni blend, oversized kroj. Obratite pažnju na udio vune (bar 50%)."],
        ["Investicija", "Kašmir ili 100% vuna u neutralnoj boji ostaje u ormaru deset godina."],
      ],
    ),
    coverSeed: "coats-shopping", gallerySeeds: ["coats-2", "coats-3"],
    category: "shopping", tags: ["shopping", "kaputi"], author: "lejla-begic",
    publishedAt: "2026-10-02T09:30:00.000Z", featured: false, likes: 1320, views: 9800,
  },
  {
    slug: "boje-kose-za-jesen",
    title: "Boje kose koje dominiraju ove jeseni",
    excerpt: "Cherry cola, bakarna i 'expensive brunette': frizeri otkrivaju koje nijanse najčešće traže klijentice.",
    body: body(
      "Jesen je savršeno vrijeme za toplije i dublje nijanse.",
      [
        ["Cherry cola", "Tamna crvena s ljubičastim podtonom, idealna za tamniju kosu."],
        ["Bakarna", "Od svijetle breskve do intenzivnog bakra, a odlično stoji uz svijetlu put."],
        ["Expensive brunette", "Višedimenzionalna smeđa s mekim prelivima koja izgleda prirodno i luksuzno."],
      ],
    ),
    coverSeed: "hair-color", gallerySeeds: ["hair-color-2"],
    category: "kosa", tags: ["kosa", "boja", "trendovi"], author: "amina-hadzic",
    publishedAt: "2026-10-01T14:00:00.000Z", featured: false, likes: 1675, views: 13100,
  },
  {
    slug: "mali-stan-veliki-stil",
    title: "Mali stan, veliki stil: 7 trikova dizajnera enterijera",
    excerpt: "Ogledala, svjetlo i pametno skladištenje: kako 40 kvadrata učiniti prostranim i toplim.",
    body: body(
      "Mali prostor ne znači kompromis sa stilom.",
      [
        ["Svjetlo u slojevima", "Kombinujte stropno, stolno i podno svjetlo. Toplo bijelo (2700K) čini prostor ugodnijim."],
        ["Namještaj na nogicama", "Kada se vidi pod ispod sofe, prostor djeluje veće."],
        ["Jedan statement komad", "Umjesto puno sitnica, izaberite jednu upečatljivu lampu ili sliku."],
      ],
    ),
    coverSeed: "small-apartment", gallerySeeds: ["small-apartment-2", "small-apartment-3"],
    category: "enterijer", tags: ["enterijer", "dom"], author: "tarik-kovac",
    publishedAt: "2026-09-30T08:00:00.000Z", featured: false, likes: 1980, views: 14500,
  },
  {
    slug: "serije-za-oktobar",
    title: "Serije koje ćemo gledati u oktobru",
    excerpt: "Nove sezone omiljenih naslova i nekoliko skrivenih dragulja za duge jesenje večeri.",
    body: body(
      "Oktobar je mjesec ćebeta, čaja i maratona serija.",
      [
        ["Za ljubitelje trilera", "Nova mini-serija u šest epizoda koja se gleda u jednom dahu."],
        ["Za lagane večeri", "Komedija o grupi prijateljica koje otvaraju kafić u malom gradu."],
      ],
    ),
    coverSeed: "tv-series",
    category: "film-i-serije", tags: ["serije", "preporuke"], author: "lejla-begic",
    publishedAt: "2026-09-29T18:00:00.000Z", featured: false, likes: 860, views: 6900, ratio: [1080, 1080],
  },
  {
    slug: "jesenji-nail-art",
    title: "Jesenji nail art: 15 ideja za manikuru",
    excerpt: "Burgundy, čokoladna i 'milky' nokti: inspiracija za vašu sljedeću posjetu salonu.",
    body: body(
      "Nokti su najlakši način da unesete sezonske boje u svoj izgled.",
      [
        ["Klasika", "Burgundy i tamno zelena na kratkim, zaobljenim noktima uvijek izgledaju elegantno."],
        ["Minimalizam", "Milky nokti s tankim zlatnim detaljem za one koje vole suptilno."],
      ],
    ),
    coverSeed: "nail-art", gallerySeeds: ["nail-art-2", "nail-art-3"],
    category: "nokti", tags: ["nokti", "manikura"], author: "amina-hadzic",
    publishedAt: "2026-09-28T12:00:00.000Z", featured: false, likes: 1210, views: 8800,
  },
  {
    slug: "doruckom-do-energije",
    title: "Doručak koji daje energiju do ručka",
    excerpt: "Proteini, vlakna i zdrave masti: pet brzih kombinacija za jutra kad nemate vremena.",
    body: body(
      "Doručak ne mora biti komplikovan da bi bio nutritivno bogat.",
      [
        ["Ovsena kaša s orašastim plodovima", "Pripremite je večer ranije, a ujutro samo dodajte voće."],
        ["Grčki jogurt i granola", "Birajte granolu bez dodanog šećera ili napravite svoju."],
        ["Jaja i integralni hljeb", "Klasika koja drži sitim satima."],
      ],
    ),
    coverSeed: "healthy-breakfast", gallerySeeds: ["healthy-breakfast-2"],
    category: "prehrana", tags: ["prehrana", "doručak"], author: "tarik-kovac",
    publishedAt: "2026-09-27T07:00:00.000Z", featured: false, likes: 940, views: 7200,
  },
  {
    slug: "knjige-za-jesen",
    title: "8 knjiga za jesenje večeri",
    excerpt: "Romani regionalnih autorica, jedan triler i esejistika koja tjera na razmišljanje.",
    body: body(
      "Naša lista za sezonu kada dani postaju kraći, a večeri duže.",
      [
        ["Regionalna književnost", "Tri romana autorica iz regije koje su ove godine osvojile kritiku."],
        ["Za jedan dah", "Psihološki triler koji ćete pročitati za vikend."],
      ],
    ),
    coverSeed: "books-autumn",
    category: "knjige", tags: ["knjige", "preporuke"], author: "lejla-begic",
    publishedAt: "2026-09-26T17:30:00.000Z", featured: false, likes: 720, views: 5400,
  },
  {
    slug: "kako-nositi-smedu",
    title: "Kako nositi smeđu od glave do pete",
    excerpt: "Monohromatski izgled u nijansama smeđe najelegantniji je trend sezone. Evo kako ga stilizovati.",
    body: body(
      "Total look u jednoj boji izgleda skupo, a lakši je nego što mislite.",
      [
        ["Igrajte se nijansama", "Kombinujte svijetlu kamel, čokoladnu i espresso smeđu."],
        ["Teksture su ključ", "Pletivo, koža i antilop sprečavaju da izgled bude ravan."],
      ],
    ),
    coverSeed: "brown-outfit", gallerySeeds: ["brown-outfit-2"],
    category: "trendovi", tags: ["stil", "trendovi"], author: "lejla-begic",
    publishedAt: "2026-09-25T10:15:00.000Z", featured: false, likes: 1530, views: 10400,
  },
  {
    slug: "retinol-vodic-za-pocetnike",
    title: "Retinol za početnike: sve što trebate znati",
    excerpt: "Kako početi, koliko često i s čim ga (ne) kombinovati: dermatološki vodič korak po korak.",
    body: body(
      "Retinol je najistraženiji anti-age sastojak, ali traži strpljenje.",
      [
        ["Kako početi", "Niska koncentracija (0,2–0,3%), dvije večeri sedmično, na potpuno suhu kožu."],
        ["Šta izbjegavati", "Ne kombinujte ga s kiselinama iste večeri. Vitamin C koristite ujutro."],
        ["SPF je obavezan", "Retinol čini kožu osjetljivijom na sunce."],
      ],
      "Metoda 'sendvič' (krema, retinol, krema) smanjuje iritaciju u prvim sedmicama.",
    ),
    coverSeed: "retinol-guide",
    category: "njega-koze", tags: ["skincare", "retinol", "vodič"], author: "amina-hadzic",
    publishedAt: "2026-09-24T09:00:00.000Z", featured: false, likes: 2210, views: 19700, ratio: [1080, 1080],
  },
]

function readingMinutes(markdown: string) {
  return Math.max(1, Math.round(markdown.split(/\s+/).length / 200))
}

export const samplePosts: Post[] = seeds.map(({ coverSeed, gallerySeeds = [], ratio = [1080, 1350], ...post }) => ({
  ...post,
  status: "published",
  cover: img(`bloom-${coverSeed}`, post.title, ratio[0], ratio[1]),
  gallery: gallerySeeds.map((seed, i) => img(`bloom-${seed}`, `${post.title} (${i + 2})`, ratio[0], ratio[1])),
  readingMinutes: readingMinutes(post.body),
}))

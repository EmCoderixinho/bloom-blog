import { siteConfig } from "@/lib/site"

export type StaticPage = {
  slug: string
  eyebrow: string
  title: string
  description: string
  /** Markdown. */
  body: string
  /** ISO 8601 date of the last content change; used by the sitemap. */
  updatedAt: string
  /** Placeholder copy the owner still has to replace. Shows a notice on the page. */
  draft: boolean
}

const { contact } = siteConfig

const pages = {
  "o-nama": {
    slug: "o-nama",
    eyebrow: "Magazin",
    title: "O nama",
    description: `${siteConfig.name} je online magazin o ljepoti, zdravlju, modi i lifestyleu, pisan za čitateljke iz Bosne i Hercegovine i regije.`,
    updatedAt: "2026-10-11",
    draft: true,
    body: `
${siteConfig.name} je nastao iz jednostavne ideje: da savjeti o ljepoti, zdravlju i stilu budu iskreni, provjereni i prilagođeni životu ovdje, a ne prepisani iz stranih magazina.

## Šta objavljujemo

- **Ljepota:** njega kože i kose, šminka, recenzije proizvoda dostupnih u našim drogerijama i apotekama.
- **Zdravlje:** prehrana, kretanje, san i mentalno zdravlje, uz savjete stručnjaka.
- **Moda:** trendovi sezone, kapsulni ormari i domaći dizajneri.
- **Lifestyle:** putovanja, dom, odnosi i male svakodnevne radosti.

## Kako radimo

Svaki članak prolazi kroz uredništvo. Tekstove o zdravlju provjeravamo sa stručnjacima i navodimo izvore. Kada je tekst sponzorisan ili sadrži plaćenu saradnju, to jasno označavamo na početku članka.

## Redakcija

Iza magazina stoji mali tim urednica, novinarki i fotografkinja. Upoznajte autore na njihovim profilima, a prijedloge tema i ispravke pošaljite na **${contact.email}**.
`,
  },
  kontakt: {
    slug: "kontakt",
    eyebrow: "Javite nam se",
    title: "Kontakt",
    description: `Kontakt podaci redakcije magazina ${siteConfig.name}: prijedlozi tema, ispravke i saradnja.`,
    updatedAt: "2026-10-11",
    draft: true,
    body: `
Rado čitamo vaše poruke. Odgovaramo radnim danima, najčešće u roku od dva dana.

## Redakcija

- **E-mail:** ${contact.email}
- **Telefon:** ${contact.phone} (radnim danima od 9 do 16 h)
- **Adresa:** ${contact.address}

Pišite nam ako imate prijedlog teme, primijetili ste grešku u članku ili želite podijeliti svoju priču.

## Marketing i saradnja

Za oglašavanje, sponzorisane članke i saradnju s brendovima pišite na **${contact.marketingEmail}**. Više o mogućnostima pročitajte na stranici [Marketing](/marketing).

## Društvene mreže

Najbrže nas nađete na Instagramu, Facebooku i TikToku. Linkove imate u podnožju stranice.
`,
  },
  marketing: {
    slug: "marketing",
    eyebrow: "Saradnja",
    title: "Marketing",
    description: `Oglašavanje i saradnja s magazinom ${siteConfig.name}: banneri, sponzorisani članci i kampanje na društvenim mrežama.`,
    updatedAt: "2026-10-11",
    draft: true,
    body: `
${siteConfig.name} čitaju žene koje vole ljepotu, modu i zdrav način života i koje kupuju promišljeno. Brendovima nudimo prostor da do njih dođu na prirodan i pošten način.

## Mogućnosti

- **Display oglasi:** banneri na naslovnoj, u kategorijama i unutar članaka.
- **Sponzorisani članci:** tekst koji pišemo zajedno s vama, u tonu magazina. Uvijek je jasno označen kao sponzorisan.
- **Recenzije proizvoda:** iskreno testiranje u redakciji. Plaćena saradnja ne garantuje pozitivnu ocjenu.
- **Društvene mreže:** objave, priče i reels na našim profilima.
- **Newsletter:** izdvojeno mjesto u sedmičnom newsletteru.

## Kako početi

Pošaljite kratak opis brenda, cilj kampanje i okvirni termin na **${contact.marketingEmail}**. Javit ćemo se s prijedlogom i cjenovnikom (media kit) u roku od nekoliko radnih dana.
`,
  },
  "uslovi-koristenja": {
    slug: "uslovi-koristenja",
    eyebrow: "Pravne informacije",
    title: "Uslovi korištenja",
    description: `Uslovi korištenja web stranice ${siteConfig.domain}: autorska prava, odgovornost za sadržaj i pravila korištenja.`,
    updatedAt: "2026-10-11",
    draft: true,
    body: `
Korištenjem stranice ${siteConfig.domain} prihvatate ove uslove. Ako se s njima ne slažete, molimo vas da ne koristite stranicu.

## Sadržaj je informativan

Članci o ljepoti, zdravlju i prehrani služe isključivo za informisanje. Ne zamjenjuju savjet ljekara, dermatologa ili drugog stručnjaka. Prije promjene terapije, prehrane ili režima njege posavjetujte se sa stručnom osobom.

## Autorska prava

Tekstovi, fotografije, grafike i logotip vlasništvo su magazina ${siteConfig.name} ili njihovih autora. Dozvoljeno je dijeliti linkove na članke. Preuzimanje cijelih tekstova ili fotografija bez pisane dozvole nije dozvoljeno. Za kratke citate navedite izvor i link na originalni članak.

## Linkovi na druge stranice

Članci mogu sadržavati linkove na stranice trećih strana. Ne odgovaramo za njihov sadržaj ni za njihova pravila o privatnosti.

## Oglasi i sponzorisani sadržaj

Stranica prikazuje oglase i povremeno sponzorisane članke. Sponzorisani sadržaj je uvijek jasno označen. Za proizvode i usluge oglašivača odgovaraju oglašivači.

## Izmjene uslova

Ove uslove možemo povremeno izmijeniti. Datum posljednje izmjene navodimo na ovoj stranici.

## Kontakt

Pitanja o ovim uslovima pošaljite na **${contact.email}**.
`,
  },
  privatnost: {
    slug: "privatnost",
    eyebrow: "Pravne informacije",
    title: "Privatnost",
    description: `Kako ${siteConfig.name} prikuplja, koristi i čuva lične podatke: newsletter, analitika, oglasi i kolačići.`,
    updatedAt: "2026-10-11",
    draft: true,
    body: `
Vaša privatnost nam je važna. Ovdje objašnjavamo koje podatke prikupljamo, zašto i kako ih možete kontrolisati.

## Ko obrađuje podatke

Rukovalac podacima je magazin ${siteConfig.name}, ${contact.address}. Za sva pitanja o privatnosti pišite na **${contact.email}**.

## Newsletter

Kada se prijavite na newsletter, čuvamo samo vašu **e-mail adresu**, vrijeme prijave i to da li ste prijavu potvrdili.

- Podatke koristimo isključivo za slanje newslettera.
- Čuvaju se u bazi podataka Google Firebase (Cloud Firestore). Pristup imaju samo administratori magazina.
- Ne prodajemo ih i ne dijelimo s oglašivačima.
- Podaci se čuvaju dok se ne odjavite. Odjaviti se možete u svakom trenutku putem linka u newsletteru ili porukom na ${contact.email}, nakon čega adresu brišemo.

## Analitika

Da bismo znali koji su članci korisni, planiramo mjeriti posjećenost stranice (broj posjeta, pregledane stranice, vrsta uređaja i približna lokacija na nivou države). Analitičke kolačiće uključujemo **samo uz vašu saglasnost**, koju dajete ili odbijate u obavještenju o kolačićima. Saglasnost možete povući u svakom trenutku.

## Oglasi

Stranica će prikazivati oglase putem Google AdSensea. Google i njegovi partneri mogu koristiti kolačiće za prikaz oglasa na osnovu vaših ranijih posjeta ovoj i drugim stranicama. Personalizovane oglase prikazujemo **samo uz vašu saglasnost**. Bez nje vidite opće, nepersonalizovane oglase. Više o tome kako Google koristi podatke pročitajte na policies.google.com/technologies/partner-sites.

## Kolačići

- **Neophodni kolačići** omogućavaju rad stranice i pamte vaš izbor u vezi s kolačićima.
- **Analitički i oglasni kolačići** postavljaju se samo uz vašu saglasnost.

## Vaša prava

Imate pravo zatražiti pristup svojim podacima, njihovu ispravku ili brisanje, ograničenje obrade i prenos podataka, te podnijeti prigovor Agenciji za zaštitu ličnih podataka u Bosni i Hercegovini. Zahtjev pošaljite na ${contact.email}.

## Izmjene

O važnijim izmjenama ove politike obavijestit ćemo vas na ovoj stranici.
`,
  },
} satisfies Record<string, StaticPage>

export type StaticPageSlug = keyof typeof pages

export function getStaticPage(slug: StaticPageSlug): StaticPage {
  return { ...pages[slug], body: pages[slug].body.trim() }
}

export function getStaticPages(): StaticPage[] {
  return (Object.keys(pages) as StaticPageSlug[]).map(getStaticPage)
}

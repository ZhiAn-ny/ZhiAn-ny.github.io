
let pageISO = document.querySelector("html").lang;

function getDataSet(iso) {
    let pageISO = iso == undefined ? document.querySelector("html").lang : iso;
    switch (pageISO) {
        case "it":
            return it;
        case "en":
            return en;
        default:
            return it;
   }
}

export function translate(key, args) {
   let lang = getDataSet();
   let trStr = lang[key];
   if (args != undefined && args.length > 0) {
       for (let i = 0; i < args.length; i++) {
           trStr = trStr.replace(`\${${i}}`, args[i]);
       }
   }
   return trStr;
}

/** Doesn't function with strings with arguments. */
export function translateText(text, origLang) {
   let orig = getDataSet(origLang);
   let other = getDataSet();
   let key = getKeyFromText(text, orig);
   return other[key];
}

function getKeyFromText(text, dataSet) {
    for (let key in dataSet) {
        if (dataSet[key] == text) {
            return key;
        }
    }
    return "";
}

export function switchLanguage(lang) {
    const allTxt = document.querySelectorAll("h1, h2, p, label, button, a");
    const current = getDataSet();
    const other = getDataSet(lang);
    allTxt.forEach((element) => {
        const txt = element.innerText;
        for (const key in current) {
            if (txt == current[key]) {
                element.innerText = other[key];
            }
        }
    })
}

const it = {
    invalidChar: "Carattere non valido rilevato.",
    namesCantContainSpecials: "I nomi possono contenere solo lettere, spazi, trattini e apostrofi.",
    alertSQLInjection: "Eh, volevi fare il furbo?",
    guestNotFound: "Mi dispiace, non ho trovato nessun invitato con questo nome. Puoi sempre provare a contattare gli sposi se pensi ci sia un errore.",
    andYourFamily: ", assieme alla tua famiglia,",
    andYourPartner: ", assieme alla tua dolce metà,",
    weddingInvite: "Gentile ${0} ${1}, siamo lieti di invitarti${2} al nostro matrimonio!",
    txt_happyToAnnounce: "Siamo lieti di annunciare che",
    txt_gettingMarried: "Ci sposiamo!",
    txt_happyToShareNews: "Siamo felicissimi di condividere con te questa notizia!",
    txt_weddingWillBe: "Il matrimonio si terrà",
    saturday: "Sabato",
    may30: "30 Maggio 2026",
    h15: "Ore 15:00",
    viewAddress: "Vedi indicazioni",
    txt_partyWillTakePlace: "I festeggiamenti proseguiranno poi con amici e parenti presso",
    inMisano: "a Misano Adriatico",
    txt_waitingBigDay: "In attesa del grande giorno, abbiamo creato questo sito, dove scriveremo tutti gli aggiornamenti e i dettagli riguardanti il nostro matrimonio.",
    txt_belowIsRSVP: "Più in basso troverai una sezione dedicata alla conferma della tua presenza: ti preghiamo di darci una risposta il prima possibile in modo da aiutarci nell'organizzazione dei preparativi.",
    searchGuestList: "Cerca il tuo nominativo nella lista degli invitati e compila il form per confermare.",
    search: "Cerca",
    txt_pleaseCompileForm: "Per favore, compila il modulo sottostante per confermare la tua presenza.",
    onHold: "In Attesa",
    present: "Parteciperò",
    absent: "Non parteciperò",
    needTransportation: "Serve un passaggio?",
    txt_transportationDisclaimer: "Disclaimer: stiamo considerando un servizio navetta ma solo se riusciamo a abbastanza partecipanti.",
    save: "Salva",
    txt_thankYouForRSVP: "Grazie della conferma!",
    menu_adult: "Adulto",
    menu_child: "Bambino",
    menu_vegan: "Vegano",
    menu_vegetarian: "Vegetariano",
    menu_halal: "Halal",
    confirmed: "Confermato",
};

const en = {
    invalidChar: "Invalid char detected.",
    namesCantContainSpecials: "Names can only contain letters, spaces, dashes and apostrophes.",
    alertSQLInjection: "You think you're smart?",
    guestNotFound: "Sorry, I couldn't find any guest with that name. If you think there's been an error you could always try to contact the groom and the bride.",
    andYourFamily: ", together with your family,",
    andYourPartner: ", together with your partner,",
    weddingInvite: "Dear ${0} ${1}, we're happy to invite you${2} to our wedding!",
    txt_happyToAnnounce: "We're happy to announce that",
    txt_gettingMarried: "We're getting married!",
    txt_happyToShareNews: "We're delighted to share with you this news!",
    txt_weddingWillBe: "The wedding will be",
    saturday: "Saturday",
    may30: "May 30th 2026",
    h15: "At 3:00 pm",
    viewAddress: "See adrress",
    txt_partyWillTakePlace: "The party will then take place with friends and family members at",
    inMisano: "in Misano Adriatico",
    txt_waitingBigDay: "While waiting for the special day, we created this website where we will post all the updates and details regarding our wedding.",
    txt_belowIsRSVP: "Below you'll find a section dedicated to confirming your presence. We ask kindly to send your confirmation as soon as possible to help us organizing the day.",
    searchGuestList: "Search your name in the guest list.",
    search: "Search",
    txt_pleaseCompileForm: "Please, compile the form below to confirm your presence.",
    onHold: "Pending",
    present: "Will be there",
    absent: "Won't make it",
    needTransportation: "Need a ride?",
    txt_transportationDisclaimer: "Disclaimer: we're considering a shuttle service if there will be enough participants.",
    save: "Save",
    txt_thankYouForRSVP: "Thank you for your confirmation!",
    menu_adult: "Adu1t",
    menu_child: "Child",
    menu_vegan: "Vegan",
    menu_vegetarian: "Vegetarian",
    menu_halal: "Halal",
    confirmed: "Confirmed",
};

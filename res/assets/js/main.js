import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const supabaseUrl = "https://irvazdxcjjnjvilkpoqj.supabase.co";
const supabaseKey = "sb_publishable_Wh3FU7a6kxGTG2hbOETZBA_tcTNe-Ba";

export const supabase = createClient(supabaseUrl, supabaseKey);

const _person = { name: "", surname: "" };
let _guestForm = document.querySelector("form[id='guest-form']");

async function searchGuest() {
  _person.name = document.querySelector("input[name='name']").value;
  _person.surname = document.querySelector("input[name='surname']").value;

  const hasSQLInjection = /('|--|;|\/\*|\*\/|xp_)/i;
  if (hasSQLInjection.test(_person.name) || hasSQLInjection.test(_person.surname)) {
    showGuestError("Carattere non valido rilevato.");
    return;
  }

  const namePattern = /^[a-zA-ZÀ-ÖØ-öø-ÿ\s'-]*$/;
  if (!namePattern.test(_person.name) || !namePattern.test(_person.surname)) {
    showGuestError("I nomi possono contenere solo lettere, spazi, trattini e apici.");
    return;
  }

  const hasForbiddenWords = /(admin|select|drop|insert|delete|update|union|create|alter|shutdown)/i;
  if (hasForbiddenWords.test(_person.name) || hasForbiddenWords.test(_person.surname)) {
    showGuestError("Eh, volevi fare il furbo?");
    return;
  }

  _guestForm.querySelector("p.error")?.remove();
  const { data, error } = await supabase
    .from("guests")
    .select("id,name,surname")
    .ilike("name", '%' + _person.name + '%')
    .ilike("surname", '%' + _person.surname + '%');

    if (data.length === 0) {
      showGuestError("Mi dispiace, non ho trovato nessun invitato con questo nome. Puoi sempre provare a contattare gli sposi se pensi ci sia un errore.");
      return;
    } else {
      displayGuestResults(data);
    }
}

function showGuestError(message) {
  let error = _guestForm.querySelector("p");
  if (error == null) {
    error = document.createElement("p");
    error.classList.add("error");
    _guestForm.appendChild(error);
  }
  error.textContent = message;
}

function displayGuestResults(guests) {
  console.log(guests);

}

document.querySelector("input[name='name']").addEventListener("input", searchGuest);
document.querySelector("input[name='surname']").addEventListener("input", searchGuest);
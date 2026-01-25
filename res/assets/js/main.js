import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const supabaseUrl = "https://irvazdxcjjnjvilkpoqj.supabase.co";
const supabaseKey = "sb_publishable_Wh3FU7a6kxGTG2hbOETZBA_tcTNe-Ba";

export const supabase = createClient(supabaseUrl, supabaseKey);

let _person = { name: "", surname: "" };
const guestForm = document.querySelector("form[id='guest-form']");
const guestList = document.querySelector("ul[id='guest-list']");


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

  guestForm.querySelector("p.error")?.remove();
  const { data, error } = await supabase
    .from("guests")
    .select("name,surname,invite_code,invite_type")
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
  let error = guestForm.querySelector("p");
  if (error == null) {
    error = document.createElement("p");
    error.classList.add("error");
    guestForm.appendChild(error);
  }
  error.textContent = message;
}

function displayGuestResults(guests) {
  guestList.innerHTML = "";
  guests.forEach(guest => {
    const listItem = document.createElement("li");
    listItem.textContent = `${guest.name} ${guest.surname}`;
    listItem.addEventListener("click", selectGuest.bind(null, guest));
    guestList.appendChild(listItem);
  });
}

async function selectGuest(guest) {
  document.querySelector(".loading").hidden = false;
  document.querySelector("search").hidden = true;
  _person = guest;
  await showRSVPForm();
}

async function showRSVPForm() {
  const invite = document.querySelector("p[name=invite]");
  let andCo = "";
  switch (_person.invite_type) {
    case 0:
      andCo = ", assieme alla tua famiglia,"; break;
    case 2:
      andCo = ", assieme alla tua dolce metà,"; break;
  }
  invite.innerHTML = `Gentile ${_person.name} ${_person.surname}, siamo lieti di invitarti${andCo} al nostro matrimonio!`;

  const { data, error } = await supabase
    .from("guests")
    .select("presence, menu, allergies, transport, return_time")
    .eq('invite_code', _person.invite_code);
  const guest = data[0];

  document.querySelector(`input[name="participation"][value="${guest.presence ? "yes" : "no"}"]`).checked = true;
  document.querySelector("select[name=menu]").value = guest.menu;
  document.querySelector("input[name=allergies]").value = guest.allergies;
  document.querySelector("input[name=transport]").checked = guest.transport;

  await addMenuOption();

  document.querySelector(".loading").hidden = true;
  document.querySelector("article#invite").hidden = false;
}

async function addMenuOption() {
  const menuSelect = document.querySelector("select[name=menu]");
  menuSelect.innerHTML = "";

  const { data, error } = await supabase
    .from("menu")
    .select("*");

  data.forEach(menu => {
    menuSelect.innerHTML += `<option value="${menu.id}">${menu.name}</option>`;
  })
}

async function sendRSVP() {
  const presence = document.querySelector('input[name="participation"]:checked').value == "yes";
  const menu = document.querySelector("select[name=menu]").value;
  const allergies = document.querySelector("input[name=allergies]").value;
  const needTransportation = document.querySelector("input[name=transport]").checked;


  const { data, error } = await supabase
    .from('guests')
    .update({
      presence: presence,
      menu: menu,
      allergies: allergies,
      transport: needTransportation,
      last_edit: Date.now()
    })
    .eq('invite_code', _person.invite_code)
    .select();

  document.querySelector("article#invite").hidden = true;
  document.querySelector("h2#RSVP-confirmation").hidden = false;
}

document.querySelector("button#search").addEventListener("click", searchGuest);
document.querySelector("button#sendRSVP").addEventListener("click", sendRSVP);

document.querySelector("a#church").addEventListener("click", () => {
  window.open("https://maps.app.goo.gl/1Bsk7EYBc3NLmp276");
});
document.querySelector("a#girasoli").addEventListener("click", () => {
  window.open("https://maps.app.goo.gl/GuhS9SsRiCNxaVS5A");
});


import { getWeddingGuests, getGuestData, getMenuList, updateGuestData } from "./database.js"
import { translate, switchLanguage, translateText } from "./transloco.js"

let _person = { name: "", surname: "" };
const guestForm = document.querySelector("form[id='guest-form']");
const guestList = document.querySelector("ul[id='guest-list']");

function checkSearchData() {
  const hasSQLInjection = /('|--|;|\/\*|\*\/|xp_)/i;
  if (hasSQLInjection.test(_person.name) || hasSQLInjection.test(_person.surname)) {
    showGuestError(translate("invalidChar"));
    return;
  }

  const namePattern = /^[a-zA-ZÀ-ÖØ-öø-ÿ\s'-]*$/;
  if (!namePattern.test(_person.name) || !namePattern.test(_person.surname)) {
    showGuestError(translate("namesCantContainSpecials"));
    return;
  }

  const hasForbiddenWords = /(admin|select|drop|insert|delete|update|union|create|alter|shutdown)/i;
  if (hasForbiddenWords.test(_person.name) || hasForbiddenWords.test(_person.surname)) {
    showGuestError(translate("alertSQLInjection"));
    return;
  }
}

async function searchGuest() {
  _person.name = document.querySelector("input[name='name']").value;
  _person.surname = document.querySelector("input[name='surname']").value;

  checkSearchData();

  guestForm.querySelector("p.error")?.remove();
  const data = await getWeddingGuests(_person.name, _person.surname);

  if (data.length === 0) {
    showGuestError(translate("guestNotFound"));
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

function personalizeInvite() {
  const invite = document.querySelector("p[name=invite]");
  let andCo = "";
  switch (_person.invite_type) {
    case 0:
      andCo = translate("andYourFamily"); break;
    case 2:
      andCo = translate("andYourPartner"); break;
  }
  invite.innerText = translate("weddingInvite", [_person.name, _person.surname, andCo]);
}

async function showRSVPForm() {
  personalizeInvite();

  const guest = await getGuestData(_person.invite_code);
  document.querySelector(`input[name="participation"][value="${guest.presence}"]`).checked = true;
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
  const data = await getMenuList()
  data.forEach(menu => {
    let menuName = translateText(menu.name, "it");
    menuSelect.innerHTML += `<option value="${menu.id}">${menuName}</option>`;
  })
}

async function sendRSVP() {
  const presence = document.querySelector('input[name="participation"]:checked').value;
  const menu = document.querySelector("select[name=menu]").value;
  const allergies = document.querySelector("input[name=allergies]").value;
  const needTransportation = document.querySelector("input[name=transport]").checked;

  await updateGuestData(_person.invite_code, presence, menu, allergies, needTransportation);

  document.querySelector("article#invite").hidden = true;
  document.querySelector("h2#RSVP-confirmation").hidden = false;
}

document.querySelector("button#search").addEventListener("click", searchGuest);
document.querySelector("button#sendRSVP").addEventListener("click", sendRSVP);

const langs = document.querySelectorAll("span[name=lang-selector]");
langs.forEach(lang => {
  lang.addEventListener("click", () => {
    switchLanguage(lang.getAttribute("iso"));
    document.querySelector("html").lang = lang.getAttribute("iso");
  });
})

document.querySelector("a#church")?.addEventListener("click", () => {
  window.open("https://maps.app.goo.gl/1Bsk7EYBc3NLmp276");
});
document.querySelector("a#girasoli")?.addEventListener("click", () => {
  window.open("https://maps.app.goo.gl/GuhS9SsRiCNxaVS5A");
});


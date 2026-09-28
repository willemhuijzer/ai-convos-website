import { edition } from "./edition.js";
import "./edition-view.js";

const form = document.querySelector("#registration-form");
const fields = document.querySelector("#registration-fields");
const submitLabel = document.querySelector("#details-submit-label");
const error = document.querySelector("#registration-error");
const nameInput = document.querySelector("#guest-name");
const storageKey = `ai-convos:registration:${edition.id}`;
let sending = false;

// Only a receipt flag and an idempotency identifier survive a refresh in this tab.
// Names, emails, notes, payment status and questionnaire answers are never stored here.
let receipt;
try { receipt = JSON.parse(sessionStorage.getItem(storageKey)); } catch { /* Storage may be unavailable. */ }
if (!receipt || typeof receipt.id !== "string" || typeof receipt.saved !== "boolean") {
  receipt = { id: crypto.randomUUID(), saved: false };
}
function rememberReceipt() {
  try { sessionStorage.setItem(storageKey, JSON.stringify(receipt)); } catch { /* The current page still works. */ }
}

function configuredUrl(value, allowSameOrigin = false) {
  if (!value || !value.trim()) return null;
  try {
    const url = new URL(value, location.href);
    if (url.username || url.password) return null;
    return url.protocol === "https:" || (allowSameOrigin && url.origin === location.origin) ? url.href : null;
  } catch { return null; }
}

const endpoint = configuredUrl(edition.registrationEndpoint, true);
fields.disabled = !endpoint;
document.querySelector("#registration-unavailable").hidden = Boolean(endpoint);

function configureLink(id, value) {
  const url = configuredUrl(value);
  const link = document.querySelector(`#${id}-link`);
  link.hidden = !url;
  document.querySelector(`#${id}-unavailable`).hidden = Boolean(url);
  document.querySelector(`#${id}-link-note`).hidden = !url;
  if (url) link.href = url;
}
configureLink("payment", edition.paymentUrl);
configureLink("questionnaire", edition.questionnaireUrl);

function requestedStage() {
  return location.hash.slice(1) || (receipt.saved ? "payment" : "details");
}

function showStage(requested, { navigate = false, focus = true } = {}) {
  const allowed = ["details", "payment", "questionnaire", "later"];
  let stage = allowed.includes(requested) ? requested : "details";
  // Questionnaire links can be shared freely; only the saved-details claim is guarded.
  if (stage === "payment" && !receipt.saved) stage = "details";
  if (stage === "details" && receipt.saved) stage = "payment";
  document.querySelector("#register-another").hidden = !receipt.saved;
  document.querySelectorAll("[data-stage]").forEach((panel) => {
    panel.hidden = panel.dataset.stage !== stage;
  });
  document.querySelectorAll("[data-progress]").forEach((item) => {
    if (item.dataset.progress === (stage === "later" ? "questionnaire" : stage)) item.setAttribute("aria-current", "step");
    else item.removeAttribute("aria-current");
  });
  if (navigate && location.hash !== `#${stage}`) history.pushState(null, "", `#${stage}`);
  const heading = document.querySelector(`[data-stage="${stage}"] h2`);
  document.title = `${heading.textContent} — AI Convos`;
  if (focus) {
    heading.focus({ preventScroll: true });
    heading.scrollIntoView({ block: "nearest", behavior: "instant" });
  }
}

nameInput.addEventListener("input", () => nameInput.setCustomValidity(""));
form.addEventListener("submit", async (event) => {
  event.preventDefault();
  if (!endpoint || sending || receipt.saved) return;
  nameInput.setCustomValidity(nameInput.value.trim() ? "" : "Please enter your name.");
  if (!form.reportValidity()) return;

  const payload = new FormData(form);
  payload.set("name", nameInput.value.trim());
  payload.set("email", document.querySelector("#guest-email").value.trim());
  payload.set("notes", document.querySelector("#guest-notes").value.trim());
  payload.set("edition", edition.id);
  payload.set("registration_id", receipt.id);
  rememberReceipt();
  sending = true;
  fields.disabled = true;
  form.setAttribute("aria-busy", "true");
  error.hidden = true;
  submitLabel.textContent = "sending your details…";
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), 20000);
  try {
    const response = await fetch(endpoint, {
      method: "POST",
      body: payload,
      headers: { Accept: "application/json" },
      credentials: "omit",
      signal: controller.signal,
    });
    if (!response.ok || (await response.json()).ok !== true) throw new Error("Not acknowledged");
    receipt.saved = true;
    rememberReceipt();
    form.reset();
    showStage("payment", { navigate: true });
  } catch {
    error.textContent = "We couldn’t confirm your details were saved. Please try again, or email hello@aiconvos.nl if this keeps happening.";
    error.hidden = false;
  } finally {
    clearTimeout(timeout);
    sending = false;
    fields.disabled = false;
    form.removeAttribute("aria-busy");
    submitLabel.textContent = "continue to payment";
  }
});

document.querySelectorAll("[data-go]").forEach((button) => {
  button.addEventListener("click", () => showStage(button.dataset.go, { navigate: true }));
});
document.querySelector("#register-another").addEventListener("click", () => {
  receipt = { id: crypto.randomUUID(), saved: false };
  rememberReceipt();
  form.reset();
  showStage("details", { navigate: true });
});
window.addEventListener("popstate", () => showStage(requestedStage()));
window.addEventListener("hashchange", () => showStage(requestedStage()));
showStage(requestedStage(), { focus: false });

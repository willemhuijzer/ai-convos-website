import { edition } from "./edition.js";

export function renderEdition() {
  document.querySelectorAll("[data-edition]").forEach((element) => {
    const value = edition[element.dataset.edition];
    if (typeof value === "string") element.textContent = value;
  });
}

renderEdition();

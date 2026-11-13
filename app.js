"use strict";

const projectsContainer =
  document.getElementById("projects");

const filters =
  document.querySelectorAll(".filter");

const year =
  document.getElementById("year");

let projects = [];


// ======================================
// AÑO
// ======================================

if (year) {
  year.textContent =
    new Date().getFullYear();
}


// ======================================
// CARGAR PROYECTOS
// ======================================

async function loadProjects() {

  try {

    const response =
      await fetch(
        "./projects.json?v=" +
        Date.now(),
        {
          cache: "no-store"
        }
      );

    if (!response.ok) {
      throw new Error(
        "No se pudo cargar projects.json"
      );
    }

    projects =
      await response.json();

    renderProjects("Todos");

  } catch (error) {

    console.error(error);

    projectsContainer.innerHTML = `
      <div class="card">
        <div class="card-icon">⚠️</div>

        <h3>
          No se pudieron cargar los proyectos
        </h3>

        <p>
          Verifica que el archivo
          <strong>projects.json</strong>
          esté en la misma carpeta que
          index.html.
        </p>
      </div>
    `;
  }

}


// ======================================
// MOSTRAR PROYECTOS
// ======================================

function renderProjects(category) {

  projectsContainer.innerHTML = "";

  const filtered =
    category === "Todos"
      ? projects
      : projects.filter(
          project =>
            project.category === category
        );


  if (!filtered.length) {

    projectsContainer.innerHTML = `
      <div class="card">
        <div class="card-icon">🔎</div>

        <h3>
          Sin proyectos
        </h3>

        <p>
          Todavía no hay proyectos dentro
          de esta categoría.
        </p>
      </div>
    `;

    return;
  }


  filtered.forEach(project => {

    const card =
      document.createElement("article");

    card.className = "card";


    let statusClass = "";

    if (project.status === "NUEVO") {
      statusClass = "new";
    }

    if (project.status === "EN DESARROLLO") {
      statusClass = "dev";
    }


    card.innerHTML = `

      <span class="status ${statusClass}">
        ${escapeHTML(project.status)}
      </span>

      <div class="card-icon">
        ${escapeHTML(project.icon)}
      </div>

      <h3>
        ${escapeHTML(project.name)}
      </h3>

      <p>
        ${escapeHTML(project.description)}
      </p>

      <a
        class="card-link"
        href="${safeURL(project.url)}"
        target="_blank"
        rel="noopener noreferrer">

        ${project.status === "PRÓXIMAMENTE"
          ? "Próximamente →"
          : "Visitar proyecto →"}

      </a>

    `;


    projectsContainer.appendChild(card);

  });

}


// ======================================
// FILTROS
// ======================================

filters.forEach(button => {

  button.addEventListener(
    "click",
    () => {

      filters.forEach(btn =>
        btn.classList.remove("active")
      );

      button.classList.add("active");

      renderProjects(
        button.dataset.category
      );

    }
  );

});


// ======================================
// SEGURIDAD BÁSICA
// ======================================

function escapeHTML(value) {

  return String(value ?? "")
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#039;");
}


function safeURL(value) {

  const url =
    String(value ?? "").trim();

  if (
    url === "#" ||
    url === ""
  ) {
    return "#";
  }

  try {

    const parsed =
      new URL(url, window.location.href);

    if (
      parsed.protocol === "https:" ||
      parsed.protocol === "http:"
    ) {
      return parsed.href;
    }

  } catch (error) {
    console.warn(
      "URL inválida:",
      value
    );
  }

  return "#";
}


// ======================================
// INICIAR
// ======================================

loadProjects();

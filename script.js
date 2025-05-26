// Password for deletion
const DELETE_PASSWORD = "letmein123"; // Change to your password!

// DOM references
const themeForm = document.getElementById("themeForm");
const themeInput = document.getElementById("themeInput");
const themeList = document.getElementById("themeList");

const poemSection = document.getElementById("poemSection");
const poemForm = document.getElementById("poemForm");
const poemInput = document.getElementById("poemInput");
const poemList = document.getElementById("poemList");
const poemThemeTitle = document.getElementById("poemThemeTitle");
const backButton = document.getElementById("backButton");

// Data from localStorage or empty
let themes = JSON.parse(localStorage.getItem("themes")) || [];
let poemsByTheme = JSON.parse(localStorage.getItem("poemsByTheme")) || {};
let currentTheme = null;

// Render the list of themes
function renderThemes() {
  themeList.innerHTML = "";
  themes.forEach((theme) => {
    const li = document.createElement("li");

    // Theme text clickable to open poems
    const textSpan = document.createElement("span");
    textSpan.textContent = theme;
    textSpan.style.cursor = "pointer";
    textSpan.onclick = () => openPoemView(theme);

    // Delete button with password protection
    const deleteBtn = document.createElement("button");
    deleteBtn.textContent = "✖️";
    deleteBtn.onclick = (e) => {
      e.stopPropagation(); // prevent openPoemView
      const entered = prompt("Enter password to delete this theme:");
      if (entered === DELETE_PASSWORD) {
        if (confirm(`Delete theme "${theme}" and all its poems?`)) {
          themes = themes.filter((t) => t !== theme);
          delete poemsByTheme[theme];
          localStorage.setItem("themes", JSON.stringify(themes));
          localStorage.setItem("poemsByTheme", JSON.stringify(poemsByTheme));
          renderThemes();
          if (currentTheme === theme) {
            backToThemes();
          }
        }
      } else {
        alert("Incorrect password. Deletion cancelled.");
      }
    };

    li.appendChild(textSpan);
    li.appendChild(deleteBtn);
    themeList.appendChild(li);
  });
}

// Render poems for current theme
function renderPoems() {
  const poems = poemsByTheme[currentTheme] || [];
  poemList.innerHTML = "";
  poems.forEach((poem, index) => {
    const li = document.createElement("li");

    const textSpan = document.createElement("span");
    textSpan.textContent = poem;

    const deleteBtn = document.createElement("button");
    deleteBtn.textContent = "✖️";
    deleteBtn.onclick = () => {
      const entered = prompt("Enter password to delete this poem:");
      if (entered === DELETE_PASSWORD) {
        if (confirm("Delete this poem?")) {
          poems.splice(index, 1);
          poemsByTheme[currentTheme] = poems;
          localStorage.setItem("poemsByTheme", JSON.stringify(poemsByTheme));
          renderPoems();
        }
      } else {
        alert("Incorrect password. Deletion cancelled.");
      }
    };

    li.appendChild(textSpan);
    li.appendChild(deleteBtn);
    poemList.appendChild(li);
  });
}

// Open poems view for a theme
function openPoemView(theme) {
  currentTheme = theme;
  poemThemeTitle.textContent = `Poems for: "${theme}"`;
  poemInput.value = "";
  renderPoems();
  poemSection.style.display = "block";
  themeForm.style.display = "none";
  themeList.style.display = "none";
}

// Return to theme list
function backToThemes() {
  currentTheme = null;
  poemSection.style.display = "none";
  themeForm.style.display = "block";
  themeList.style.display = "block";
}

// Add a new theme
themeForm.addEventListener("submit", (e) => {
  e.preventDefault();
  const theme = themeInput.value.trim();
  if (theme && !themes.includes(theme)) {
    themes.unshift(theme);
    localStorage.setItem("themes", JSON.stringify(themes));
    renderThemes();
    themeInput.value = "";
  }
});

// Add a new poem
poemForm.addEventListener("submit", (e) => {
  e.preventDefault();
  const poem = poemInput.value.trim();
  if (poem && currentTheme) {
    if (!poemsByTheme[currentTheme]) {
      poemsByTheme[currentTheme] = [];
    }
    poemsByTheme[currentTheme].unshift(poem);
    localStorage.setItem("poemsByTheme", JSON.stringify(poemsByTheme));
    renderPoems();
    poemInput.value = "";
  }
});

// Back button handler
backButton.addEventListener("click", backToThemes);

// Initial render
renderThemes();

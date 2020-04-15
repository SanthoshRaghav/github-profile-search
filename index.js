// display message
function displayMessage(text) {
  var targetElement = document.getElementById("content");
  var message = "<h2 class='message'>" + text + "</h2>";
  targetElement.innerHTML = message;
}

/**
 * on clearing the input field this method will trigger
 */
function onClearText() {
  if (event.target.value === "") {
    eraseElement("content", true);
  }
}

// construct element
function constructElement(elementName, eleClassName, eleId = null) {
  var element;
  if (elementName && eleClassName) {
    element = document.createElement(elementName);
    element.className = eleClassName;

    if (eleId) {
      element.id = eleId;
    }
  }
  return element;
}

// to close modal
function closeModal() {
  var targetElement = document.getElementById("modal-wrapper");
  eraseElement("model-ul");
  targetElement.style.display = "none";
}

// erase element
function eraseElement(elementId, deleteChildren = false) {
  var target = document.getElementById(elementId);

  if (deleteChildren) {
    while (target.firstChild) {
      target.removeChild(target.firstChild);
    }
  } else {
    target.remove();
  }
}

// search
function search() {
  var data = [];
  var query = event.target.value;
  if (query !== "") {
    fetch("https://api.github.com/search/users?q=" + query)
      .then((res) => res.json())
      .then((res) => {
        data = res.items;
        if (data !== undefined && data.length > 0) {
          var targetElement = document.getElementById("content");
          eraseElement("content", true);
          var output = "";
          data.forEach((obj) => {
            output += `<li class="list__item" onclick="openModal('${obj.login}')">
              <img class="list__item-image" src="${obj.avatar_url}">
              <div class="list__item-details">
              <h2 class="list__item-heading">${obj.login}</h2>
              <span class="score">score : ${obj.score}</span>
              </div>
            </li>
            `;
            targetElement.innerHTML = output;
          });
        } else {
          eraseElement("content", true);
          displayMessage("No Data Found");
        }
      })
      .catch((error) => {
        displayMessage("Failed To Fetch Because Of CORS");
      });
  } else {
    eraseElement("content", true);
  }
}

function openModal(username) {
  var modalElement = document.getElementById("modal");
  var targetElement = document.getElementById("modal-wrapper");

  fetch("https://api.github.com/users/" + username)
    .then((res) => res.json())
    .then((res) => {
      var ulElement = constructElement("ul", "model-list", "model-ul");

      var arr = [
        {
          value: res.public_repos,
          icon: "repos",
          key: "Public Repositories",
        },

        {
          value: res.followers,
          icon: "followers",
          key: "Followers",
        },

        {
          value: res.following,
          icon: "following",
          key: "Following",
        },

        {
          value: res.created_at,
          icon: "created",
          key: "Created At",
        },

        {
          value: res.site_admin,
          icon: "admin",
          key: "Admin",
        },
      ];
      var output = "";
      arr.forEach((data) => {
        output += `
          <li class="modal-list-item">
          <div class="icon ${data.icon}"></div>
          <span>${data.key} : ${data.value}</span>
          </li>
        `;
      });
      ulElement.innerHTML = output;
      modalElement.appendChild(ulElement);
      targetElement.style.display = "block";
    });
}

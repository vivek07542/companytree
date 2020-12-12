var companyDetailsFromStorage = JSON.parse(localStorage.getItem("companyDetailsFromStorage"));
var companyDetails = JSON.parse(localStorage.getItem("companyDetails"));
// Message Display for 10 sec
let messageDisplayBox = document.getElementById("messageDisplayBox");
let textMessageDisplay = document.getElementById("textMessageDisplay");
textMessageDisplay.innerText = "Your Data Saved For The " + companyDetails.companyname;
// Function to hide Message after 10 sec
function hideLoadingDiv() {
  setTimeout(function () {
    messageDisplayBox.classList.add('hidden');
  }, 10000)
}
// Create Table 
let headers = ["Company Name", "Owner Name", "Company Website", "Company Contact", "Action"];
let table = document.getElementById("tblData");
let tableHead = document.createElement("thead");
let headerRow = document.createElement("tr");
headerRow.setAttribute("scope", "row")
headers.forEach(headerText => {
  let header = document.createElement("th");
  header.setAttribute("scope", "col")
  let textNode = document.createTextNode(headerText);
  header.appendChild(textNode);
  headerRow.appendChild(header);
  tableHead.appendChild(headerRow);
});
table.appendChild(tableHead);
let tableBody = document.createElement("tbody");
if (companyDetailsFromStorage !== null) {
  companyDetailsFromStorage.forEach(per => {
    let row = document.createElement("tr");
    row.setAttribute("scope", "row")
    Object.values(per).forEach(text => {
      let cell = document.createElement("td");
      cell.setAttribute("scope", "col");
      if (text !== per.companytree) {
        let textNode = document.createTextNode(text);
        cell.appendChild(textNode);
        row.appendChild(cell);
      }
    })
    let cellBtn = document.createElement("td");
    cellBtn.setAttribute("id", "action");
    let showTreeBtn = document.createElement("button");
    showTreeBtn.setAttribute("class", "btn btn-primary showTreeBtn");
    showTreeBtn.innerText = "Show/Edit Tree";
    cellBtn.appendChild(showTreeBtn);
    row.appendChild(cellBtn);
    tableBody.appendChild(row);
    table.appendChild(tableBody);
  });
};
// Show Tree on Show button
let showTreeBtn = document.getElementsByClassName("showTreeBtn");
for (i = 0; i < showTreeBtn.length; i++) {
  showTreeBtn[i].addEventListener("click", function () {
    let selectedRow = this.parentElement.parentElement;
    let backend = document.getElementById("backend");
    backend.innerHTML = "";
    companyDetailsFromStorage.forEach(e => {
      if (selectedRow.firstChild.innerText === e.companyname) {
        let markContainer = document.getElementById("markContainer");
        markContainer.style.display = "flex";
        let companyTree = e.companytree;
        extractTree(companyTree, backend);
        let companyName = document.getElementById("companyName");
        companyName.innerText = e.companyname;

      }
    });
  });
}
function extractTree(arrayTree, html) {
  arrayTree.forEach(elem => {
    // Create Li and append to Ul.
    if (elem.nodeName === "LI") {
      html.innerHTML += `<li class ="createLi" name ="${elem.name}"><span>${elem.value}</span></li>`;
      if (elem.children.length !== 0) {
        elem.children.forEach(element => {
          if (element.nodeName === "UL") {
            let parentLi = document.getElementsByClassName("createLi");
            let lastLi = parentLi[parentLi.length - 1];
            let spanTag = lastLi.firstChild;
            spanTag.classList.add("caret-down");
            lastLi.innerHTML += `<ul class ="createUl nested" name="${element.name}"> </ul>`;
            let parentUl = document.getElementsByClassName("createUl");
            let lastUl = parentUl[parentUl.length - 1];
            if (element.children.length !== 0) {
              extractTree(element.children, lastUl)
            }
            caret();
          }
        });
      }
    }
  });
}

// Edit Click Button on Popup
let editBtn = document.getElementById("editBtn");
editBtn.addEventListener("click", function () {
  // var companyDetails = JSON.parse(localStorage.getItem("companyDetails"));
  var companyDetailsFromStorage = JSON.parse(localStorage.getItem("companyDetailsFromStorage"));
  let companyName = document.getElementById("companyName");
  let array = [];
  companyDetailsFromStorage.forEach(function (el) {
    if (companyName.innerText === el.companyname) {
      el.editable = true;
    }
    array.push(el);
  });
  companyDetailsFromStorage.forEach(function (ele, index) {
    if (companyName.innerText === ele.companyname) {
      companyDetailsFromStorage.splice(index, 1);
      localStorage.setItem("companyDetailsFromStorage", JSON.stringify(companyDetailsFromStorage));
    }
  });
  localStorage.setItem("companyDetailsFromStorage", JSON.stringify(array));
  setTimeout(function () { document.location.href = "index.html"; }, 3000);
});
// caret Toggle Function
function caret() {
  let carets = document.getElementsByClassName("caret-down");
  for (i = 0; i < carets.length; i++) {
    carets[i].addEventListener("click", function () {
      this.classList.toggle('caret');
      parent = this.parentElement;
      parent.querySelector('.nested').classList.toggle('active')
    });
  }
}
// Close Button For Popup
closeDynamic.addEventListener("click", function () {
  markContainer.style.display = "none";  
});
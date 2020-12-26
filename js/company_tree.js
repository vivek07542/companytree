var companyDetailsFromStorage = JSON.parse(localStorage.getItem("companyDetailsFromStorage"));
var companyDetails = JSON.parse(localStorage.getItem("companyDetails"));
// 1. Message Display for 10 sec
let messageDisplayBox = document.getElementById("messageDisplayBox");
let textMessageDisplay = document.getElementById("textMessageDisplay");
textMessageDisplay.innerText = "Your Data Saved For The " + companyDetails.companyname;
// 2. Function to hide Message after 10 sec
function hideLoadingDiv() {
  setTimeout(function () {
    messageDisplayBox.classList.add('hidden');
  }, 10000)
}
// 3. Create Table 
let headers = ["Company Name", "Owner Name", "Company Website", "Company Contact", "Action"];
let table = document.getElementById("tblData");
let tableHead =  createElements(table, "thead", null, null, null,null,null,null); 
let headerRow = createElements(tableHead, "tr", null, null, null,null,null,"row");
headers.forEach(headerText => {
  let header = createElements(headerRow, "th", null, null, null,null,null,"col");
  let textNode = document.createTextNode(headerText);
  header.appendChild(textNode);
});
let tableBody = createElements(table, "tbody", null, null, null,null,null,null);
if (companyDetailsFromStorage !== null) {
  companyDetailsFromStorage.forEach(per => {
    let row = createElements(tableBody, "tr", null, null, null,null,null,"row");
    Object.values(per).forEach(text => {
      if (text !== per.companytree) {
        let cell = createElements(row, "td", null, null, null,null,null,"col");
        let textNode = document.createTextNode(text);
        cell.appendChild(textNode);
      }
    })
    let cellBtn = createElements(row, "td", null, "action", null,null,null,null); 
    let showTreeBtn = createElements(cellBtn, "button", "btn btn-primary showTreeBtn",  null,"Show/Edit Tree",null,null,"col")
  });
};
// 4. Element Create Function
function createElements(parentName, formType, className, idName, childInnerText,childValue,childName,childScope) {
  let childrenName = document.createElement(formType);
  if (className !== null) {
      childrenName.setAttribute("class", className);
  }
  if (idName !== null) {
      childrenName.setAttribute("id", idName);
  }
  if(childScope !== null){
    childrenName.setAttribute("scope",childScope);
  }  
  if(childValue !==null){
    childrenName.value = childValue;
  }
  if (childInnerText !== null) {
      childrenName.innerText = childInnerText;
  }
  if(childName !== null){
    childrenName.setAttribute("name",childName);
  }
  parentName.appendChild(childrenName);
  return childrenName;
}
//5. Show Tree on Click of Show/Edit button
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
// 6.Extract from Array and create HTML Structure
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
            spanTag.setAttribute("onclick","caret()");
            lastLi.innerHTML += `<ul class ="createUl nested" name="${element.name}"> </ul>`;
            let parentUl = document.getElementsByClassName("createUl");
            let lastUl = parentUl[parentUl.length - 1];
            if (element.children.length !== 0) {
              extractTree(element.children, lastUl)
            }
          }
        });
      }
    }
  });
}
//7. caret Toggle Function
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
//8.  Edit Click Button on Popup
let editBtn = document.getElementById("editBtn");
editBtn.addEventListener("click", function () {
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
//9. Close Button For Popup
closeDynamic.addEventListener("click", function () {
  markContainer.style.display = "none";  
});
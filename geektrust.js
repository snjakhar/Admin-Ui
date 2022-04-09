const tableBody = document.querySelector("tbody");
const pagination = document.getElementById("pagination");
const DELETE_SELECTED_BUTTON = document.getElementById("delete-selected");
var data = [];

const selected_itemIds = new Set();
const getData = async () => {
  const url =
    "https://geektrust.s3-ap-southeast-1.amazonaws.com/adminui-problem/members.json";
  try {
    const response = await fetch(url);
    data = await response.json();
    pages(data);
  } catch (error) {
    console.log("Error from fetching data:", error);
  }
};
getData();

const addDataToTable = (data) => {
  tableBody.innerHTML = "";
  const editIcon = "<i class='fas fa-edit'></i>";
  const deleteIcon = "<i class='fas fa-trash'></i>";
  data.map(({ id, name, email, role }, index) => {
    const tr = createHtmlTag("tr", tableBody);
    const td1 = createHtmlTag("td", tr);
    const checkBox = createHtmlTag("input", td1, { type: "checkbox" });
    checkBox.addEventListener("change", (e) => {
      if (e.target.checked) {
        selected_itemIds.add(id);
        tr.style.backgroundColor = "grey";
      } else {
        tr.style.backgroundColor = "";
        selected_itemIds.delete(id);
      }
    });
    const td2 = createHtmlTag("td", tr);
    createHtmlTag("input", td2, {
      type: "text",
      value: name,
      disabled: true,
    });
    const td3 = createHtmlTag("td", tr);
    createHtmlTag("input", td3, {
      type: "text",
      value: email,
      disabled: true,
    });
    const td4 = createHtmlTag("td", tr);
    createHtmlTag("input", td4, {
      type: "text",
      value: role,
      disabled: true,
    });
    const td5 = createHtmlTag("td", tr);
    const editButton = createHtmlTag("button", td5);
    editButton.innerHTML = editIcon;
    const deleteButton = createHtmlTag("button", td5);
    deleteButton.innerHTML = deleteIcon;
    editButton.addEventListener("click", () => {
      tr.style.backgroundColor = "grey";
      handleEditButton(tr);
    });
    deleteButton.addEventListener("click", () => {
      selected_itemIds.add(id);
      deleteRows();
    });
  });
};

const createHtmlTag = (tagName, parent, attributes = {}) => {
  const tag = document.createElement(tagName);
  parent.append(tag);
  for (key in attributes) {
    tag.setAttribute(key, attributes[key]);
  }
  return tag;
};

const handleEditButton = (tr) => {
  tr.children[1].children[0].disabled = false;
  tr.children[2].children[0].disabled = false;
  tr.children[3].children[0].disabled = false;
};

const deleteRows = () => {
  data = data.filter((item) => {
    return !selected_itemIds.has(item.id);
  });
  pages(data);
};
var clearId;
const searchBox = document.getElementById("search-data");
searchBox.addEventListener("input", (e) => {
  
  let serachInput = e.target.value.toLowerCase();
  console.log("here", serachInput);
  if (serachInput === "") {
    return pages(data);
  }
   clearTimeout(clearId)
   clearId=setTimeout(() => { 
    console.log("set timeout")
    let newArr = data.filter(({ name, email, role }) => {
      let [firstName, lastName] = name.split(" ");

      return (
        serachInput===firstName[0].toLowerCase()||
        serachInput === firstName.toLowerCase() ||
        serachInput === lastName.toLowerCase() ||
        serachInput === email.toLowerCase() ||
        serachInput === role.toLowerCase() 
      );
    });
    pages(newArr);
  },1000)

 
});

DELETE_SELECTED_BUTTON.addEventListener("click", () => {
  if (selected_itemIds.size) deleteRows(data);
});

const pages = (data) => {
  pagination.innerHTML = "";
  let length = data.length;
  let size = 10;
  let totalPage = Math.ceil(length / size);
  pageData(0, 10, data);
  let prevButton = createHtmlTag("button", pagination);
  prevButton.innerHTML = "<";
  let currentPage = 0;
  for (var pageNumber = 1; pageNumber <= totalPage; pageNumber++) {
    console.log("for loop -",pageNumber)
    let button = createHtmlTag("button", pagination);
    let start = (pageNumber - 1) * size;
    let end = start + size;
    button.addEventListener("click", () => {
      console.log("Page Number",pageNumber)
      currentPage = pageNumber;
      pageData(start, end, data);
    });

    button.innerHTML = pageNumber;
  }
  prevButton.addEventListener("click", () => {
    console.log(currentPage);
    if (currentPage <= 1) return;
    currentPage = currentPage - 1;

    let start = (currentPage - 1) * size;
    let end = start + size;
    pageData(start, end, data);
  });
  let nextButton = createHtmlTag("button", pagination);
  nextButton.innerHTML = ">";
  nextButton.addEventListener("click", () => {
    if (currentPage >= totalPage) return;

    let start = currentPage * size;
    let end = start + size;
    pageData(start, end, data);
    currentPage = currentPage + 1;
  });
};

function pageData(start, end, data) {
  console.log(start, end);
  let particualrPageData = [];
  for (let j = start; j < end && data[j]; j++) {
    particualrPageData.push(data[j]);
  }
  addDataToTable(particualrPageData);
}

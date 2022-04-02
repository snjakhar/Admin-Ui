const tableBody = document.querySelector("tbody");
const DELETE_SELECTED_BUTTON = document.getElementById("delete-selected");
var data = [];
const selected_itemIds = new Set();

const getData = async () => {
  const url =
    "https://geektrust.s3-ap-southeast-1.amazonaws.com/adminui-problem/members.json";
  try {
    const response = await fetch(url);
    data = await response.json();
    console.log(data);
    page(2);
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
    checkBox.addEventListener("change", () => selected_itemIds.add(id));
    const td2 = createHtmlTag("td", tr);
    createHtmlTag("input", td2, { type: "text", value: name, disabled: true });
    const td3 = createHtmlTag("td", tr);
    createHtmlTag("input", td3, { type: "text", value: email, disabled: true });
    const td4 = createHtmlTag("td", tr);
    createHtmlTag("input", td4, { type: "text", value: role, disabled: true });
    const td5 = createHtmlTag("td", tr);
    const editButton = createHtmlTag("button", td5);
    editButton.innerHTML = editIcon;
    const deleteButton = createHtmlTag("button", td5);
    deleteButton.innerHTML = deleteIcon;
    editButton.addEventListener("click", () => {
      handleEditButton(tr);
    });
    deleteButton.addEventListener("click", () => {
      selected_itemIds.add(id);
      deleteRows(data);
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

const deleteRows = (data) => {
  console.log(selected_itemIds);
  const newData = data.filter((item) => {
    return !selected_itemIds.has(item.id);
  });
  addDataToTable(newData);
};
const searchBox = document.getElementById("search-data");
searchBox.addEventListener("blur", (e) => {
  let serachInput = e.target.value;
  let newArr = data.filter(({ name, email, role }) => {
    return (
      serachInput === name || serachInput === email || serachInput === role
    );
  });
  addDataToTable(newArr);
});

DELETE_SELECTED_BUTTON.addEventListener("click", () => {
  deleteRows(data);
});
function page(pageNum) {
  console.log("herte", data);
  let newArr = [];
  let size = 5;
  let start = (pageNum - 1) * size;
  let end = start + 10;
  for (let i = start; i <= end; i++) {
    newArr.push(data[i]);
  }
  console.log(newArr);
  addDataToTable(newArr);
}
page(1);

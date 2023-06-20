let teachersRow = document.querySelector(".categories-row");
let teacherForm = document.querySelector(".category-form");
let teacherModal = document.querySelector("#categoryModal");
let saveBtn = document.querySelector(".modal-btn");
let addBtn = document.querySelector("#add-btn");
let pagination = document.querySelector(".pagination");
let seeStudent = document.querySelector(".seeStudent");
const searchInput=document.querySelector("#search")
let selected = null;
const limit=6;
let prevBtn=document.querySelector(".prevBtn")
let page=1;
let search="";
function getTeacherCard({
  firstName,
  lastName,
  avatar,
  groups,
  isMarried,
  phoneNumber,
  email,
  id,
}) {
  return `
     <div class="kard">
              <img src="${avatar}" alt="">
              <div class="kardbody">
                <h5>First Name: ${firstName}</h5>
                <h5>Last Name: ${lastName}</h5>
                <h5>Is married:${isMarried}</h5>
                <h5>Phone number:${phoneNumber}</h5>
                <h5>Groups:${groups}</h5>
                <h5>email:${email}</h5>
                <h5>id:${id}</h5>
              </div>
              <div class="bts">
               <button
            class="btn btn-success"
            data-bs-toggle="modal"
            data-bs-target="#categoryModal"
            onClick="editTeacher(${id})"
          >
            Edit
          </button>
          <button class="btn btn-danger"
            onClick="deleteTeacher(${id})"
          >Delete</button>
          <a  class="btn btn-primary seeStudent" href="#?teacher=${id}">See students ${groups}</a>
        </div>
              </div>
            </div>
  `;
}

function getTeacher() {
  teachersRow.innerHTML = "loading......";
  axiosInstance(`teacher?page=${page}&limit=${limit}&firstName=${search}`)
  .then((res) => {
      let teachers=res.data;
      axiosInstance(`teacher?firstName=${search}`).then((res) => {
        let pages;
        pages = Math.ceil(res.data.length / limit);
        if(pages!=1){

          pagination.innerHTML = `
          <li class="page-item "><button class="page-link prevBtn " onClick="prev()">Previous</button></li>
          `;
          for (let i = 1; i <= pages; i++) {
            pagination.innerHTML += `
            <li class="page-item ${
              i == page ? "active" : ""
            }"><button class="page-link" onClick="getPage(${i})">${i}</button></li> `;
          }
  
          pagination.innerHTML += `
             <li class="page-item"><button class="page-link" onClick="next()">Next</button></li>
            `;
        }else{
          pagination.innerHTML="";
        }
          
         
        });

      teachersRow.innerHTML = "";
      teachers.forEach((teacher) => {
        teachersRow.innerHTML += getTeacherCard(teacher);
      });
    })
    .catch((err) => {
      alert(err.response.data);
      teachersRow.innerHTML = "";
    });
}
function getPage(p) {
  page = p;
  getTeacher();
}
function prev(){
  if(page===1){
    prevBtn.classList.add("disabled")
  }
  if(page>1){
    page--;
  }
  getTeacher();
}
function next() {
  
  if (page>0) {
    page++;
  }
  
  getTeacher();
}
getTeacher();
teacherForm.addEventListener("submit", function (e) {
  e.preventDefault();
  console.log(teacherForm.elements);
  let avatar = teacherForm.elements.image.value;
  let firstName = teacherForm.elements.name.value;
  let lastName = teacherForm.elements.lastname.value;
  let groups = teacherForm.elements.groups.value;
  let email = teacherForm.elements.email.value;
  let isMarried = teacherForm.elements.invalidCheck.value;
  let id = teacherForm.elements.id.value;

  if (isMarried.checked) {
    isMarried = true;
  } else {
    isMarried = false;
  }
  let phoneNumber = teacherForm.elements.validationCustomUsername.value;
  let data = {
    avatar,
    firstName,
    lastName,
    groups,
    email,
    isMarried,
    phoneNumber,
    id,
  };
  
  if (selected === null) {
    axiosInstance.post("teacher", data).then((res) => {
      bootstrap.Modal.getInstance(teacherModal).hide();
      getTeacher();
    });
  } else {
    axiosInstance.put(`teacher/${selected}`, data).then((res) => {
      bootstrap.Modal.getInstance(teacherModal).hide();
      getTeacher();
    });
  }
});
async function editTeacher(id) {
  selected = id;
  let teacher = await axiosInstance(`teacher/${id}`);
  console.log(teacher);
  teacherForm.elements.image.value = teacher.data.avatar;
  teacherForm.elements.name.value = teacher.data.firstName;
  teacherForm.elements.lastname.value = teacher.data.lastName;
  teacherForm.elements.groups.value = teacher.data.groups;
  teacherForm.elements.email.value = teacher.data.email;
  teacherForm.elements.invalidCheck.value = teacher.data.isMarried;
  teacherForm.elements.id.value = teacher.data.id;
  teacherForm.elements.validationCustomUsername.value =
    teacher.data.phoneNumber;
  saveBtn.innerHTML = "Save changes";
}
addBtn.addEventListener("click", function () {
  selected = null;
  saveBtn.innerHTML = "Add teacher";
  teacherForm.reset();
});
async function deleteTeacher(id) {
  let check = confirm("do you want delete this card?");
  if (check) {
    await axiosInstance.delete(`teacher/${id}`);
    getTeacher();
  }
}
searchInput.addEventListener("keyup",function(){
  search=this.value;
  getTeacher();
})

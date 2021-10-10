function addItem(event){
    event.preventDefault();
    let text = document.getElementById("toDoInput");
    db.collection("to-do-items").add({
        text: text.value,
        status: "active"
    })
    text.value = "";
}

function getItems (){
    db.collection("to-do-items").onSnapshot((snapshot) => {
        console.log(snapshot);
        let items = []
        snapshot.docs.forEach((doc)=>{
            items.push({
                id: doc.id, 
                ...doc.data()
            })
        })
        generateItems(items);
    })    
}


function generateItems (items){
let itemsHTML = "";
    items.forEach((item)=>{
    itemsHTML += `
   <div class="toDoItem">
    <div class="toDoCheck">
      <div data-id="${item.id}" class="toDoCheckMark ${item.status == "completed" && "checked" ? "checked": ""}">
        <img src="images/icon-check.svg" />
      </div>
     </div>
     <div class="toDoText ${item.status == "completed" && "checked" ? "checked": ""}">
     ${item.text}
     </div>
   </div>
    `
  })
  document.querySelector(".toDoList").innerHTML = itemsHTML;
  createEventListeners()
}

function createEventListeners(){
    let toDoCheckMarks = document.querySelectorAll(".toDoList .toDoCheckMark")
    toDoCheckMarks.forEach((checkMark)=>{
        checkMark.addEventListener("click", function(){
            markCompleted(checkMark.dataset.id);
        })
    })
    
    let clearComplete = document.querySelector(".toDoClear ")
        clearComplete.addEventListener("click", function(){
            deleteEntry(clearComplete.dataset.id);
        })
}

function markCompleted(id){
    let item = db.collection("to-do-items").doc(id);
    item.get().then(function(doc) {
        if (doc.exists) {
            if(doc.data().status == "active"){
                item.update({
                    status: "completed"
                })
            } else {
                item.update({
                    status: "active"
                })
            }
        }
    })
}

function deleteEntry() {
    let clearItem = document.getElementsByClassName(".completed");
    db.collection("to-do-items").doc("id").delete(clearItem).then(() => {
        console.log("Document successfully deleted!");
    }).catch((error) => {
        console.error("Error removing document: ", error);
    });
}

//function deleteEntry(id){
//    let item = db.collection("to-do-items").doc(id);
//        item.get().then(function(doc) {
//            if (doc.exists) {
//                if(doc.data().status == "completed"){
//                       db.collection("to-do-items").doc(id).delete();
//                       console.log(doc.data());
//                }
//            }
//        })
//    }

//document.getElementsByClassName('toDoClear').onclick=function(){
//    deleteEntry();
//}

//const clear = document.querySelectorAll('.toDoclear');

//clear.addEventListener('click', ()=>{
//    const itemCheck = document.querySelectorAll('.')
//})

getItems();
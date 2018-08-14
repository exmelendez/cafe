const cafeList = document.querySelector("#cafe-list");
const form = document.querySelector("#add-cafe-form");

//Create element and render cafe
function renderCafe(doc) {

    let li = document.createElement("li");
    let name = document.createElement("span");
    let city = document.createElement("span");
    let cross = document.createElement("div");

    li.setAttribute("data-id", doc.id);
    name.textContent = doc.data().name;
    city.textContent = doc.data().city;
    cross.textContent = 'x';

    li.appendChild(name);
    li.appendChild(city);
    li.appendChild(cross);

    cafeList.appendChild(li);

    // deleting data
    cross.addEventListener('click', (e) => {
        e.stopPropagation();
        let id = e.target.parentElement.getAttribute('data-id');
        db.collection('cafes').doc(id).delete();
    });
}

/********************
 * The get call is asynchrounous & takes time to get all the data.
 * It returns a promise when means it will execute an action after the data is retrieved.
 * The then is the action executed after it runs
 * 
 * Good for static info but must be refreshed when changes are made. Disabled, as real-time listener below is being used
 * 
 */
// db.collection("cafes").get().then((snapshot) => {
//     snapshot.docs.forEach(doc => {
//         renderCafe(doc);
//     })
// });

// saving data
form.addEventListener('submit', (e) => {
    e.preventDefault();
    db.collection('cafes').add({
        name: form.name.value,
        city: form.city.value
    });
    form.name.value = "";
    form.city.value = "";
});

//real-time listener
db.collection("cafes").orderBy("city").onSnapshot(snapshot => {
    let changes = snapshot.docChanges();
    changes.forEach(change => {
        if(change.type == "added") {
            renderCafe(change.doc);
        } else if (change.type == "removed") {
            let li = cafeList.querySelector("[data-id=" + change.doc.id + ']');
            cafeList.removeChild(li);
        }
    })
});

// updating records (console demo)
// db.collection('cafes').doc('DOgwUvtEQbjZohQNIeMr').update({
//     name: 'mario world'
// });

// db.collection('cafes').doc('DOgwUvtEQbjZohQNIeMr').update({
//     city: 'hong kong'
// });

// setting data
// db.collection('cafes').doc('DOgwUvtEQbjZohQNIeMr').set({
//     city: 'hong kong'
// });
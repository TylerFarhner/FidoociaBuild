// Your web app's Firebase configuration
var firebaseConfig = {
    apiKey: "AIzaSyBd-PnyS7vvBX1eP5pdRh7aObdYUBycrOw",
    authDomain: "fidoocia-e9f07.firebaseapp.com",
    databaseURL: "https://fidoocia-e9f07-default-rtdb.firebaseio.com",
    projectId: "fidoocia-e9f07",
    storageBucket: "fidoocia-e9f07.appspot.com",
    messagingSenderId: "478797659819",
    appId: "1:478797659819:web:89aaf536efd167967641ee",
};
// Initialize Firebase
firebase.initializeApp(firebaseConfig);

let app;

let name, date, age = "";


if (firebase.apps.length === 0) {
    app = firebase.initializeApp(firebaseConfig);
} else {
    app = firebase.app();
}

const getAge = (dateString) => {
    var today = new Date();
    var birthDate = new Date(dateString);
    var calculateAge = today.getFullYear() - birthDate.getFullYear();
    var m = today.getMonth() - birthDate.getMonth();
    if (m < 0 || (m === 0 && today.getDate() < birthDate.getDate())) {
        calculateAge--;
    }
    console.log(calculateAge);
}

getAge("1997-12-12");

const submitUser = () => {
    name = $("#name").val();
    age = $("#age").val();
    date = $("#date").val();
    let user = {
        "name": name,
        "age": age,
        "date": date,
        "isNameValid": false,
        "isAgeValid": false,
        "checkedName": false,
        "checkedAge": false,
        "nameListener": false,
        "ageListener": false
    }

    let datesRef = firebase.database().ref("users").child("Sarah").child("dates").push();
    firebase.database().ref("users").child("Sarah").child("notifications").push();
    datesRef.set(user);
    alert(JSON.stringify(user));
}

const submitReport = () => {
    uid = $("#name").val();
    did = $("#age").val();
    report = $("#report").val();

    console.log(uid, did);
    console.log(report);

    firebase.database().ref("users")
        .child(`${uid}/dates/${did}/detailedReport/`).update({
            report: report
        });
}



const listUsers = () => {

    firebase.database().ref("users").child("Sarah").child("dates").on("child_added", ss => {
        let dates = ss.val();
        $("#data").append(
            `<div id=${ss.key}>${dates.name} ${dates.date}</div>`);
    });

}

const userListener = () => {
    firebase.database().ref("users").child("Sarah").child("dates").on('child_changed', (ss) => {
        $(`#${ss.key}`).replaceWith(`<div id=${ss.key}>${ss.val().name} ${ss.val().date}</div>`);
        console.log('user was changed !!', ss.val());
    });
}

const deleteUser = () => {
    remove()
}

const timedMessage = () => {
    console.log();
}

const uploadImage = (input) => {
    const file = input.target.files[0];
    const storageRef = firebase.storage();
    const fileRef = storageRef.child(file.name);
    fileRef.put(file).then(() => {
        console.log("Uploaded file", file.name);
    })
}

const setUp = () => {
    let notifRef = firebase.database().ref("users").child("Sarah").child("notifications").push();
    notifRef.set("user");
    let personalRef = firebase.database().ref("users").child("Sarah").child("personalInfo").set(setUpUser());
}

const setUpUser = () => {
    let name = "Sarah Robinson"
    let email = "srob@gmail.com"
    let dob = "1996-11-06"
    let user = {
        "name": name,
        "email": email,
        "dob": dob
    }
    return user;
}

const validateListener = () => {
    firebase.database().ref("users").child("Sarah").child("dates").on('child_changed', (ss) => {
        if (ss.val().checkedAge == true) {
            let notifRef = firebase.database().ref("users").child("Sarah").child("notifications").push();
            console.log(ss.val().isAgeValid == true);
            if (ss.val().isAgeValid == true && ss.val().ageListener == false) {
                firebase.database().ref("users").child("Sarah").child("dates").child(`${ss.key}`).update({
                    ageListener: true
                });
                console.log('Here');
                notifRef.set({
                    "_id": "",
                    "createdAt": "",
                    "text": `${ss.val().name} age has been verified`,
                    "user": {
                        "_id": "name",
                        "name": "name"
                    }
                });
            } else if (ss.val().isAgeValid == false && ss.val().ageListener == false) {
                firebase.database().ref("users").child("Sarah").child("dates").child(`${ss.key}`).update({
                    ageListener: true
                });
                notifRef.set({
                    "_id": "",
                    "createdAt": "",
                    "text": `${ss.val().name} age could not be verified`,
                    "user": {
                        "_id": "name",
                        "name": "name"
                    }
                });
            }
        }
        if (ss.val().checkedName == true) {
            let notifRef = firebase.database().ref("users").child("Sarah").child("notifications").push();
            if (ss.val().isNameValid == true) {
                notifRef.set(`${ss.val().name}'s name has been verified`);
            } else {
                notifRef.set(`${ss.val().name}'s name could not be verified`);
            }
        }
        console.log('Notification sent', ss.val());
    });
    console.log('Hi');
}

// setUp();
// listUsers();
// userListener();
// validateListener();
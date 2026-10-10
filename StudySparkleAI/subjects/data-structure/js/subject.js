function showInfo(subject) {

    var title =
        document.getElementById("infoTitle");

    var text =
        document.getElementById("infoText");

    var box =
        document.getElementById("infoBox");


    title.innerHTML = subject;


    var information = {

        "Data Structure":
            "Data Structure helps us organize and manage data efficiently.",

        "DBMS":
            "DBMS is used to store, manage and retrieve data from databases.",

        "C Programming":
            "C Programming helps in learning programming logic and problem solving.",

        "Java Programming":
            "Java is an object-oriented programming language used to build applications.",

        "Python Programming":
            "Python is an easy and powerful programming language used in many fields.",

        "Web Technology":
            "Web Technology helps us create websites and web applications.",

        "Operating System":
            "Operating System manages computer hardware, software and system resources.",

        "Cyber Security":
            "Cyber Security focuses on protecting computers, networks and data.",

        "Cloud Computing":
            "Cloud Computing provides computing resources and services over the internet.",

        "Artificial Intelligence":
            "AI allows machines to perform tasks that normally require human intelligence.",

        "Big Data":
            "Big Data deals with very large amounts of data and technologies used to process it.",

        "Digital Marketing":
            "Digital Marketing uses online platforms to promote products and services.",

        "Software Engineering":
            "Software Engineering focuses on systematic development, testing and maintenance of software."

    };


    text.innerHTML =
        information[subject];


    box.style.display = "flex";
}


function closeInfo() {

    document.getElementById(
        "infoBox"
    ).style.display = "none";

}


window.onclick = function(event) {

    var box =
        document.getElementById("infoBox");

    if (event.target === box) {

        closeInfo();

    }

};
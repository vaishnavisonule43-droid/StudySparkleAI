body {
    margin: 0;
    font-family: Arial, sans-serif;
    background: #f4f8fc;
    color: #333;
}


.notes-container {
    width: 90%;
    max-width: 1000px;
    margin: 40px auto;
}


.notes-container > h1 {
    text-align: center;
    color: #1976d2;
    font-size: 36px;
    margin-bottom: 30px;
}


.notes-card {
    background: white;
    padding: 35px;
    border-radius: 15px;
    box-shadow: 0 4px 15px rgba(0, 0, 0, 0.12);
}


.notes-card h2 {
    color: #1976d2;
    margin-top: 30px;
}


.notes-card h3 {
    color: #444;
    margin-top: 22px;
}


.notes-card p,
.notes-card li {
    font-size: 17px;
    line-height: 1.7;
}


.notes-card li {
    margin-bottom: 8px;
}


/* EXAMPLE */

.example-box {
    background: #eef6ff;

    padding: 18px;

    border-left: 5px solid #1976d2;

    border-radius: 8px;

    margin: 15px 0;

    font-size: 17px;
}


/* TABLE */

table {
    width: 100%;

    border-collapse: collapse;

    margin: 20px 0;
}


th,
td {
    border: 1px solid #ccc;

    padding: 12px;

    text-align: center;
}


th {
    background: #1976d2;

    color: white;
}


/* BACK BUTTON */

.notes-container > button {
    display: block;

    margin: 30px auto;

    padding: 12px 25px;

    background: #1976d2;

    color: white;

    border: none;

    border-radius: 8px;

    font-size: 16px;

    cursor: pointer;
}


.notes-container > button:hover {
    background: #0d47a1;
}


/* ANIMATION */

.priority-animation {
    margin-top: 40px;

    padding: 25px;

    background: #f4f8fc;

    border-radius: 15px;

    text-align: center;
}


.priority-animation h3 {
    color: #1976d2;
}


.priority-visual {
    min-height: 180px;

    margin: 30px auto;

    padding: 25px;

    background: white;

    border: 3px solid #1976d2;

    border-radius: 15px;

    display: flex;

    justify-content: center;

    align-items: center;

    gap: 15px;

    flex-wrap: wrap;
}


/* PRIORITY ITEM */

.priority-item {
    min-width: 100px;

    padding: 15px;

    background: #1976d2;

    color: white;

    border-radius: 10px;

    font-weight: bold;

    animation: appear 0.5s ease;
}


.priority-item span {
    display: block;

    font-size: 13px;

    margin-top: 5px;
}


/* CONTROLS */

.priority-controls {
    display: flex;

    justify-content: center;

    align-items: center;

    flex-wrap: wrap;

    gap: 10px;
}


.priority-controls input {
    width: 130px;

    padding: 10px;

    border: 1px solid #aaa;

    border-radius: 7px;

    font-size: 15px;
}


.priority-controls button {
    padding: 10px 15px;

    background: #1976d2;

    color: white;

    border: none;

    border-radius: 7px;

    cursor: pointer;
}


.priority-controls button:hover {
    background: #0d47a1;

    transform: translateY(-2px);
}


.priority-message {
    color: #1976d2;

    font-weight: bold;
}


/* ANIMATION */

@keyframes appear {

    from {
        opacity: 0;

        transform: scale(0.5);
    }

    to {
        opacity: 1;

        transform: scale(1);
    }

}


/* MOBILE */

@media (max-width: 700px) {

    .notes-container {
        width: 92%;
    }

    .notes-card {
        padding: 20px;
    }

    .notes-card p,
    .notes-card li {
        font-size: 15px;
    }

}
import express from "express";
import bodyParser from "body-parser";
import { day, month } from "./date.js";

const app = express();
const port = 3000;

let todayTask = [];
let workTask = [];

app.use(express.static("public"))
app.use(bodyParser.urlencoded({ extended: true }));

app.get("/", (req, res) => {
    res.render("index.ejs", {
        day: day,
        month: month,
        todayTask: todayTask,
    });
});

app.get("/work", (req, res) => {
    res.render("work.ejs", {
        workTask: workTask,
    });
});

app.post("/", (req, res) => {
    todayTask.push(req.body["new-task"]);
    res.render("index.ejs", {
        day: day,
        month: month,
        todayTask: todayTask,
    });
})

app.post("/work", (req, res) => {
    workTask.push(req.body["new-task"]);
    res.render("work.ejs", {
        workTask: workTask,
    });
});


app.listen(port, () => {
    console.log(`Listening on port ${port}`);
});
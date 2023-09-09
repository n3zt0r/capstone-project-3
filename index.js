import express from "express";
import bodyParser from "body-parser";
import mongoose from "mongoose";
import _ from "lodash";

mongoose.connect(`mongodb+srv://admin-nestor:Daniela071011@cluster0.2qbqxoi.mongodb.net/?retryWrites=true&w=majority`);

const { Schema, model } = mongoose;
const app = express();
const port = process.env.PORT || 3000;

// -- Tasks schemas
const taskSchema = new Schema({ task: String });
const Task = model("Task", taskSchema);

// -- Default tasks
const task1 = new Task({ task: "Welcome to your todolis!" });
const task2 = new Task({ task: "Push the + button to add a new task." });
const task3 = new Task({ task: "<-- Hit this for delete a task." });

// -- Custom list tasks
const customeTaskSchema = new Schema({
    name: String,
    list: [taskSchema]
});
const Custome = model("Custome", customeTaskSchema);

app.use(express.static("public"));
app.use(bodyParser.urlencoded({ extended: true }));

app.get("/", async (req, res) => {
    let todayTask = await Task.find();

    if (todayTask.length === 0) {
        await Task.insertMany([task1, task2, task3]);
        todayTask = await Task.find();
    };

    res.render("index.ejs", { 
        title: "hoy",
        todayTask: todayTask
    });
});

app.get("/:customeListName", async (req, res) => {
    const customeListName = _.lowerCase(req.params.customeListName);
    const customeList = await Custome.findOne({ name: customeListName });

    if (!customeList) {
        const customeTask = new Custome({
            name: customeListName,
            list: [task1, task2, task3]
        });
        await customeTask.save();

        res.redirect(`/${customeListName}`)
    } else {
        if (customeList.list.length === 0) {
            customeList.list.push(task1, task2, task3);
            await customeList.save();
        }
        const { name, list } = customeList;

        res.render("index.ejs", {
            title: name,
            todayTask: list
        });
    };
});

app.post("/", async (req, res) => {
    const { body: { newTask, list } } = req;
    const newTodaytask = new Task({ task: newTask });

    if (list === "hoy") {
        await Task.insertMany([newTodaytask]);
        res.redirect("/");
    } else {
        const customeList = await Custome.findOne({ name: list });
        customeList["list"].push(newTodaytask);

        await customeList.save();
        res.redirect(`/${list}`);     
    }
});

app.post("/delete", async (req, res) =>{
    const { body: { checkbox, listName } } = req;

    if (listName === "hoy") {
        await Task.deleteOne({ _id: checkbox });
    
        res.redirect("/");
    } else {
        await Custome.findOneAndUpdate({ name: listName }, { $pull: { list: { _id: checkbox } } });

        res.redirect(`/${listName}`);
    }
});


app.listen(port, () => {
    console.log(`Listening on port ${port}`);
});
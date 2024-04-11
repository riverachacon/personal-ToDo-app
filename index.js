import express from "express";
import bodyParser from "body-parser";
import pg from "pg"

const app = express();
const port = 3000;

const db = new pg.Client({
  user: "postgres",
  host: "localhost",
  database: "todo",
  password: "holi987",
  port: 5432,
});
db.connect();



app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static("public"));


let currentItemId = 1
let items = [
  { id: 1, title: "Buy milk" },
  { id: 2, title: "Finish homework" },
];

async function getCurrentItem(){
  const data = await db.query("SELECT * FROM items")
  items = data.rows

  return items.find((x) => x.id == currentItemId)
}

app.get("/", async (req, res) => {
  let data = await getCurrentItem()


  // console.log("/ DATA: ", data)
  res.render("index.ejs", {
    listTitle: "Today",
    listItems: items,
  });
});

app.post("/add", (req, res) => {
  const newItem = req.body.newItem;

  try {
    db.query("INSERT INTO items (title) VALUES ($1)", [newItem])
    
    res.redirect("/");
  } catch (err) {
    console.log("INSERT item ERROR:", err)
    
  }

});

app.post("/edit", (req, res) => {
  let editTitleId = req.body.updatedItemId
  let newTitle = req.body.updatedItemTitle

  try {
    db.query("UPDATE items SET title = $1 WHERE id = $2", [newTitle, editTitleId])
    
    res.redirect("/")
  } catch (err) {
    console.log("UPDATE item ERROR:", err)
    
  }

  // console.log("/ EDIT id: ", editItem)
  // console.log("/ EDIT title: ", newItem)
});

app.post("/delete", (req, res) => {
  let deleteTitleID = req.body.deleteItemId

  try {
    db.query("DELETE FROM items WHERE id = $1", [deleteTitleID])

    res.redirect("/")
    
  } catch (err) {
    console.log("DELETE item ERROR:", err)
    
  }

  // console.log(deleteTitle)
});





app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});



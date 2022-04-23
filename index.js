const express = require("express")
const app = express()
const cors = require("cors")
require("dotenv").config()
const { MongoClient, ServerApiVersion, ObjectId } = require("mongodb")
const port = 5000

app.use(express.json())
app.use(cors())

const uri = `mongodb+srv://${process.env.USER}:${process.env.PASS}@cluster0.9iutd.mongodb.net/myFirstDatabase?retryWrites=true&w=majority`
const client = new MongoClient(uri, {
	useNewUrlParser: true,
	useUnifiedTopology: true,
	serverApi: ServerApiVersion.v1,
})
const run = async () => {
	await client.connect()
	const manageDatabase = client.db("Rk-network").collection("package")
	try {
		app.post("/package", async (req, res) => {
			const packageDoc = req.body
			console.log(req.body)
			const result = await manageDatabase.insertOne(packageDoc)
			res.send(result)
		})
		app.put("/package-update/:id", async (req, res) => {
			const { id } = req.params
			const data = req.body
			const query = { _id: ObjectId(id) }
			const options = { upsert: true }
			const updateDoc = {
				$set: {
					...data,
				},
			}
			const result = await manageDatabase.updateOne(
				query,
				updateDoc,
				options
			)
			res.send(result)
		})
		app.get("/packages", async (req, res) => {
			const query = {}
			const cursor = manageDatabase.find(query)
			const result = await cursor.toArray()
			res.send(result)
		})

		app.delete("/package-del/:id", async (req, res) => {
			const { id } = req.params
			const query = { _id: ObjectId(id) }
			const result = await manageDatabase.deleteOne(query)
			res.send(result)
		})
	} finally {
		console.log("done")
	}
}

run().catch(console.dir)

app.listen(process.env.PORT || port, () =>
	console.log("listening to port" + port)
)

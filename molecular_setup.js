const request = require("request");
require('dotenv').config()
const { ServiceBroker } = require("moleculer");
const broker = new ServiceBroker();
const { MongoClient, ObjectId } = require("mongodb");
const uri = process.env.MONGO_URI;

let db;
MongoClient.connect(uri, { useNewUrlParser: true }, (err, client) => {
    if (err) return console.log(err);

    // Storing a reference to the database so you can use it later
    db = client.db("webhooks");
    console.log(`Connected MongoDB: ${uri}`);
    console.log(`Database: ${"webhooks"}`);
});

broker.createService({
    name: "webhooks",
    actions: {
        async list(ctx) {
            const res = await db.collection("url").find({}).toArray();
            return res;
        },
        async register(ctx) {
            var myobj = { targetURL: ctx.params.targetURL };
            const res = await db.collection("url").insertOne(myobj);

            return res.insertedId.toString();
        },
        async trigger(ctx) {
            let resp = [];
            try {
                const res = await db
                    .collection("url")
                    .find({}, { targetURL: 1 })
                    .toArray();
                let prom = [];
                for (let url of res) {
                    prom.push(
                        new Promise((resolve, reject) => {
                            request.post(
                                { url: url.targetURL },
                                async (error, response, body) => {
                                    if (error) {
                                        for (var i = 0; i < 4; i++) {
                                            try {
                                                request.post(
                                                    { url: url.targetURL },
                                                    (error, response, body) => {
                                                        if (error) {
                                                            resp.push(
                                                                error.message,
                                                            );
                                                        } else {
                                                            resp.push(
                                                                response.statusCode +
                                                                    " " +
                                                                    url.targetURL,
                                                            );
                                                            resolve(true);
                                                        }
                                                    },
                                                );

                                                resolve(true);
                                            } catch (e) {
                                                resp.push(e.message);
                                            }
                                        }

                                        resp.push(error.message);
                                        resolve(true);
                                    } else {
                                        resp.push(
                                            response.statusCode +
                                                " " +
                                                url.targetURL,
                                        );
                                        resolve(true);
                                    }
                                },
                            );
                        }),
                    );
                }
                await Promise.all(prom);
                return resp;
            } catch (e) {
                throw new Error(e.message);
            }
        },
        async update(ctx) {
            try {
                const res = await db.collection("url").findOneAndUpdate(
                    {
                        _id: ObjectId(ctx.params.id),
                    },
                    { $set: { targetURL: ctx.params.newTargetUrl } },
                );
                if (!res.lastErrorObject.updatedExisting)
                    throw new Error("Webhook not found");
            } catch (e) {
                throw new Error(e.message);
            }
        },
        async delete(ctx) {
            try {
                const res = await db.collection("url").deleteOne({
                    _id: ObjectId(ctx.params.id),
                });
            } catch (e) {
                throw new Error(e.message);
            }
        },
    },
});
module.exports = { broker };

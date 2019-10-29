const express = require('express');
const bodyParser = require('body-parser');
const graphqlHttp = require('express-graphql');
const { buildSchema } = require('graphql');
const mongoose = require('mongoose');
const Transaction = require('C:/AllThingsReact/moronicaccountant/src/models/transaction.js');

const app = express();

app.use(bodyParser.json());

app.use((req, res, next) => {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'POST,GET,OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
    if (req.method === 'OPTIONS') {
      return res.sendStatus(200);
    }
    next();
  });
  

app.use('/graphqlApi', graphqlHttp({
    schema: buildSchema(`
        type Transaction {
            _id : ID!
            amount : Float!
            location : String!
            timestamp : String!
            balance : Float!
            transactionType : String!
        }

        input TransactionInput {
            
            amount : Float!
            location : String!
            timestamp : String!
            balance : Float!
            transactionType : String!
        }

        type RootQuery {
            queryA: [Transaction!]!
        }

        type RootMutation{
            mutationA(transactionInput: TransactionInput): Transaction
        }

        schema {
            query: RootQuery
            mutation:RootMutation
        }
    `),
    rootValue: {
        queryA: () => {
           // return ['Purchase A', 'Purchase B', 'Credit A'];
           return Transaction.find().then(transactions => 
            { return transactions.map
                (t => {
                    return {...t._doc, _id: t.id};
                });
        }).catch(err => {throw err;}); 
        },
        mutationA: (args) => {
            const t = new Transaction({
                location : args.transactionInput.location,
                amount : +args.transactionInput.amount,
                balance : args.transactionInput.balance,
                timestamp : new Date(args.transactionInput.timestamp),
                transactionType : args.transactionInput.transactionType,
            });
            return t.save().then(result => {
                console.log(result);
                return { ...result._doc, _id: result._doc._id.toString()};
            })
            .catch (err => {
                console.log(err);
                throw err;
            });

            // const purchaseName = args.name;
            // return purchaseName + ":301";
        }

    },
    graphiql: true
}));

mongoose.connect(
    // `mongodb+srv://${process.env.MongoUser}
    // :${process.env.MongoPassword}@cluster0-9o1kv.mongodb.net/${process.env.MongoDatabase}?retryWrites=true&w=majority`,
    
    "mongodb+srv://Simyan:OCm3m1jyMySJaKiX@cluster0-9o1kv.mongodb.net/MoronicAccountantDB?retryWrites=true&w=majority",  
    { useNewUrlParser: true }
).then(
    () => {
        app.listen(3000);
    })
    .catch(
        err =>{console.log("lala " + err);
        });

// app.get('/', (req, res, next) =>{
//     res.send('Hey there!');
// })

// app.listen(3100);

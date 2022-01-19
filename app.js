const express = require('express')
const app = express()
const mongoose = require('mongoose');

const FormModel = require('./FormModel');

const port = 3000
app.use(express.json()); // middleware
app.use(express.urlencoded({extended: true})); // middleware

const mongoURI = 'mongodb+srv://aniket:1q2w3e4r5t@cluster0.2dal9.mongodb.net/bck?retryWrites=true&w=majority';

mongoose.connect(mongoURI, {
  useNewUrlParser: true,
  useUnifiedTopology: true
}).then((res) => {
   //console.log(res);
   
  console.log('Connected to  congo database');
})



app.get('/', (req, res) => {
  res.send('Hello World!')
})
app.get('/my', (req, res) => {
    res.send({
        name:"aniket",
        love:"anu"
    })
  })
  app.get('/mys', (req, res) => {
    res.send({
        
        love:"i love you anu priya mehta "
    })
  })
  app.get('/personal', (req,res) =>{
    res.send({
      names:"aniket ",
      aniket:"jkjkjkj"
        
    })
  })
  app.get('/myapi', (req, res) => {

    res.send(`
        <html>
            <head> </head>
            <body>
                <p> My form </p>
                <form action="/submit_form" method="POST"> 
                    <label for="name">Name</label>
                    <input type="text" name="name" required></input>
                    <label for="phone">Phone</label>
                    <input type="text" name="phone" required></input>
                    <label for="email">Email</label>
                    <input type="text" name="email"></input>
                    <label for="grade">Grade</label>
                    <input type="text" name="grade" required></input>
                    <button type="submit">Submit</button>
                </form>
            <body>
        <html>
    `)
})

app.post('/submit_form', async (req, res) => {
    console.log(req.body);
    const { grade, name, phone, email } = req.body;

    if(!grade || !name || !phone) {
        return res.send({
            status: 400,
            message: "Missing data",
            data: req.body
        })
    }

    if(phone.length > 10)  {
        return res.send({
            status: 400,
            message: "Invalid Phone Number",
            data: req.body 
        })
    }

    if(grade.length > 1) {
        return res.send({
            status: 400,
            message: "Invalid Grade",
            data: req.body
        })
    }

    // Write into DB
    let formData = new FormModel({
        name: name,
        grade: grade,
        phone: phone
    })

    if(email)
        formData.email = email;

    try {
    
        let formDb = await formData.save();

        console.log(formDb);

        res.send({
            status: 200,
            message: "Form Submmitted Successfully",
            pata: formDb
        });
    }
    catch(err) {
        res.send({
            status: 400,
            message: "Database error",
            error: err
        })
    }
})
app.get('/read_forms', async (req, res) => {

    // FormModel.find().then((data) => {
    //     res.send({
    //         status: 200,
    //         message: "Read data successfully",
    //         data: data
    //     })
    // }).catch(err => {
    //     res.send({
    //         status: 400,
    //         message: "Database error",
    //         error: err
    //     })
    // });    

    try {
        const formData = await FormModel.find();

        res.send({
            status: 200,
            message: "Read data successfully",
            data: formData
        })
    }
    catch(err) {
        res.send({
            status: 400,
            message: "Database error. Please try again",
            error: err
        })
    }
})


app.post('/search_forms', async (req, res) => {

    let searchBody = req.body; 

    if(Object.keys(searchBody).length == 0) {
        return res.send({
            status: 401,
            message: "Missing parameters"
        })
    }
    
    try {

        let formData = await FormModel.find(searchBody);

        return res.send({
            status: 200,
            message: "Search Successful",
            data: formData
        })

    }
    catch(err) {
        return res.send({
            status: 400,
            message: "Database error. Please try again",
            error: err
        })
    }
})
app.post('/delete', async (req,res) => {
    let id = req.body.id;

    try {
        let formDb = await FormModel.findOneAndDelete({_id: id}); 

        return res.send({
            status: 200,
            message: "Deleted Successfully",
            data: formDb
        })

    }
    catch(err) {
        return res.send({
            status: 400,
            message: "Delete Unsuccessful",
            error: err
        })
    }
}
)

app.post('/update_form', async (req, res) => {

    let id = req.body.id;
    let newData = req.body.newData;

    try {

        let oldData = await FormModel.findOneAndUpdate({_id: id}, newData);

        res.send({
            status: 200,
            message: "Updated data successfully",
            data: oldData
        })
    }
    catch(err) {
        res.send({
            status: 400,
            message: "Database Error",
            error: err
        })
    }

})

app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`)
})
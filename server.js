// Import required modules / packeges
const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const db = require('mongoose');
const XLSX = require('xlsx');
const ExcelJS = require('exceljs');
const fs = require('fs');
const http = require('http');
const workbook = require('excel4node/distribution/lib/workbook');
const path = require('path');
const cron = require('node-cron');




// Configure middleware
app.use(express.static(path.join(__dirname, 'pages')));
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json())


// Connect to MongoDb
db.connect('mongodb+srv://ranan97531:2524097531R@cluster0.rhkco4m.mongodb.net/mosheFruits')
    .then(() => console.log('db on'))


// Define database schemas and models
const userSchema = db.Schema({
    userFamayl:String,
    userName: String,
    userEmail: String,
    userFone: String

})


const listProduct = db.Schema({
    class: String,
    productName: String,
    productPrice: Number,
    productImg: String,
    amount: Number,
    type: Boolean,
    index: Number
})


const ordersPending = db.Schema({
    userName: String,
    userFon: String,
    arrProducts: Array,
    totulPrice:Number
})

const manger = db.Schema({
    title:String,
    terms:String,
    openSale:Boolean,
    orderConstant:Array
})

const collectionUser = db.model('user', userSchema);
const collectionProduct = db.model('product', listProduct);
const collectionPending = db.model('pending', ordersPending);
const collectionMenger = db.model('menger',manger)


// Define an array to hold the list of products.


// Define a function to add products to the database
const addProduct = async (arr) => {
    await collectionProduct.insertMany(arr)
}

// addProduct(productsListArr)

// Middleware function to check if the user is an admin
const isAdmin = (req, res, next) => {
    const boolean = req.query.admin == 'true';
    console.log('isAdmin middleware:', { query: req.query, boolean });
    if (boolean) {
        return next();
    } else {
        return res.status(400).send('error');
    }
};


// Define routes for various pages
app.get('/products', (req, res) => {
    res.sendFile(__dirname + '/pages/third.html')
})

app.get('/signup', (req, res) => {
    res.sendFile(__dirname + '/pages/second.html')
})

app.get('/buy', (req, res) => {
    res.sendFile(__dirname + '/pages/fourth.html')
})

app.get('/admin', isAdmin, (req, res) => {
    res.sendFile(path.join(__dirname,  'pages', 'admin.html'));
})


app.get('/All', (req, res) => {
    res.sendFile(__dirname + '/pages/fifth.html')
})

app.get('/productManagement', (req, res) => {
    res.sendFile(__dirname + '/pages/productManagement.html')
})

app.get('/appendProduct', (req, res) => {
    res.sendFile(__dirname + '/pages/appendProduct.html')
})

app.get('/scool', (req, res) => {
    res.sendFile(__dirname + '/pages/pageScool.html')
})

app.get('/summary',(req,res)=>{
    res.sendFile(__dirname + '/pages/summaryPage.html')
})

app.get('/termsP', async (req,res)=>{
    let man = await collectionMenger.findOne()
    res.json(man.terms)
})


app.get('/Terms',(req,res)=>{
    res.sendFile(__dirname+'/pages/pageTerms.html')
})

// Route to add a new user to the database
app.post('/addUser', (req, res) => {
    let temp = {
        userFamayl:req.body.famayl,
        userName: req.body.nameUser,
        userEmail: req.body.emailUser,
        userFone: req.body.foneUser
    }

    // Check if the email already exists in the database
    // before inserting new user
    const checkEmail = async () => {
        let result = await collectionUser.findOne({ userFone: temp.userFone });
        if (result == null) {
            collectionUser.insertMany(temp)
            res.send({ result: true, name: `${temp.userFamayl} ${temp.userName}` , fon: temp.userFone })
        }
        else {
            res.send({ result: false })
        }
    }

    checkEmail()



})


// Route to check if a user is valid
app.post('/check', (req, res) => {
    let checkEmail = req.body.emailUser;
    let checkFone = req.body.foneUser;
    const checkValidUser = async () => {
        let result = await collectionUser.findOne({ userEmail: checkEmail, userFone: checkFone })
        if (result != null) {
            res.send({ result: true, name: `${result.userFamayl} ${result.userName}` , fon: result.userFone })
        }
        else {
            res.send({ result: false })
        }
    }

    checkValidUser()


})


// This request send back all the products that exist in the database

app.get('/getAllProducts', (req, res) => {
    const returnProductList = async () => {
        let arr = await collectionProduct.find()
        res.send({ arrp: arr })
    }

    returnProductList()
})

app.get('/getProducts', (req, res) => {
    const returnProductList = async () => {
        let arr = await collectionProduct.find()
        res.send({ arrp: arr })
    }

    returnProductList()
})

// Takes the order's name and the products and enters
// it into the orders Collection
app.post('/approve123', (req, res) => {
    let temp = {
        userName: req.body.userName,
        userFon: req.body.userFon,
        arrProducts: req.body.arrProducts,
        totulPrice:req.body.totulPrice
    }
    temp.arrProducts.forEach(async (val) => {
        let pro = await collectionProduct.findOne({ productName: val.productName })
        if (pro.type == false) {
            let num = pro.amount
            --num
            await collectionProduct.findOneAndUpdate(
                { productName: val.productName },
                { $set: { amount: num } }
            );
        }
    })
    const addOrder = async () => {
        await collectionPending.insertMany(temp)
        res.send({ result: true })
    }

    addOrder()
})

// Returns an array of all orders
app.get('/Order', (req, res) => {
    const order = async () => {
        let ArrOrders = await collectionPending.find()
        res.send({ result: ArrOrders })
    }
    order()
})

// delte order
app.delete('/deletOrder', (req, res) => {
    const delete1 = async () => {
        await collectionPending.findOneAndDelete({ userName: req.body.userName, arrProducts: req.body.arrProducts })
        res.json('the order delte')
    }

    delete1()

})

// delete product
app.delete('/deletProduct', (req, res) => {
    const delete2 = async () => {
        let price = req.body.productPrice
        let name = req.body.productName
        let class2 = req.body.class1
        let scool2 = req.body.scool
        await collectionProduct.findOneAndDelete({class:class2, productName: name, productPrice: price ,scool:scool2 })
        res.json('הספר נמחק בהצלחה')
    }

    delete2()

    })

// Append a new product
app.post('/productNew', async (req, res) => {
    let type = ''
    let amount = ''
    let index = await collectionProduct.find({ class: req.body.class, scool: req.body.scool })
    index = index.length + 1
    try {

        if (req.body.newA == 'false') {
            type = false
            amount = req.body.num
        }
        else {
            amount = 0
            type = true
        }
    } catch {
        amount = 0
        type = true
    }

    let temp = {
        class: req.body.class,
        productName: req.body.name,
        productPrice: req.body.price,
        productImg: req.body.img,
        amount: amount,
        type: type,
        scool: req.body.scool,
        index

    }

    const appendP = async () => {
        await collectionProduct.insertMany(temp)
        res.send(`<script>alert('The product is added');location.href = "/appendProduct"</script>`)
    }

    appendP()
})
// update the product
app.post('/update', (req, res) => {
    let name1 = req.body.productName;
    let price = req.body.productPrice;
    let changeValue = req.body.changeValue;
    let update = req.body.updateInpt;
    const updateProduct = async () => {
        if (changeValue == 'name') {
            await collectionProduct.findOneAndUpdate({ productName: name1, productPrice: price }, { $set: { productName: update } })
        }
        else if (changeValue == 'price') {
            await collectionProduct.findOneAndUpdate({ productName: name1, productPrice: price }, { $set: { productPrice: Number(update) } })
        }
        else {
            await collectionProduct.findOneAndUpdate({ productName: name1, productPrice: price }, { $set: { productImg: update } })
        }
        let arr = await collectionProduct.find()
        res.json(arr)
    }
    updateProduct()

})
// export file xlsx for users
app.get('/usersXL', async (req, res) => {
    const workBook = new ExcelJS.Workbook()
    const worksheet = workBook.addWorksheet()
    worksheet.views = [{ rightToLeft: true }];
    let arrToFile = [[' שם משפחה','שם פרטי','מייל','פאלפון']]
    let arrUsers = await collectionUser.find()
    arrUsers.forEach((val) => {
        arrToFile.push([val.userFamayl ,val.userName, val.userEmail , val.userFone])
    })
    arrToFile.forEach((row) => {
        worksheet.addRow(row);
    });
    worksheet.getColumn('C').width = 20;
    worksheet.getColumn('A').width = 12;
    worksheet.getColumn('B').width = 12;
    worksheet.getColumn('D').width = 12;
    const buffer = await workBook.xlsx.writeBuffer();

    res.setHeader('Content-Disposition', 'attachment; filename=users.xlsx');
    res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
    res.send(buffer);

})


app.get('/pendingXL', async (req, res) => {
    const arrPending = await collectionPending.find();
    console.log(arrPending)
    const workBook = new ExcelJS.Workbook()
    const worksheet = workBook.addWorksheet()
    worksheet.views = [{ rightToLeft: true }];
    let arrToFile = [['שם פרטי','פאלפון','כמות']]

    arrPending.forEach((val) => {
        arrToFile.push([val.userName,val.userFon])
        val.arrProducts.forEach((val)=>{
            arrToFile.push([val.productName,'',val.cunt2])
        })
        console.log(val.arrProducts);
        
    })

    arrToFile.forEach((row) => {
        worksheet.addRow(row);
    });
    worksheet.getColumn('C').width = 20;
    worksheet.getColumn('A').width = 12;
    worksheet.getColumn('B').width = 12;
    worksheet.getColumn('D').width = 12;
    const buffer = await workBook.xlsx.writeBuffer();

    res.setHeader('Content-Disposition', 'attachment; filename=users.xlsx');
    res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
    res.send(buffer);

});


app.get('/allpadingXl', async (req, res) => {
    const workbook = new ExcelJS.Workbook();
    const worksheet = workbook.addWorksheet(`Sheet1`);
    const arrPending = await collectionPending.find();
    worksheet.views = [{ rightToLeft: true }];
    let arrToFile = [['רשימת ספרים', 'כמות']];
    let arrNew = []
    let arrBooc = []
    let arrScool = []
    let totulPrice1 =0
    // בניית מערך של כל הספרים מכל ההזמנות
    arrPending.forEach((val)=>{
        totulPrice1 = totulPrice1 + val.totulPrice
        arrBooc = [...arrBooc,...val.arrProducts]
    })

    arrBooc.forEach((val)=>{

    })
    // בנית מערך רק של הספרים של הבנים

    arrScool =  arrBooc.filter((val)=>val.scool == 'boys')

    arrScool.forEach((val)=>{
        let boolian = false
        arrNew.forEach((value,index)=>{
            if(val.class == value.class && val.scool == value.scool && val.productName == value.productName){
                arrNew[index].cunt2 = arrNew[index].cunt2 + val.cunt2
                boolian = true
            }
        })
        if(boolian == false){
            arrNew.push(val)
        } 
    })

    // סידור המערך של הבנים לפי כיתות
    let class1 = [[],[],[],[],[],[],[],[]]
    arrToFile.push(['בנים'])
    arrNew.forEach((val)=>{
        if(val.class == 'א') class1[0].push(val)
        else if (val.class == 'ב') class1[1].push(val)
        else if (val.class == 'ג') class1[2].push(val)
        else if (val.class == 'ד') class1[3].push(val)
        else if (val.class == 'ה') class1[4].push(val)
        else if (val.class == 'ו') class1[5].push(val)
        else if (val.class == 'ז') class1[6].push(val)
        else if (val.class == 'ח') class1[7].push(val)
    })
    let arr4 = [['כיתה א'],['כיתה ב'],['כיתה ג'],['כיתה ד'],['כיתה ה'],['כיתה ו'],['כיתה ז'],['כיתה ח']]
    let sum1 = 0
    class1 = class1.map((val)=>{
        val = val.sort((a,b)=>a.index-b.index)
        let val2 = val.map((value)=>{
            return ["",value.productName,value.cunt2]
        })
        val2.unshift(arr4[sum1])
        sum1++
        return val2
    })

    // הכנסה של כל מערכי הכיתותת לתוך המערך הכללי של הקובץ
    class1.forEach((val)=>{
        if(val.length>1){
            val.forEach((val)=>{
                arrToFile.push(val)
            })
        }
    })
    
    arrScool = arrBooc.filter((val)=>val.scool == 'girls') 

    arrNew = []
    arrScool.forEach((val)=>{
        let boolian = false
        arrNew.forEach((value,index)=>{
            if(val.class == value.class && val.scool == value.scool && val.productName == value.productName){
                arrNew[index].cunt2 = arrNew[index].cunt2 + val.cunt2
                boolian = true
            }
        })
        if(boolian == false){
            arrNew.push(val)
        } 
    })

    class1 = [[],[],[],[],[],[],[],[]]
        arrToFile.push(['בנות'])
        arrNew.forEach((val)=>{
            if(val.class == 'א') class1[0].push(val)
            else if (val.class == 'ב') class1[1].push(val)
            else if (val.class == 'ג') class1[2].push(val)
            else if (val.class == 'ד') class1[3].push(val)
            else if (val.class == 'ה') class1[4].push(val)
            else if (val.class == 'ו') class1[5].push(val)
            else if (val.class == 'ז') class1[6].push(val)
            else if (val.class == 'ח') class1[7].push(val)
        })
        arr4 = [['כיתה א'],['כיתה ב'],['כיתה ג'],['כיתה ד'],['כיתה ה'],['כיתה ו'],['כיתה ז'],['כיתה ח']]
        sum1 = 0
        class1 = class1.map((val)=>{
            val = val.sort((a,b)=>a.index-b.index)
            let val2 = val.map((value)=>{
                return ["",value.productName,value.cunt2]
            })
            val2.unshift(arr4[sum1])
            sum1++
            return val2
        })
        class1.forEach((val)=>{
            if(val.length>1){
                val.forEach((val)=>{
                    arrToFile.push(val)
                })
            }
        })
    arrToFile.push(['סך הכל :',totulPrice1])
    arrToFile.forEach((row) => {
        worksheet.addRow(row);
    });

    const buffer = await workbook.xlsx.writeBuffer();

    res.setHeader('Content-Disposition', 'attachment; filename=pending.xlsx');
    res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
    res.send(buffer);

})

app.post('/myPading', async (req,res)=>{
    const workbook = new ExcelJS.Workbook();
    const arrPending = await collectionPending.find({userFon: req.body.fon});
    let sum = 1;
    arrPending.forEach((val) => {
        const worksheet = workbook.addWorksheet(`Sheet${sum}`);
        // הגדרת כיוון הטבלה כמימין לשמאל
        worksheet.views = [{ rightToLeft: true }];
        
        let arrToFile = [];
        arrToFile.push([':שם', val.userName], [' פאלפון :', val.userFon], ['', 'רשימת ספרים', 'כמות']);
        let totalPrice = val.totulPrice;
        let class1 = [[],[],[],[],[],[],[],[]]
        let arrScoolB = val.arrProducts.filter((val)=>val.scool == 'boys') 
        arrToFile.push(['בנים'])
        arrScoolB.forEach((val)=>{
            if(val.class == 'א') class1[0].push(val)
            else if (val.class == 'ב') class1[1].push(val)
            else if (val.class == 'ג') class1[2].push(val)
            else if (val.class == 'ד') class1[3].push(val)
            else if (val.class == 'ה') class1[4].push(val)
            else if (val.class == 'ו') class1[5].push(val)
            else if (val.class == 'ז') class1[6].push(val)
            else if (val.class == 'ח') class1[7].push(val)
        })
        let arr4 = [['כיתה א'],['כיתה ב'],['כיתה ג'],['כיתה ד'],['כיתה ה'],['כיתה ו'],['כיתה ז'],['כיתה ח']]
        let sum1 = 0
        class1 = class1.map((val)=>{
            val = val.sort((a,b)=>a.index-b.index)
            let val2 = val.map((value)=>{
                return ["",value.productName,value.cunt2]
            })
            val2.unshift(arr4[sum1])
            sum1++
            return val2
        })
        class1.forEach((val)=>{
            if(val.length>1){
                val.forEach((val)=>{
                    arrToFile.push(val)
                })
            }
        })

        

        class1 = [[],[],[],[],[],[],[],[]]
        arrScoolB = val.arrProducts.filter((val)=>val.scool == 'girls') 
        arrToFile.push(['בנות'])
        arrScoolB.forEach((val)=>{
            if(val.class == 'א') class1[0].push(val)
            else if (val.class == 'ב') class1[1].push(val)
            else if (val.class == 'ג') class1[2].push(val)
            else if (val.class == 'ד') class1[3].push(val)
            else if (val.class == 'ה') class1[4].push(val)
            else if (val.class == 'ו') class1[5].push(val)
            else if (val.class == 'ז') class1[6].push(val)
            else if (val.class == 'ח') class1[7].push(val)
        })
        arr4 = [['כיתה א'],['כיתה ב'],['כיתה ג'],['כיתה ד'],['כיתה ה'],['כיתה ו'],['כיתה ז'],['כיתה ח']]
        sum1 = 0
        class1 = class1.map((val)=>{
            val = val.sort((a,b)=>a.index-b.index)
            let val2 = val.map((value)=>{
                return ["",value.productName,value.cunt2]
            })
            val2.unshift(arr4[sum1])
            sum1++
            return val2
        })
        class1.forEach((val)=>{
            if(val.length>1){
                val.forEach((val)=>{
                    arrToFile.push(val)
                })
            }
        })
        arrToFile.push(['מחיר סופי:', totalPrice]);

        arrToFile.forEach((row) => {
            worksheet.addRow(row);
        });

        // עיצוב התיבות בקוץ
        let arr2 = ['A1', 'A2', `A${val.arrProducts.length + 3}`, 'B3', 'C3']
        arr2.forEach((val) => {
            const box = worksheet.getCell(val);

            // עיצוב התיבה
            box.border = {
                bottom: { style: 'thick' },
            };

            // צבע הגבולות
            box.border.color = 'black'
        })
        let box = worksheet.getCell('B2')
        box.font = {
            size: 9, // גודל הטקסט בפיקסלים
        };


        sum++;
    });

    const buffer = await workbook.xlsx.writeBuffer();

    res.setHeader('Content-Disposition', 'attachment; filename=pendingUser.xlsx');
    res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
    res.send(buffer);
})


app.post('/myPading', async (req, res) => {
    try {
        const workbook = new ExcelJS.Workbook();
        const arrPending = await collectionPending.find({ userFon: req.body.fon }).toArray();
        
        let sum = 1;
        arrPending.forEach((val) => {
            const worksheet = workbook.addWorksheet(`Sheet${sum}`);
            worksheet.views = [{ rightToLeft: true }];
            
            let arrToFile = [];
            arrToFile.push([':שם', val.userName], [' פאלפון :', val.userFon], ['', 'רשימת ספרים', 'כמות']);
            let totalPrice = val.totulPrice;

            let class1 = [[],[],[],[],[],[],[],[]];
            let arrScoolB = val.arrProducts.filter((val) => val.scool == 'boys');
            arrToFile.push(['בנים']);

            arrScoolB.forEach((val) => {
                if (val.class == 'א') class1[0].push(val);
                else if (val.class == 'ב') class1[1].push(val);
                else if (val.class == 'ג') class1[2].push(val);
                else if (val.class == 'ד') class1[3].push(val);
                else if (val.class == 'ה') class1[4].push(val);
                else if (val.class == 'ו') class1[5].push(val);
                else if (val.class == 'ז') class1[6].push(val);
                else if (val.class == 'ח') class1[7].push(val);
            });

            let arr4 = [['כיתה א'],['כיתה ב'],['כיתה ג'],['כיתה ד'],['כיתה ה'],['כיתה ו'],['כיתה ז'],['כיתה ח']];
            let sum1 = 0;
            class1 = class1.map((val) => {
                val = val.sort((a, b) => a.index - b.index);
                let val2 = val.map((value) => {
                    return ["", value.productName, value.cunt2];
                });
                val2.unshift(arr4[sum1]);
                sum1++;
                return val2;
            });

            class1.forEach((val) => {
                if (val.length > 1) {
                    val.forEach((val) => {
                        arrToFile.push(val);
                    });
                }
            });

            class1 = [[],[],[],[],[],[],[],[]];
            arrScoolB = val.arrProducts.filter((val) => val.scool == 'girls');
            arrToFile.push(['בנות']);
            arrScoolB.forEach((val) => {
                if (val.class == 'א') class1[0].push(val);
                else if (val.class == 'ב') class1[1].push(val);
                else if (val.class == 'ג') class1[2].push(val);
                else if (val.class == 'ד') class1[3].push(val);
                else if (val.class == 'ה') class1[4].push(val);
                else if (val.class == 'ו') class1[5].push(val);
                else if (val.class == 'ז') class1[6].push(val);
                else if (val.class == 'ח') class1[7].push(val);
            });

            arr4 = [['כיתה א'],['כיתה ב'],['כיתה ג'],['כיתה ד'],['כיתה ה'],['כיתה ו'],['כיתה ז'],['כיתה ח']];
            sum1 = 0;
            class1 = class1.map((val) => {
                val = val.sort((a, b) => a.index - b.index);
                let val2 = val.map((value) => {
                    return ["", value.productName, value.cunt2];
                });
                val2.unshift(arr4[sum1]);
                sum1++;
                return val2;
            });

            class1.forEach((val) => {
                if (val.length > 1) {
                    val.forEach((val) => {
                        arrToFile.push(val);
                    });
                }
            });
            arrToFile.push(['מחיר סופי:', totalPrice]);

            arrToFile.forEach((row) => {
                worksheet.addRow(row);
            });

            let arr2 = ['A1', 'A2', `A${val.arrProducts.length + 3}`, 'B3', 'C3'];
            arr2.forEach((val) => {
                const box = worksheet.getCell(val);
                box.border = { bottom: { style: 'thick' } };
                box.border.color = 'black';
            });
            let box = worksheet.getCell('B2');
            box.font = { size: 9 };

            sum++;
        });

        const buffer = await workbook.xlsx.writeBuffer();
        res.setHeader('Content-Disposition', 'attachment; filename=pending.xlsx');
        res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
        res.send(buffer);
    } catch (err) {
        console.error(err);
        res.status(500).send('Error generating file');
    }
});

app.get('/getManger', async (req,res) =>{
    let manger = await collectionMenger.find()
    res.json(manger[0])
})

app.post('/openSaleManger', async (req,res)=>{

    let openSale = req.body.openSale;
    let manger = await collectionMenger.findOneAndUpdate({_id:'67ca33e52dc7f37c72ca4ceb'},{$set:{openSale}})
    res.json(true)
    
})


app.post('/closeSaleManger', async (req,res)=>{
    let openSale = req.body.openSale;
    let manger = await collectionMenger.findOneAndUpdate({_id:'67ca33e52dc7f37c72ca4ceb'},{$set:{openSale}})
    res.json(true)
    
})

const getUsrer = async ()=>{
    let user= await collectionUser.findOne({userEmail:'ranan97531@gmail.com'})
    console.log(user);
}

const checkP = async () =>{
    let users = await collectionUser.find()
    users.forEach(async(val)=>{
        let user = await collectionPending.find({userFon:val.userFone})
        if(user.length > 1){
            console.log(user);
        }
    })
}

const createManger = async () =>{

    let objManger = {
        title:'',
        terms:'',
        openSale:false,
        orderConstant:[]
    }

    await collectionMenger.insertMany(objManger)
}


const constantFunction = () => {
    cron.schedule('0 16 * * 0', async () => {
        let res = await collectionPending.deleteMany({})
        let manger = await collectionMenger.find()
        if(manger[0].orderConstant.length > 0){
            await collectionPending.insertMany(manger[0].orderConstant)
        }
    }, {
        timezone: "Asia/Jerusalem" // קובע את הזמן לפי ישראל
    });
}

constantFunction()

// createManger()

app.listen(3000, () => console.log('server port on 3000'))





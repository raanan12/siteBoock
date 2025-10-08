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
const PDFDocument = require('pdfkit');
const cors = require('cors');
app.use(cors());

function fixText(text) {
    if (!text) return '';
    return Buffer.from(text, 'utf8').toString();
  }
  





// Configure middleware
app.use(express.static(path.join(__dirname, 'pages')));
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json())


// Connect to MongoDb
db.connect('mongodb+srv://ranan97531:2524097531R@cluster0.rhkco4m.mongodb.net/mosheFruits', {
    useNewUrlParser: true,
    useUnifiedTopology: true
  })
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
    totulPrice:Number,
    adress:String,
    comments:String
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
        totulPrice: req.body.totulPrice,
        adress: req.body.adress,
        comments: req.body.comments
    };
    
    // עדכון כמות המוצרים במחסן לפי סוג
    temp.arrProducts.forEach(async (val) => {
        let pro = await collectionProduct.findOne({ productName: val.productName });
        if (pro.type == false) {
            let num = pro.amount;
            --num;
            await collectionProduct.findOneAndUpdate(
                { productName: val.productName },
                { $set: { amount: num } }
            );
        }
    });
    
    const addOrder = async () => {
        try {
            // שמירת ההזמנה במסד ומחזיר את האובייקט המלא שנוצר
            const savedDoc = await collectionPending.create(temp);
            res.send({ result: true, id: savedDoc._id });
        } catch (err) {
            console.error('שגיאה בשמירה למסד:', err);
            res.status(500).send({ result: false, error: err.message });
        }
    };
    
    addOrder();
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
        const order = await collectionPending.findByIdAndDelete(req.body.id)
        if (order) {
            res.json('ההזמנה נמחקה בהצלחה')
        } else {
            res.status(404).json('הזמנה לא נמצאה')
        }
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
    let classCh = req.body.classTypeCh;
    console.log(classCh);
    const updateProduct = async () => {
        if (changeValue == 'name') {
            await collectionProduct.findOneAndUpdate({ productName: name1, productPrice: price }, { $set: { productName: update ,class:classCh} })
        }
        else if (changeValue == 'price') {
            await collectionProduct.findOneAndUpdate({ productName: name1, productPrice: price }, { $set: { productPrice: Number(update),class:classCh } })
        }
        else {
            await collectionProduct.findOneAndUpdate({ productName: name1, productPrice: price }, { $set: { productImg: update,class:classCh } })
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
  console.log(arrPending);

  const workBook = new ExcelJS.Workbook();
  const worksheet = workBook.addWorksheet('Pending Orders');
  worksheet.views = [{ rightToLeft: true }];

  // סגנון כללי לכותרות לקוח
  const customerHeaderStyle = {
    font: { bold: true, size: 14 },
    alignment: { horizontal: 'center' },
    fill: { type: 'pattern', pattern: 'solid', fgColor: { argb: 'FFCCE5FF' } }
  };

  // כותרת כללית (לא חובה)
  worksheet.addRow(['דו"ח הזמנות ממתינות']).font = { bold: true, size: 16 };
  worksheet.addRow([]); // שורת רווח

  arrPending.forEach((order, index) => {
    // שורת התחלה של לקוח
    const headerRow = worksheet.addRow([
      `לקוח מספר ${index + 1}: ${order.userName}`,
      `פאלפון : ${order.userFon}`,
      '',
      `כתובת: ${order.adress}`,
      `הערות: ${order.comments}`
    ]);
    headerRow.eachCell((cell) => Object.assign(cell, customerHeaderStyle));

    // כותרת לטבלת המוצרים
    const productHeader = worksheet.addRow(['מוצר', '', 'כמות']);
    productHeader.font = { bold: true };

    // שורות המוצרים
    order.arrProducts.forEach((product) => {
      worksheet.addRow([product.productName, '', product.cunt2]);
    });

    worksheet.addRow([]); // שורת רווח בין לקוחות
  });

  // הגדרת רוחב עמודות
  worksheet.getColumn('A').width = 30;
  worksheet.getColumn('B').width = 15;
  worksheet.getColumn('C').width = 15;
  worksheet.getColumn('D').width = 30;
  worksheet.getColumn('E').width = 40;

  const buffer = await workBook.xlsx.writeBuffer();

  res.setHeader('Content-Disposition', 'attachment; filename=pending_orders.xlsx');
  res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
  res.send(buffer);
});



app.get('/allpadingXl', async (req, res) => {
    const ExcelJS = require('exceljs');
    const workbook = new ExcelJS.Workbook();
    const worksheet = workbook.addWorksheet(`Sheet1`);
    worksheet.views = [{ rightToLeft: true }];

    worksheet.columns = [
        { header: 'שם מוצר', key: 'productName', width: 40 },
        { header: 'כמות כוללת', key: 'cunt2', width: 15 }
    ];

    const arrPending = await collectionPending.find();
    let allProducts = [];

    arrPending.forEach((val) => {
        allProducts = [...allProducts, ...val.arrProducts];
    });

    const mergedProducts = [];

    allProducts.forEach((product) => {
        const existing = mergedProducts.find(p => p.productName === product.productName);
        if (existing) {
            existing.cunt2 += product.cunt2;
        } else {
            mergedProducts.push({
                productName: product.productName,
                cunt2: product.cunt2
            });
        }
    });

    mergedProducts.forEach((product) => {
        worksheet.addRow({ productName: product.productName, cunt2: product.cunt2 });
    });

    const buffer = await workbook.xlsx.writeBuffer();
    res.setHeader('Content-Disposition', 'attachment; filename=all-products.xlsx');
    res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
    res.send(buffer);
});


app.post('/myPadingPDF', async (req, res) => {
    try {
      console.log('📥 קיבלתי בקשה ל-PDF עם fon:', req.body.fon);
  
      // שליפת ההזמנה לפי מספר הטלפון
      const order = await collectionPending.findById(req.body.fon);

      console.log('arrPending (נתונים):', JSON.stringify(order, null, 2));
  
      if (!order) {
        console.log('❌ לא נמצאו נתונים ל-fon הזה');
        return res.status(404).json({ message: 'לא נמצאו נתונים.' });
      }
  
      // יצירת מסמך PDF
      const doc = new PDFDocument({ margin: 50, size: 'A4', layout: 'portrait' });
  
      // רישום פונט עברי
      doc.registerFont('hebrewFont', path.join(__dirname, 'Alef-Regular.ttf'));
  
      // אגירת תוכן הקובץ
      const buffers = [];
      doc.on('data', buffers.push.bind(buffers));
      doc.on('end', () => {
        const pdfData = Buffer.concat(buffers);
        res.setHeader('Content-Disposition', 'attachment; filename=pendingUser.pdf');
        res.setHeader('Content-Type', 'application/pdf');
        res.send(pdfData);
      });
  
      // הגדרות כלליות
      doc.font('hebrewFont').fontSize(16);
  
      // פרטי משתמש
      doc.text(`${order.userName} ${':'} ${'שם '}  `, { align: 'right', rtl: true });
      doc.text(`${order.userFon} ${':'} ${'פאלפון '} `, { align: 'right', rtl: true });
      if (order.adress) {
        doc.text(` ${order.adress} ${':'} ${'כתובת'}`, { align: 'right', rtl: true });
      }
      doc.moveDown();
  
      // כותרת טבלה
      doc.fontSize(14).text('רשימת מוצרים:', { align: 'right', rtl: true });
      doc.moveDown(0.5);
  
      const startY = doc.y;
      const tablePadding = 10;
      const rowHeight = 25;
  
      // כותרת הטבלה
      doc.rect(50, startY, 500, rowHeight).fillAndStroke('#eeeeee', 'black');
      doc.fillColor('black').fontSize(13).text(` ${'המוצר'} ${' שם'}` , 330, startY + 7, {
        rtl: true,
        width: 200,
        align: 'right',
      });
      doc.text('כמות', 100, startY + 7, {
        rtl: true,
        width: 100,
        align: 'right',
      });
  
      doc.moveDown();
  
      // שורות המוצרים
      order.arrProducts?.sort((a, b) => a.index - b.index).forEach((product, i) => {
        const y = startY + rowHeight * (i + 1);
        doc.rect(50, y, 500, rowHeight).stroke();
        doc.fontSize(12).text(product.productName, 330, y + 7, {
          rtl: true,
          width: 200,
          align: 'right',
        });
        doc.text(product.cunt2?.toString() || '0', 100, y + 7, {
          rtl: true,
          width: 100,
          align: 'right',
        });
      });
  
      // מחיר סופי
      const finalY = startY + rowHeight * (order.arrProducts?.length + 2);
      doc.moveTo(50, finalY).moveDown();
      doc.text(`₪ ${order.totulPrice} ${':'}  ${'סופי'} ${'מחיר '} `, { align: 'right', rtl: true });

  
      doc.end();
    } catch (error) {
      console.error('שגיאה ביצירת PDF:', error);
      res.status(500).send('שגיאה ביצירת הקובץ.');
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

app.get('/deletAdmin25240', async (req,res)=>{
    try {
        await collectionPending.deleteMany({});
        res.json('כל ההזמנות נמחקו בהצלחה');
      } catch (error) {
        console.error(error);
        res.status(500).json('שגיאה במחיקת ההזמנות');
      }
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






// test2()
// createManger()

const port = process.env.PORT || 3000;

app.listen(port, '0.0.0.0', () => {
    console.log("Running on port 3000");
  });




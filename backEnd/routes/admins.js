var express = require('express');
var router = express.Router();
var upload = require('../ulity/upload');
var sendMail = require('../ulity/sendMail');

var modelProduct = require('../models/productModel');
var modelOrder = require('../models/orderModel');
var modelUser = require('../models/userModel');
var modelBrand = require('../models/brandModel');
var modelCategory = require('../models/categoryModel');

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('admin_dashboard', { title: 'Trang Quản Lý' });
});


////////////////////////////////////////////  product   ////////////////////////////////////////////////////////////////////////////////////
router.get('/productAdmin', async function(req, res, next) {
  try{
    let page = parseInt(req.query.page) || 1; // Trang mặc định là 1 nếu không có truy vấn
    let limit = 7; // Số lượng sản phẩm mỗi trang
    let skip = (page - 1) * limit; // Số sản phẩm cần bỏ qua
    
    var data = await modelProduct.find().populate('categoryId', 'name').populate('brandId', 'name').skip(skip).limit(7);
    res.json(data);
  }catch(e){
    res.json({status: 0, message:"không tìm thấy sản phẩm "})
  }
});

router.post('/productAdmin/add_product', [upload.single('img')] , async function(req, res, next) {
  try{
    // console.log('Request Body:', req.body);
    // console.log('Request File:', req.file);
    // console.log(req.body);
    var {name,price,description,brandId,categoryId} = req.body;
    var img = req.file.originalname
    var productAdd = {
      name,
      price: Number(price),
      img,
      description,
      type: 'food',
      rating: 1,
      hot: false,
      brandId,
      categoryId
    };
    // console.log(productAdd);
    var result = await modelProduct.create(productAdd);

    // console.log(productAdd);
    if(result != null){
      res.json({status: 1, message:"Thành công"});
      // res.redirect('/admins/product');
    }else{
      res.json({status: 0, message:"thất bại"});
    }
  }catch(e){
        res.json({status: 0, message:"chịu lun  "})
  }
});

router.get('/productAdmin/delete_product/:id', async function(req, res, next) {
  try{
    var {id} = req.params;
    var result = await modelProduct.findByIdAndDelete(id)
    if(result != null){
      res.json({status: 1, message:"Thành công"});
      // res.redirect('/admins/product');
    }else{
      res.json({status: 0, message:"thất bại"});
    }
  }catch(e){
        res.json({status: 0, message:"chịu lun  "})
        // console.log(e);
  }
  // res.json(data)
});
router.post('/productAdmin/update_product/:id',  [upload.single('img')] ,async function(req, res, next) {
  try{
    var {id} = req.params
    var {name,price,description,type, rating, hot,brandId,categoryId} = req.body;
    var img = req.file.originalname
    var productEdit = await modelProduct.findById(id);
    // res.json(productEdit)
    if(productEdit != null){
      productEdit.name  = name ? name: productEdit.name;
      productEdit.price  = price ? price: productEdit.price;
      productEdit.img  = img ? img: productEdit.img;
      productEdit.description  = description ? description: productEdit.description;
      productEdit.type  = type ? type: productEdit.type;
      productEdit.rating  = rating ? rating: productEdit.rating;
      productEdit.hot  = hot ? hot: productEdit.hot;
      productEdit.brandId  = brandId ? brandId: productEdit.brandId;
      productEdit.categoryId  = categoryId ? categoryId: productEdit.categoryId;
    }
    console.log(productEdit);

    var result = await productEdit.save();

    if(result != null){
      res.json({status: 1, message:"Thành công"});
      // res.redirect('/admins/product');
    }else{
      res.json({status: 0, message:"thất bại"});
    }
  }catch(e){
        res.json({status: 0, message:"chịu lun  "})
  }
});

// test upload ảnh
router.post('/uploadTextImages', [upload.single('image')],
    async (req, res, next) => {
        try {
            const { file } = req;
            if (!file) {
               return res.json({ status: 0, link : "" }); 
            } else {
                const url = `http://localhost:3000/images/${file.filename}`;
                return res.json({ status: 1, url : url });
            }
        } catch (error) {
            console.log('Upload image error: ', error);
            return res.json({status: 0, link : "" });
        }
    });
// test upload ảnh

////////////////////////////////////////////////  order   ////////////////////////////////////////////////////////////////////////////////

router.get('/order', async function(req, res, next) {
  var data = await modelOrder.find();
  res.json(data)
});

router.get('/order/delete_order/:id', async function(req, res, next) {
  try{
    var {id} = req.params;
    var result = await modelOrder.findByIdAndDelete(id)
    if(result != null){
      res.json({status: 1, message:"Thành công"});
      // res.redirect('/admins/u');
    }else{
      res.json({status: 0, message:"thất bại"});
    }
  }catch(e){
        res.json({status: 0, message:"chịu lun  "})
        // console.log(e);
  }
});

router.post('/order/update_order/:id', async function(req, res, next) {
  try{
    const {id} = req.params;
    const {status} = req.body;

    var orderEdit = await modelOrder.findById(id);

    if(orderEdit != null){
      orderEdit.status  = status ? status: orderEdit.status;
    }
    // console.log(orderEdit);

    var result = await orderEdit.save();

    if(result != null){
      res.json({status: 1, message:"Thành công"});
    }else{
      res.json({status: 0, message:"thất bại"});
    }
  }catch(e){
      res.json({status:-1, message:"có lỗi xảy ra "});
  }
});


/////////////////////////////////////////////   user    ///////////////////////////////////////////////////////////////////////////////////

router.get('/user', async function(req, res, next) {
  var data = await modelUser.find();
  res.json(data)
});

router.post('/user/add_user', async function(req, res, next) {
  try{
    var {name,email,password,permission_user} = req.body
    var siginAdd = {name,email,password,permission_user};
    var result = await modelUser.create(siginAdd);

    if(result != null){
      res.json({status: 1, message:"Thành công"});
      // res.redirect('/admins/product');
    }else{
      res.json({status: 0, message:"thất bại"});
    }
  }catch(e){
        res.json({status: 0, message:"chịu lun  "})
  }
});

router.get('/user/delete_user/:id', async function(req, res, next) {
  try{
    var {id} = req.params;
    var result = await modelUser.findByIdAndDelete(id)
    if(result != null){
      res.json({status: 1, message:"Thành công"});
      // res.redirect('/admins/u');
    }else{
      res.json({status: 0, message:"thất bại"});
    }
  }catch(e){
        res.json({status: 0, message:"chịu lun  "})
        // console.log(e);
  }
});

router.post('/user/update_user/:id', async function(req, res, next) {
  try{
    var {id} = req.params
    var {name,email,password,permission_user} = req.body;
    var userEdit = await modelUser.findById(id);
    console.log(userEdit);
    if(userEdit != null){
      userEdit.name  = name ? name: userEdit.name;
      userEdit.email  = email ? email: userEdit.email;
      userEdit.password  = password ? password: userEdit.password;
      userEdit.permission_user  = permission_user ? permission_user: userEdit.permission_user;
    }

    var result = await userEdit.save();

    if(result != null){
      res.json({status: 1, message:"Thành công"});
      // res.redirect('/admins/product');
    }else{
      res.json({status: 0, message:"thất bại"});
    }
  }catch(e){
        res.json({status: 0, message:"chịu lun  "})
        // console.log(e);
  }
});


////////////////////////////////////////////////  brand   ////////////////////////////////////////////////////////////////////////////////

router.get('/brandAdmin', async function(req, res, next) {
  var data = await modelBrand.find();  
  res.json(data)
});
router.post('/brand/add_brand', async function(req, res, next) {
  try{
    var {name,img} = req.body
    var brandAdd = {name,img};
    var result = await modelBrand.create(brandAdd);

    if(result != null){
      res.json({status: 1, message:"Thành công"});
      // res.redirect('/admins/product');
    }else{
      res.json({status: 0, message:"thất bại"});
    }
  }catch(e){
        res.json({status: 0, message:"chịu lun  "})
  }
});

router.get('/brand/delete_brand/:id', async function(req, res, next) {
  try{
    var {id} = req.params;
    var result = await modelBrand.findByIdAndDelete(id)
    if(result != null){
      res.json({status: 1, message:"Thành công"});
    }else{
      res.json({status: 0, message:"thất bại"});
    }
  }catch(e){
        res.json({status: 0, message:"chịu lun  "})
  }
});

router.post('/brand/update_brand/:id', async function(req, res, next) {
  try{
    var {id} = req.params
    var {name, img} = req.body;
    var brandEdit = await modelBrand.findById(id);
    console.log(brandEdit);
    if(brandEdit != null){
      brandEdit.name  = name ? name: brandEdit.name;
      brandEdit.img  = img ? img: brandEdit.img;
    }

    var result = await brandEdit.save();

    if(result != null){
      res.json({status: 1, message:"Thành công"});
      // res.redirect('/admins/product');
    }else{
      res.json({status: 0, message:"thất bại"});
    }
  }catch(e){
        res.json({status: 0, message:"chịu lun  "})
        // console.log(e);
  }
});


//////////////////////////////////////////   category  //////////////////////////////////////////////////////////////////////////////////////


router.get('/categoryAdmin', async function(req, res, next) {
  var data = await modelCategory.find();
  res.json(data)
});
router.post('/categoryAdmin/add_category', async function(req, res, next) {
  try{
    var {name} = req.body
    var categoryAdd = {name};
    var result = await modelCategory.create(categoryAdd);

    if(result != null){
      res.json({status: 1, message:"Thành công"});
      // res.redirect('/admins/product');
    }else{
      res.json({status: 0, message:"thất bại"});
    }
  }catch(e){
        res.json({status: 0, message:"chịu lun  "})
  }
});

router.get('/categoryAdmin/delete_category/:id', async function(req, res, next) {
  try{
    var {id} = req.params;
    var result = await modelCategory.findByIdAndDelete(id)
    if(result != null){
      res.json({status: 1, message:"Thành công"});
    }else{
      res.json({status: 0, message:"thất bại"});
    }
  }catch(e){
        res.json({status: 0, message:"chịu lun  "})
  }
});

router.post('/categoryAdmin/update_category/:id', async function(req, res, next) {
  try{
    var {id} = req.params
    var categoryEdit = await modelCategory.findById(id);
    res.json(categoryEdit);

    var {name} = req.body;

    if(name != null){
      categoryEdit.name  = name ? name: categoryEdit.name;

      var result = await categoryEdit.save();
      
      if(result != null){
        res.json({status: 1, message:"Thành công", data:result});
        // res.redirect('/admins/product');
      }else{
        res.json({status: 0, message:"thất bại"});
      }
    }


  }catch(e){
        res.json({status: 0, message:"chịu lun  "})
        // console.log(e);
  }
});


////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

module.exports = router;

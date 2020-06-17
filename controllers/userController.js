const multer = require('multer');
const sharp = require('sharp');
const User = require('./../models/userModel');
const catchAsync = require('./../utils/catchAsync');
const AppError = require('./../utils/appError');
const factory = require('./handlerFactory');

// const multerStorage = multer.diskStorage({ // how to save files
//   destination: (req, file, cb) => { 
//     cb(null, 'public/img/users'); // no error / save in the preferred location
//   },
//   filename: (req, file, cb) => {
//     const ext = file.mimetype.split('/')[1]; // select file type using Mimetype value via file in multer middleware
//     cb(null, `user-${req.user.id}-${Date.now()}.${ext}`); // unique id by user id from Req and current Date to create a filename.
//   }
// });
const multerStorage = multer.memoryStorage(); // Store in memory buffer instead of hard disk to improve performance and accessibility in next middlewares.

const multerFilter = (req, file, cb) => { // check if the file type is what we want.
  if (file.mimetype.startsWith('image')) { // if file type is image
    cb(null, true);  // no error, image format is `true`
  } else {
    cb(new AppError('Not an image! Please upload only images.', 400), false); // Generate error with AppError and 400 status and `false` for file type validation.
  }
};

const upload = multer({
  storage: multerStorage, // pass options object to multer / specify storage and filter.
  fileFilter: multerFilter
});
// Step-1 in Upload profile photo process
exports.uploadUserPhoto = upload.single('photo'); // Upload only single files in the field `photo`

// Step-2 in Upload profile photo process
exports.resizeUserPhoto = catchAsync(async (req, res, next) => {
  if (!req.file) return next(); // If there is no file attached to the request, just do nothing.

  req.file.filename = `user-${req.user.id}-${Date.now()}.jpeg`; // Define filename to later access it in saving DB 

  await sharp(req.file.buffer)
    .resize(500, 500)
    .toFormat('jpeg')
    .jpeg({ quality: 90 })
    .toFile(`public/img/users/${req.file.filename}`);

  next();
});

// filter function to accept only allowed fields out of an object.
const filterObj = (obj, ...allowedFields) => { 
  const newObj = {};
  Object.keys(obj).forEach(el => {
    if (allowedFields.includes(el)) newObj[el] = obj[el];
  });
  return newObj;
};

exports.getMe = (req, res, next) => {
  req.params.id = req.user.id;
  next();
};

//
////
/////
//// Step-3 in Upload profile photo process.
// Update Users' Data from client to DB save.
exports.updateMe = catchAsync(async (req, res, next) => {
  
  console.log("Hello. This is BODY...!",req.body);
  console.log("    Hello. This is File :-O ",req.file);

  // 1) Create error if user POSTs password data
  if (req.body.password || req.body.passwordConfirm) {
    return next(
      new AppError(
        'This route is not for password updates. Please use /updateMyPassword.',
        400
      )
    );
  }

  // 2) Filtered out unwanted fields names that are not allowed to be updated
  const filteredBody = filterObj(req.body, 'name', 'email');
  if (req.file) filteredBody.photo = req.file.filename; // add `photo` field to filteredBody object which is then added to DB

  // 3) Save to database & Update user document by passing filteredBody along with user ID.
  const updatedUser = await User.findByIdAndUpdate(req.user.id, filteredBody, {
    new: true,
    runValidators: true
  });

  res.status(200).json({
    status: 'success',
    data: {
      user: updatedUser
    }
  });
});

exports.deleteMe = catchAsync(async (req, res, next) => {
  await User.findByIdAndUpdate(req.user.id, { active: false });

  res.status(204).json({
    status: 'success',
    data: null
  });
});

exports.createUser = (req, res) => {
  res.status(500).json({
    status: 'error',
    message: 'This route is not defined! Please use /signup instead'
  });
};

exports.getUser = factory.getOne(User);
exports.getAllUsers = factory.getAll(User);

// Do NOT update passwords with this!
exports.updateUser = factory.updateOne(User);
exports.deleteUser = factory.deleteOne(User);

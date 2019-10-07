const express = require('express');
const bcrypt = require('bcrypt');
const passport = require('passport');
const User = require('../models/User');
const Group = require('../models/Group');
const homePageWithNotification = require('../helpers/homePageWithNotification');
const notifications = require('../constants/notification-types');
const addMiddlewares = require('../middlewares/add-middlewares');
const { getUserNickname } = require('../helpers/reqHelpers');
const { bcrypt: saltRounds } = require('../constants/other-constants');
const News = require('../models/News');
const Topic = require('../models/Topic');
const fileUpload = require('express-fileupload');
const router = express.Router();

addMiddlewares(router);

// GET login form
router.get('/login', (req, res) => {
  console.log('Login GET');
  res.render('login');
});

// POST login
router.post('/login', (req, res, next) => {
  passport.authenticate('local', (err, user) => {
    if (err) {
      console.log('Login POST  auth ER 1');
      return res.render('login', { [notifications.error]: err });
    }
    req.logIn(user, (err) => {
      if (err) {
        console.log('Login POST LOGIN ER 1');
        return res.render('login', { [notifications.error]: err });
      }
      console.log('Login POST LOGIN True');
      return res.redirect(
        homePageWithNotification(notifications.message, 'You Logged In!'),
      );
    });
  })(req, res, next);
});

router.post('/log', async (req, res, next) => {
  const user = await User.findOne({ email: req.body.email });
  passport.authenticate('local', (err, user) => {
    if (err) {
      return res.json({ message: err });
    }
    req.logIn(user, (err) => {
      if (err) {
        return res.json({ message: err });
      }
      return res.json({ user: user.nickname });
    });
  })(req, res, next);
});

// GET registration form
router.get('/sign-up', (req, res) => {
  res.render('sign-up');
});

router.get('/authcheck', (req, res) => {
  if (req.isAuthenticated()) {
    res.json({ user: req.user.nickname });
  } else {
    res.json({ message: 'You are not authinticated,please log-in or register' });
  }
});
// POST new user
router.post('/sign-up', async (req, res) => {
  const { nickname, email, password } = req.body;
  const curEmail = await User.getByEmail(email);
  if (curEmail.length === 0) {
    const hash = await bcrypt.hash(password, 10);
    await User.create({
      nickname,
      email,
      password: hash,
      points: 0,
    });
    return res.redirect(
      homePageWithNotification(
        notifications.message,
        'You Signed Up. Please Log In!',
      ),
    );
  }
  return res.render('sign-up', {
    [notifications.error]: 'This email is already used',
  });
});

router.post('/reg', async (req, res, next) => {
  const { nickname, email, password } = req.body;
  const curUser = await User.find({ email: req.body.email });
  if (curUser.length === 0) {
    const hash = await bcrypt.hash(password, 10);
    await User.create({
      nickname,
      email,
      password: hash,
      points: 0,
    });
    return passport.authenticate('local', async (err, user) => {
      const thisUser = await User.findOne({ email: req.body.email });
      if (err) {
        return res.json({ message: err });
      }
      req.logIn(user, (err) => {
        if (err) {
          return res.json({ message: err });
        }
        console.log(thisUser.nickname);

        return res.json({ user: thisUser.nickname });
      });
    })(req, res, next);
  }
  return res.json({ message: 'This email is already used' });
});

//Get NEws from BD
router.get('/getnews', async (req, res) => {

  const news = await News.findOne();
  console.log('BACKKK', news.name);

  res.json({ news: news.name });
});
//Get TOpics from BD for users exact group!
router.get('/gettopics', async (req, res) => {
  // console.log("user===",req.user);
  // const news = await News.findOne();
  // console.log('BACKKK', req.body.userName);
  const user = await User.findOneAndUpdate({ nickname: req.user.nickname }, { group: "5d9a34fc667f67101277dfce" });
  // const group = await Group.findOne({_id:user.group});
  // console.log(group.name);
  console.log(user.group);

  // const topics = await Topic.find({ group: user.group });
  const topics = await Topic.find({ group: user.group })
  console.log(topics.length);
  let Phase = 0;
  let Week = 0;
  for (let i = 0; i < topics.length; i++) {
    Phase = Math.max(Phase, topics[i].phase);
    Week = Math.max(Week, topics[i].week);
  }
  console.log(Phase, Week);
  const result = [];

  for (let p = 1; p < Phase + 1; p++) {
    for (let w = 1; w < Week + 1; w++) {
      let week = topics.filter(el=>el.phase===`${p}`).filter(el=>el.week===`${w}`).sort((el)=>(el.day)?-1:1);
      if(week===0) {
        continue;
      } else {
        result.push(week);
      }
    }
  }
// console.log(result);

  const P1W1 = topics.filter(el=>el.phase==='1').filter(el=>el.week==='1').sort((el)=>(el.day)?-1:1);
  // const P1W2 = topics.filter(el=>el.phase==='1').filter(el=>el.week==='1').sort((el)=>(el.day)?-1:1);
  // const P1W3 = topics.filter(el=>el.phase==='1').filter(el=>el.week==='1').sort((el)=>(el.day)?-1:1);
  // const P1W4 = topics.filter(el=>el.phase==='1').filter(el=>el.week==='1').sort((el)=>(el.day)?-1:1);
  // const P2W1 = topics.filter(el=>el.phase==='1').filter(el=>el.week==='1').sort((el)=>(el.day)?-1:1);
  // const P2W2 = topics.filter(el=>el.phase==='1').filter(el=>el.week==='1').sort((el)=>(el.day)?-1:1);
  // const P2W3 = topics.filter(el=>el.phase==='1').filter(el=>el.week==='1').sort((el)=>(el.day)?-1:1);
  // const P3W4 = topics.filter(el=>el.phase==='1').filter(el=>el.week==='1').sort((el)=>(el.day)?-1:1);
  // const P3W1 = topics.filter(el=>el.phase==='1').filter(el=>el.week==='1').sort((el)=>(el.day)?-1:1);
  // const P3W2 = topics.filter(el=>el.phase==='3').filter(el=>el.week==='2').sort((el)=>(el.day)?-1:1);
  console.log(P1W1);

  const state = {
    Phase: [{
      name: '',
      weeks: [{
        name: '',
        days: [{
          topicName: '',
          video: '',
          githubLink: '',
          comments: '',
        }]
      }]
    }]
  }




  res.json(topics);
});


//Upload some File
router.post('/upload', async (req, res) => {
  // const data = await JSON.parse(req.body);
  // console.log(data);

  console.log(req);

  // if (req.files === null) {
  //   return res.status(400).json({message:'No file uploaded'})
  // }
  // const file = req.files.file;
  // file.mv(`${__dirname}/client/public/upload/${file.name}`,err => {
  //   if(err) {
  //     console.log(err);
  //     return res.status(500).send(err);
  //   }
  //   res.json({fileName:file.name, filePath : `/uploads/${file.name}`})
  // });
  //   console.log('Upload');
});
// GET user log out
router.get('/logout', (req, res) => {
  req.logout();
  res.redirect(
    homePageWithNotification(notifications.message, 'You logged out!'),
  );
});
router.get('/logoout', (req, res) => {
  req.logout();
  console.log('LOGOUT get');
  res.json({ user: '' });
});
// GET home page
router.get('/', async (req, res) => {
  const { error, message } = req.query;
  console.log('GET HOME PAGE');
  res.render('index', {
    title: 'Home',
    currentUser: getUserNickname(req),
    error,
    message,
  });
});
// GET Page with Authentication
router.get('/auth-page', async (req, res) => {
  if (req.isAuthenticated()) {
    console.log('Esli AUTH-PAGE TRUE');
    console.log('THis user data = ', req.user);

    res.render('auth-page', { currentUser: getUserNickname(req) });
  } else {
    console.log('Esli AUTH-PAGE NOT NOT TRUE!');
    res.redirect(
      homePageWithNotification(notifications.error, 'Not Authenticated!'),
    );
  }
});

module.exports = router;

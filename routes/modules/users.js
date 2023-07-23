const express = require('express')
const router = express.Router()

const User = require('../../models/user')
const passport = require('passport')
const bcrypt = require('bcryptjs')

// login
router.get('/login', (req, res) => {
  res.render('login')
})

// login-post
router.post('/login', passport.authenticate('local', {
  successRedirect: '/',
  failureRedirect: '/users/login'
}))

// register
router.get('/register', (req, res) => {
  res.render('register')
})

// register-post
router.post('/register', (req, res) => {
  const { name, email, password, confirmPassword } = req.body
  const errors = []

  User.findOne({ email })
    .then(user => {
      if (user) {
        errors.push({ message: 'Email已註冊，請直接登入' })
        return res.render('login', { errors })
      }
      if (!email || !password || !confirmPassword) {
        errors.push({ message: 'Email與密碼不可空白' })
      }
      if (password !== confirmPassword) {
        errors.push({ message: '密碼與確認密碼不相符' })
      }
      if (errors.length) {
        return res.render('register', { errors, name, email, password, confirmPassword })
      }
      return bcrypt
        .genSalt(10)
        .then(salt => bcrypt.hash(password, salt))
        .then(hash => User.create({ name, email, password: hash }))
        .then(()=> res.redirect('/'))
        .catch(err => console.log(err))
    })
    .catch(err => console.log(err))
})

// logout
router.get('/logout', (req, res) => {
  req.logout()
  res.redirect('/users/login')
})

module.exports = router
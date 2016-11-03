const models = require('../models/index');
const bcrypt = require('bcryptjs');

const routeAuth = require('../modules/isAuth.js');

module.exports = (app) => {
  // Page Landing
  app.get('/account', routeAuth.isAuth, (req, res) => {
    try {
      res.render('editAcc', { name: req.user.name });
    } catch (err) {
      res.render('dash', {
        errors: ['Please Login To Change Details'],
      });
    }
  });

  // Change Personal Details
  app.post('/account/details', routeAuth.isAuth, (req, res) => {
    // Sanitization
    const form = ['name', 'email', 'passwordOld', 'passwordNew', 'passwordVer'];
    for (let i = 0; i < form.length; i += 1) {
      req.sanitize(form[i]).escape();
      req.sanitize(form[i]).trim();
    }

    // Find Empty
    const empty = [];
    empty[0] = (req.body.name === '');
    empty[1] = (req.body.email === '');
    empty[2] = (req.body.passwordNew === '');

    // Check If All Fields Are Empty
    let allEmpty = 0;
    for (let i = 0; i < empty.length; i += 1) {
      if (empty[i]) {
        allEmpty += 1;
      }
    }

    // Set true if all empty
    allEmpty = (allEmpty === empty.length);

    // Validation
    req.checkBody('passwordOld', 'Please Enter Your Current Password').notEmpty();
    if (!empty[2]) {
      req.checkBody('passwordNew', 'Please Enter A Longer Password').len(8);
      req.checkBody('passwordNew', 'Passwords Do Not Match').equals(req.body.passwordVer);
    }

    const errors = req.validationErrors();

    if (errors) {
      // Render the page again with errors
      res.render('editAcc', {
        name: req.user.name,
        warnings: errors.map(obj =>
           obj.msg
        ),
      });
    } else if (allEmpty) {
      // Render the page again with errors
      res.render('editAcc', {
        name: req.user.name,
        warnings: ['No New Information Entered'],
      });
    } else {
      // Check if Password Correct
      models.User.findOne({ where: { id: req.user.id } })
        .then((user) => {
          // Could Not Find User
          if (user === null) {
            res.render('editAcc', { errors: ['Please Login Again'] });
            return;
          }

          // Compare Passwords
          bcrypt.compare(req.body.passwordOld, user.password, (err, isMatch) => {
            // User Entered The Right Password
            if (isMatch) {
              // New Name
              if (!empty[0]) {
                models.User.update(
                  { name: req.body.name },
                  { where: { id: req.user.id } })
                  .catch(() => res.render('error'));
              }

              // New Email
              if (!empty[1]) {
                models.User.update(
                  { email: req.body.email },
                  { where: { id: req.user.id } })
                  .catch(() => res.render('error'));
              }

              // New Password
              if (!empty[2]) {
                models.User.update(
                  { password: req.body.passwordNew },
                  { where: { id: req.user.id } })
                  .catch(() => res.render('error'));
              }

              // Render Successs
              res.render('editAcc', { success: ['Account Updated'] });
            }

            // User Entered The Wrong Password
            else { res.render('editAcc', { errors: ['Incorrect Password'] }); } //eslint-disable-line
          });
        })

        // Error Getting User By Id
        .catch(() => {
          res.render('editAcc', {
            errors: ['Could Not Check Email'],
          });
        });
    }
  });
};

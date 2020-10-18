const passport = require('passport');
const { BasicStrategy } = require('passport-http');
const bcrypt = require('bcrypt');
const userService = require('../../../api/components/user/service');
const userModel = require('../../../models/users');

const UserService = userService(userModel);

passport.use(new BasicStrategy(
    async function (email, password, cb) {
        try {
            const user = await UserService.verifyUser(email);
            if (!user) {
                return cb("Unauthorized", false);
            }
            if (!(await bcrypt.compare(password, user.password))) {
                return cb("Unauthorized", false);
            }
            delete user.password;
            return cb(null, user);
        } catch (error) {
            return cb(error)
        }
    }
));
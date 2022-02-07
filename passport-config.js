const LocalStrategy = require('passport-local').Strategy
const bcrypt = require('bcrypt')

function initializeStudent(passport, getUserByEmail, getUserById) {
    const authenticateUser = async (email, password, done) => {
        const userList = await getUserByEmail(email);
        const user = userList[0];
        console.log("user:", user);
        if (user == null) {
            return done(null, false, { message: 'No user with that email' })
        }

        try {
            if (await bcrypt.compare(password, user.password)) {
                return done(null, user)
            } else {
                return done(null, false, { message: 'Password incorrect' })
            }
        } catch (e) {
            return done(e)
        }
    }

    passport.use('student-auth', new LocalStrategy({ usernameField: 'email' }, authenticateUser))
    passport.serializeUser((user, done) => done(null, user.id))
    passport.deserializeUser(async (id, done) => {
        const user = await getUserById(id);
        return done(null, user)
    })
}

function initializeInstructor(passport, getUserByEmail, getUserById) {
    const authenticateUser = async (email, password, done) => {
        const userList = await getUserByEmail(email);
        const user = userList[0];
        console.log("user:", user);
        if (user == null) {
            return done(null, false, { message: 'No user with that email' })
        }

        try {
            if (await bcrypt.compare(password, user.password)) {
                return done(null, user)
            } else {
                return done(null, false, { message: 'Password incorrect' })
            }
        } catch (e) {
            return done(e)
        }
    }

    passport.use('instructor-auth', new LocalStrategy({ usernameField: 'email' }, authenticateUser))
    passport.serializeUser((user, done) => done(null, user.id))
    passport.deserializeUser(async (id, done) => {
        const user = await getUserById(id);
        return done(null, user)
    })
}

module.exports = {
    initializeStudent,
    initializeInstructor
};
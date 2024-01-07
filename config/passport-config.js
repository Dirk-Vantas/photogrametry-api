const LocalStrategy = require('passport-local').Strategy
const bcrypt = require('bcrypt')

function initialize(passport, getUserByName,getUserById) {
    const authenticateUser = async (username,password,done) => {
        const user = await getUserByName(username)
        if (user == null) {
            return done(null, false, {message: 'no user with that name found'})
        }
        const userOBJ = user[0]
    
        try {
            if (await bcrypt.compare(password, userOBJ.Passwort)) {
                console.log("shit worked")
                
                return done(null,userOBJ)
                
            } else {
                return done(null,false, {message: 'password incorrect'})
            }
        } catch (e) {
            return done(e)
        }
    }

    passport.use(new LocalStrategy({usernameField : 'username'},authenticateUser))
    passport.serializeUser((user,done) => done(null,user.ID))
    passport.deserializeUser(async (id, done) => {
        const user = await getUserById(id)
        const userOBJ = user[0]
        
        return done(null, userOBJ)
      })

}

module.exports = initialize
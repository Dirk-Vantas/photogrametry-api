const LocalStrategy = require('passport-local').Strategy
const bcrypt = require('bcrypt')

function initialize(passport, getUserByName,getUserById) {
    const authenticateUser = async (username,password,done) => {
        const user = await getUserByName(username)
        if (user == null) {
            return done(null, false, {message: 'username or password wrong'})
        }
        const userOBJ = user[0]
    
        try {
            //timing attack compare to mock password if user isnot found
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
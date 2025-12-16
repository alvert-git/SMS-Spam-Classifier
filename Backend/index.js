const express = require("express");
const app = express();
const dotenv = require("dotenv");
// NOTE: connectDB is likely redundant now. Prisma handles the connection.
// const connectDB = require("./config/connectDB"); 
// NOTE: User model is replaced by Prisma client
// const User = require("./models/users");
const jwt = require("jsonwebtoken");
const cors = require("cors");

// Import the single, shared Prisma Client instance
const prisma = require('./lib/prisma'); 

const authRoutes = require("./routes/authRoutes");

// login with google
const passport = require("passport");
const session = require("express-session");
const GoogleStrategy = require("passport-google-oauth20").Strategy;

// --- CONFIGURATION ---
dotenv.config();
const frontend_url = process.env.NEXT_PUBLIC_FRONTEND_URL;
const PORT = 9000;

// --- MIDDLEWARE ---

// Session Middleware (Required for Passport)
app.use(
  session({
    secret: "secret", // CHANGE THIS TO A SECURE SECRET IN PRODUCTION
    resave: false,
    saveUninitialized: true,
  })
);

app.use(express.json());
app.use(passport.initialize());
app.use(passport.session());

// CORS Middleware
app.use(
  cors({
    origin: frontend_url, 
    credentials: true, 
  })
);

// Static file serving (for uploads)
app.use('/uploads', express.static('./uploads'));

// --- PASSPORT GOOGLE STRATEGY (Mongoose calls replaced with Prisma) ---

// passport.use(
//   new GoogleStrategy(
//     {
//       clientID: process.env.Google_Client_ID,
//       clientSecret: process.env.Google_Client_secrets,
//       callbackURL: `${process.env.NEXT_BACKEND_URL}/auth/google/callback`,
//     },
//     async (accessToken, refreshToken, profile, done) => {
//       try {
//         const userEmail = profile.emails[0].value;
        
//         // 1. Search for a user with the Google ID (Prisma equivalent of User.findOne)
//         let user = await prisma.User_Spam.findUnique({
//             where: { googleId: profile.id }
//         });

//         if (user) {
//           // Case 1: Existing Google user. Authentication complete.
//           return done(null, user);
//         } else {
//           // 2. Search for a user with the same email (Potential local account)
//           user = await prisma.User_Spam.findUnique({
//               where: { email: userEmail }
//           });
          
//           if (user) {
//             // Case 2: Email Collision (Existing local user) -> LINK ACCOUNT
//             if (user.authMethods !== "google") {
              
//               // Prisma equivalent of Mongoose's user.googleId = X; user.authMethods = Y; user.save();
//               const updatedAuthMethods = user.authMethods 
//                                  ? `${user.authMethods},google` 
//                                  : 'google';
                                 
//               user = await prisma.User_Spam.update({
//                   where: { id: user.id },
//                   data: {
//                       googleId: profile.id,
//                       authMethods: updatedAuthMethods,
//                   }
//               });
              
//               console.log("Account linked successfully.");
//             }
//             // User found, proceed with authentication.
//             return done(null, user);

//           } else {
//             // Case 3: Brand new user -> Create the account
//             // Prisma equivalent of new User({...}).save();
//             const newUser = await prisma.User_Spam.create({
//                 data: {
//                     name: profile.displayName,
//                     googleId: profile.id,
//                     email: userEmail,
//                     profilePicture: profile.photos ? profile.photos[0].value : null,
//                     authMethods: "google",
//                     password:null,
//                     // NOTE: Ensure your schema has a default for 'password' or it's optional
//                 }
//             });

//             return done(null, newUser);
//           }
//         }
//       } catch (error) {
//         console.error("Error in Google Auth Strategy:", error);
//         return done(error, null);
//       }
//     }
//   )
// );

// --- PASSPORT SERIALIZATION (Mongoose calls replaced with Prisma) ---

// passport.serializeUser((user, done) => {
//   // Use the Prisma ID (which is likely 'id', not '_id')
//   done(null, user.id); 
// });

// passport.deserializeUser(async (id, done) => {
//   try {
//     // Prisma equivalent of User.findById(id)
//     const user = await prisma.User_Spam.findUnique({
//         where: { id: id }
//     });
    
//     done(null, user);
//   } catch (err) {
//     done(err, null);
//   }
// });

// --- ROUTES ---

// app.get(
//   "/auth/google",
//   passport.authenticate("google", { scope: ["profile", "email"] })
// );

// app.get(
//   "/auth/google/callback",
//   passport.authenticate("google", {
//     failureRedirect: frontend_url + "/auth/login",
//   }),
//   (req, res) => {
//     // Successful authentication
//     const payload = {
//       user_payload: {
//         // Use req.user.id (Prisma uses 'id') instead of req.user._id (Mongoose uses '_id')
//         id: req.user.id, 
//         // role: req.user.role, // Include if you have a role field
//       },
//     };

//     jwt.sign(payload, process.env.JWT_SECRET, (err, token) => {
//       if (err) {
//         console.log("Jwt Error", err);
//         return res.redirect(`${frontend_url}/auth/login`);
//       }
//       res.redirect(`${frontend_url}/user/dashboard?token=${token}`);
//     });
//   }
// );

app.get("/", (req, res) => {
  res.send("hello");
});


// --- ROUTE HANDLERS ---
app.use("/api/auth", authRoutes);


app.listen(PORT, () => {
  console.log(`server is running on ${PORT}`);
});

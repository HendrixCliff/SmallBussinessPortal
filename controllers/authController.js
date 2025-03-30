const util = require("util")
//const validator = require("validator")
const jwt = require("jsonwebtoken")
const User = require("./../models/userSchema")
const asyncErrorHandler = require("./../Utils/asyncErrorHandler")
const passport = require("./../passportConfig")
const dotenv = require("dotenv")
const CustomError = require("./../Utils/CustomError")
dotenv.config({path: "./config.env"})


const signToken = id => {
    
    if (!process.env.SECRET_STR) {
        throw new Error('Missing SECRET_STR in environment variables');
    }
        const secret = process.env.SECRET_STR; 
        return jwt.sign({ id: id }, secret, {
            expiresIn: process.env.LOGIN_EXPIRES || '1h', // Add default expiry
        });
    };

    function getMaxAge() {
        const maxAge = parseInt(process.env.LOGIN_EXPIRES, 10);
        if (isNaN(maxAge)) {
          throw new Error('LOGIN_EXPIRES environment variable is not a valid number');
        }
        return maxAge;
      }
      const createSendResponse = (user, statusCode, res) => {
        try {
            const token = signToken(user._id); // Generate JWT
            const maxAge = getMaxAge(); // Get maxAge for cookie
           const cookie = token
           const options = {
            maxAge,
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production', // Only secure in production
            sameSite: process.env.NODE_ENV === 'production' ? 'none' : 'lax',
        };
        
        res.cookie('authToken', token, options);
    
            console.log('🔐 Someone Just Logged In:', user.email || user._id);
    
            res.cookie('authToken', token, options);
    
            // Remove sensitive data before sending user info
            const userResponse = user.toObject ? user.toObject() : { ...user };
            delete userResponse.password;
    
            res.status(statusCode).json({
                status: 'success',
                token,
                cookie,
                data: { user: userResponse },
            });
        } catch (err) {
            console.error('❌ Token creation failed:', err.message);
            res.status(500).json({
                status: 'error',
                message: 'Internal server error during token creation',
            });
        }
    };
    
    



    exports.signup = asyncErrorHandler(async (req, res, next) => {
      try {
        const { name, email, password, confirmPassword,country, phoneNumber } = req.body;
    
        // Validate input
        if (!name || !email || !password) {
          return res.status(400).json({ error: 'All fields are required!' });
      }
    

  
       // if (!validator.isEmail(email)) {
        //   return next(new CustomError("Invalid email address", 400));
        // }
    
       // if (!validator.isMobilePhone(phoneNumber)) {
        //   return next(new CustomError("Invalid phone number", 400));
        // }
    
        if (password !== confirmPassword) {
          return res.status(400).json({ message: "Passwords do not match" });
        }
    
        // Check if user already exists
        const existingUser = await User.findOne({ email });
        if (existingUser) {
          return next(new CustomError("Email is already in use", 409));
        }
    
        // Create user
        const user = await User.create({
          name,
          email,
          password,
          phoneNumber,
          country,
          date: new Date(),
        });
    
        // Automatically log in the user after signup
        req.login(user, (err) => {
          if (err) {
            return next(new CustomError("Logging after signup failed", 500));
          }
          createSendResponse(user, 201, res);
        });
      } catch (error) {
        console.error("Error during signup:", error);
        return next(new CustomError("Signup failed", 500));
      }
    });
    
    
    exports.login = async (req, res, next) => {
      console.log("🔍 Received login request:", req.body);
    
      const { email, password } = req.body;
    
      if (!email || !password) {
        return res.status(400).json({ message: "Email and password are required" });
      }
    
      passport.authenticate("local", (err, user, info) => {
        if (err) return next(err);
        if (!user) {
          console.warn("❌ Authentication failed:", info);
          return next(new CustomError(info?.message || "Invalid credentials", 400));
        }
        console.log("Entered Password:", password);
        console.log("Stored Hashed Password:", user.password);
        req.login(user, (err) => {
          if (err) return next(err);
        
          createSendResponse(user, 200, res);
        });
      })(req, res, next);
    };
    
    
    
    exports.protect = asyncErrorHandler(async (req, res, next) => {
   
        const testToken = req.headers.authorization
        let token;
        if (testToken && testToken.startsWith("Bearer")) {
            token = testToken.split(" ")[1] 
          
        }
        console.log(token)
        
        if (!token) {
          return  next(new CustomError("You are not logged in", 401))
        }
    
         let decodedToken 
         try {
            const verifyToken = util.promisify(jwt.verify);
            decodedToken = await verifyToken(token, process.env.SECRET_STR);
            console.log('Decoded Token:', decodedToken);
        } catch (err) {
            return res.status(401).json({ message: 'Invalid or expired token' });
        }
        
         
        
        let user 
        
        try {
            user = await User.findById(decodedToken.id);
            if (!user) {
                return res.status(404).json({ message: 'User not found' });
            }
            console.log('User:', user);
        } catch (err) {
            return res.status(500).json({ message: 'Error fetching user', error: err.message });
        }
        if (!user) {
          return next(new CustomError("The user with the token does not exist", 401))
        }  
        
        const isPasswordChanged =  user.isPasswordChanged(decodedToken.iat)  
        if (isPasswordChanged) {
          return next(new CustomError("User has changed his password. Please log in again", 401))
          } 
        req.user = user;
        next()
        
        })

    exports.restrict = (role) => {
        return (req, res, next) => {
            if (req.user.role !== role) {       
                return next(new CustomError("You do not have permission to perform this action", 403))
            }
            next()
        }
    }

  

    exports.verifyAdmin = (req, res, next) => {
    try {
        // Get token from headers
        const token = req.headers.authorization?.split(" ")[1];
        if (!token) return res.status(403).json({ error: "Access denied. No token provided." });

        // Verify and decode token
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        
        // Check if user has admin role
        if (decoded.role !== "admin") {
        return res.status(403).json({ error: "Access denied. Admins only." });
        }

        req.user = decoded; // Attach decoded user info to request
        next(); // Proceed to the route handler
    } catch (error) {
        return res.status(401).json({ error: "Invalid or expired token." });
    }
    };

    exports.verifyUserOrAdmin = (req, res, next) => {
        try {
          // Get token from headers
          const token = req.headers.authorization?.split(" ")[1];
          if (!token) return res.status(403).json({ error: "Access denied. No token provided." });
      
          // Decode token
          const decoded = jwt.verify(token, process.env.JWT_SECRET);
          req.user = decoded;
      
          const { userId, adminId } = req.params;
      
          // If the requester is an admin, allow access
          if (decoded.role === "admin") return next();
      
          // If the requester is a normal user, they can only access their own messages
          if (decoded.id === userId) return next();
      
          return res.status(403).json({ error: "Access denied. You can only access your own messages." });
        } catch (error) {
          return res.status(401).json({ error: "Invalid or expired token." });
        }
      };

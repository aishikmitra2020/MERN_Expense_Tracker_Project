const jwt = require("jsonwebtoken");
const User = require('../models/User');

exports.protect = async (req, res, next) => {
    /*
    2. '?.' (Optional Chaining)
    This is optional chaining. It’s a feature in JavaScript that prevents errors when accessing properties of an object that might be undefined or null.

    Without optional chaining, if req.headers.authorization is undefined, the code would throw an error. But with ?., if req.headers.authorization is not present (i.e., it's undefined or null), the code won't break and will return undefined.

    req.headers.authorization might look like:
    "Bearer abc123xyz"

    SO splitting them it by space gives us ["Bearer", "abc123xyz"] and the 1st index gives us the actual token.
    */
    let token = req.headers.authorization?.split(" ")[1];

    if(!token) return res.status(401).json({ message: 'Not Authorized' });

    try{
        // '.select('-password') is used to exclude the password field from being returned.
        // and if - is not present before the field name like 'email password' then it will include that field. Note: we can exclude and include as many fields as we want.
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        req.user = await User.findById(decoded.id).select('-password');
        next();
    } catch(err){
        return res.status(401).json({ message: 'Not Authorized' });
    }
};
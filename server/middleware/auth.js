require('dotenv/config')
const jwt = require('jsonwebtoken');

module.exports = async function(req, res, next) {
  // Get token from header
	const bearer = req.headers.authorization

	if (!bearer || !bearer.startsWith('Bearer ')) {
		return res.status(401).end()
	}

	const token = bearer.split('Bearer ')[1].trim()

  // Check if not token
  if (!token) {
    return res.status(401).json({ msg: 'No token, authorization denied' });
  }

  // Verify token
  try {
		await jwt.verify(token, process.env.JWT_SECRET,  (error, decoded)=>{
      if(error){
        res.status(401).json({ msg: 'Token is not valid' });
      }
      else{
        req.user = decoded.user;
        next();
      }
    });
  } catch (err) {
    console.error('something wrong with auth middleware')
    res.status(500).json({ msg: 'Server Error' });
  }
};

const newToken = user => {
	return jwt.sign({id: user.id}, config.secrets.jwt, {
		expiresIn: config.secrets.jwtExp
	})
}
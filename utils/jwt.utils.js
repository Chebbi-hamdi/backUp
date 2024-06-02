const jwt = require('jsonwebtoken')

const JWT_TOKEN_SECRET='LsqSp6YQZD0i7qnDyagjPWjlNTYuDofvU9zKse3n2XGzo1ty6iR3zWOy4SKbn/G2To2u8lWpVyoDcQDEGFhxtw=='
const JWT_ACTIVATE_ACCOUNT='e3n2XGzo1ty6iR3zWOy4SKbn/G2To2VyoDcQDEGFhxtw=='

const generateJWT = (user) => {
	return jwt.sign(
		{
			id:user._id.toString(),
			username: user.username || 'username',
			email: user.email.primary || user.email_gerant,
		},
		JWT_TOKEN_SECRET,
		{
			expiresIn: "7d"
		}
	)
}

const generateRefreshJWT = (user) => {
	return jwt.sign(
		{
			id:user._id.toString()
		},
		process.env.JWT_TOKEN_SECRET,
		{
			expiresIn: "7d"
		}
	)
}

const verifyJWT = (token) => {
	return jwt.verify(token, process.env.JWT_TOKEN_SECRET)
}

const recoveryJWT = (user) => {
	return jwt.sign(
		{id: user.id},
		process.env.JWT_RESET_ACCOUNT,
		{expiresIn: process.env.JWT_RESET_ACCOUNT_DURATION}
	)
}

const verifyRecoveryJWT = (token) => {
	return jwt.verify(token, process.env.JWT_RESET_ACCOUNT)
}

const enableAccJWT = (user) => {
	return jwt.sign(
		{name: user.email.primary},
        JWT_ACTIVATE_ACCOUNT,
		{expiresIn: '1d'}
	)
}

const verifyEnableAccJWT = (token) => {
	return jwt.verify(token, process.env.JWT_ACTIVATE_ACCOUNT)
}

const getJWTPayload = (token) => {
	return jwt.decode(token, process.env.JWT_TOKEN_SECRET)
}

module.exports = {
	generateJWT,
	verifyJWT,
	generateRefreshJWT,

	recoveryJWT,
	verifyRecoveryJWT,

	enableAccJWT,
	verifyEnableAccJWT,
	getJWTPayload
}
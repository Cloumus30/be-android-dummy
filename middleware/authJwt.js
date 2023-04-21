require('dotenv').config()
const jwt = require('jsonwebtoken');
const { User }  =require('../models/index');

const auth = async (req, res, next) =>{
    try {
        const authorization = req.get('Authorization');
        if(authorization){
            const token = authorization.split(' ')[1];
            const secret = process.env.JWT_SECRET;
            const decoded = jwt.verify(token, secret);
            if(decoded){
                const user = await User.findOne({
                    where:{
                        id: decoded.sub,
                    },
                    attributes: ['name', 'email', 'createdAt', 'updatedAt']
                });
                req.body.user = user;
                return next()
            }
        }
        res.status(403).json({
            message : 'Unauthorized',
            errors : ['Token Need Provided']
        });    
    } catch (error) {
        console.log(error);
        return res.status(500).json({
            errors: [error]
        });
    }
    
}

module.exports = auth;
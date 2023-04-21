require('dotenv').config()
const { string, object, ValidationError } = require('yup');
const {User} = require('./../models/index');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');


const listUser = async (req,res)=>{
    const users = await User.findAll({
        attributes:['name', 'email', 'createdAt', 'updatedAt']
    });
    return res.json({
        message: 'Success List User Update',
        data: users
    });
}

const detailUser = async (req,res) =>{
    const id = req.params.id;
    const user = await User.findOne({
        where:{
            id
        },
        attributes:['name', 'email', 'createdAt', 'updatedAt']
    });
    
    return res.json({
        message: 'Success Get User',
        data: user
    });
}

const register = async (req, res) => {
    try {
        const validation = object({
            "name" : string().nullable(),
            'email' : string().required(),
            'password' : string().required(),
        })
        const data = await validation.validate(req.body);
    
        const salt = bcrypt.genSaltSync(10);
        data.password = bcrypt.hashSync(data.password, salt);

        const user = await User.create(data);
        return res.json({
            message: 'Success Register User'
        });    
    } catch (error) {
        // Validation Yup Error 
        if(error instanceof ValidationError){
            return res.status(400).json({errors : error.errors});
        }
        return res.status(500).json({errors : error});
    }
}

const login = async (req,res) => {
    try {
        const validation = object({
            'email' : string().required(),
            'password' : string().required(),
        })
        const data = await validation.validate(req.body);

        const user = await User.findOne({
            where: {
                email: data.email,
            }
        });
        
        if(user){
            const checkedPass = bcrypt.compareSync(data.password, user.password);
            if(checkedPass){
                const token = jwt.sign({sub:user.id}, process.env.JWT_SECRET);
                return res.json({
                    access_token: token,
                    user: {
                        name: user.name,
                        email : user.email,
                    }
                })
            }
        }

        return res.status(403).json({
            errors: [
                'Credetential Not Found'
            ]
        });

    } catch (error) {
        // Validation Yup Error 
        if(error instanceof ValidationError){
            return res.status(400).json({errors : error.errors});
        }
        return res.status(500).json({errors : error});
    }
}

module.exports = {
    listUser,
    detailUser,
    register,
    login
}
const express = require('express')
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')
const speakeasy = require('speakeasy')
const qrcode = require('qrcode')


const userModel = require('../models/user');

const router = express.Router();





//********************************************************************************** */

router.post('/signup', async (req, res) => {

    let name = req.body.name
    let email = req.body.email
    let password = req.body.password

    const isPresent = await userModel.findOne({ email: email })

    if (isPresent) {

        return res.status(400).send({
            message: "Email is already registered"
        })

    } else {

        const salt = await bcrypt.genSalt(10)
        const hashedPassword = await bcrypt.hash(password, salt)

        const secretKey = speakeasy.generateSecret({
            name: 'GCU-CMS'
        })

        const user = new userModel({
            name: name,
            email: email,
            password: hashedPassword,
            secretKey: secretKey
        })

        const result = await user.save()

        const { _id } = await result.toJSON();
        const token = jwt.sign({ _id: _id }, 'iamthesecret')
        res.cookie('jwt', token, {
            httpOnly: true,
            maxAge: 24 * 60 * 60 * 1000 // 1 day
        })

        res.send({
            message: 'success'
        })

    }

})



//**************************************************************************************** */


router.get('/qrcode', async (req, res) => {

    try {

        const cookie = req.cookies['jwt'];

        const claims = jwt.verify(cookie, 'iamthesecret')
        if (!claims) {
            return res.status(401).send({
                message: 'Unauthenticated'
            })
        }

        const user = await userModel.findOne({ _id: claims._id });

        const secretKey = user.secretKey;

        qrcode.toDataURL(secretKey.otpauth_url, (err, data) => {
            if (err) throw err;
            // console.log(data);
            res.send({ qrCodeString: data });

        })

    } catch (error) {
        console.log(error);
    }

})


router.post('/qrcode/verify', async (req, res) => {

    try {

        const code = req.body.verificationCode;

        const cookie = req.cookies['jwt'];

        const claims = jwt.verify(cookie, 'iamthesecret')
        if (!claims) {
            return res.status(401).send({
                message: 'Unauthenticated'
            })
        }

        const user = await userModel.findOne({ _id: claims._id });

        const secretKey = user.secretKey;

        let authenticated = speakeasy.totp.verify({
            secret: secretKey.ascii,
            encoding: 'ascii',
            token: code
        })

        // console.log(authenticated);

        if (authenticated) {
            res.send({
                message: 'success'
            })
        } else {
            res.send({
                message: 'Verificaion code in Wrong'
            })
        }



    } catch (error) {
        console.log(error);
    }
})



//******************************************************************************************* */


router.post('/login', async (req, res) => {

    const user = await userModel.findOne({ email: req.body.email })

    if (!user) {
        return res.status(404).send({
            message: "User not Found"
        })
    }

    const isPasswordCorrect = await bcrypt.compare(req.body.password, user.password);
    if (!isPasswordCorrect) {
        return res.status(400).send({
            message: 'Password is Incorrect'
        })
    }


    const secretKey = user.secretKey;
    const code = req.body.verificationCode

    let authenticated = speakeasy.totp.verify({
        secret: secretKey.ascii,
        encoding: 'ascii',
        token: code
    })

    // console.log(authenticated);

    if (!authenticated) {
        res.send({
            message: 'Verificaion code in Wrong'
        })
    }


    const token = jwt.sign({ _id: user._id }, 'iamthesecret');

    res.cookie('jwt', token, {
        httpOnly: true,
        maxAge: 24 * 60 * 60 * 1000
    })

    res.send({
        message: 'success'
    })


})


//********************************************************************************************* */


router.get('/user', async (req, res) => {

    try {

        const cookie = req.cookies['jwt'];

        const claims = jwt.verify(cookie, 'iamthesecret')
        if (!claims) {
            return res.status(401).send({
                message: 'Unauthenticated'
            })
        }

        const user = await userModel.findOne({ _id: claims._id });

        const { password, ...data } = await user.toJSON()

        res.send(data)

    } catch (error) {

    }

})

//*********************************************************************************************/

// router.get('/home', async (req, res) => {

//     try {

//         const cookie = req.cookies['jwt'];

//         const claims = jwt.verify(cookie, 'iamthesecret')
//         if (!claims) {
//             res.redirect('/login')
//         }else{
//             res.redirect('/home')
//         }

//     } catch (error) {
//         console.log(error);
//     }

// })



//******************************************************************************************* */


router.post('/logout', (req, res) => {

    res.cookie("jwt", "", { maxAge: 0 })

    res.send({

        message: 'success'
    })
})

module.exports = router


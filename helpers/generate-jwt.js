/**
 * 
 *  Fns helpers para la gestion de JSONWEBTOKEN
 */

const jwt = require('jsonwebtoken');

const generateJWT = ( uid = '' )=> {
    return new Promise ( (resolve, reject )=> {

        const payload = { uid };

        jwt.sign( payload, process.env.SECRET_OR_PRIVATE_KEY, {
            expiresIn: '4h'
        }, (err, token)=> {

            if(err){
                console.log(err);
                reject('Problemas al generar Token');
            } else {
                resolve( token );
            }

        });
    }) 
}

module.exports = {
    generateJWT
}
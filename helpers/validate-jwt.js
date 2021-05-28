/**
 * 
 *  Middleware personalizado 
 *  Este archivo validara los JSON WEB TOKENS
 * 
 *  * request.header > aqui se recogera los headers q se recuperara de la peticiones
 *         hechas desde el cliente o postman y lo llamaremos desde ahi "x-token" *custom token
 * 
 *  ** Object JWT valido > al validarlo devolvera un ibj con 3 propiedades
 *      - uid: id del usuario
 *      - iat: fecha en numeros en q se creo el token
 *      - exp: y la fecha de expiracion
 *      
 * 
 */
const jwt = require('jsonwebtoken'); 
const User = require('../models/user.model');

const validateJWT = async(req, res, next)=>  {

    const token = req.header('x-token'); // * custom token
    // si el token no es enviado o no existe
    if(!token){
        return res.status(401).json({
            msg: 'No hay token en la peticion'
        })
    }

    try{
        // verify > verificar si es un token si no es manipulado o expiro
        // ** Object JWT valido 
        const { uid, iat, exp } = jwt.verify( token, process.env.SECRET_OR_PRIVATE_KEY );
        // lo guardamos en la request para q lo reciba el Controller recordemos q la "request"
        // se comparte y es el mismo "request" para todos osea q se pasa por referencia
        // como parametro por defecto en middlewares y controladores y de ahi se obtiene
        const userFinded = await User.findById(uid);
        // si el user no fue encontrado
        if( !userFinded ){
            return res.status(401).json({
                msg: 'Token no Valido | El usuario no existe en la DB'
            })
        }

        // verficar si buestro usuario esta dado de Alta y no se dio de baja "state: true | false"
        if( !userFinded.state ){
            return res.status(401).json({
                msg: 'Token no Valido | El usuario no puede realizar esta operacion se dio de BAJA '
            })
        }
        req.userLogged = userFinded;

        next();

    } catch(err){
        console.log(err);
        res.status(401).json({
            msg: "EL Token no es valido"
        })
    }
}

module.exports = {
    validateJWT
}
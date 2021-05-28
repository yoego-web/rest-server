/**
 *  Middleware
 *  para verificar los "role" de los usuarios 
 *  osea si tiene privilegios de ADMIN | USER
 *  
 * 
 */

// Verificar si el usuario tiene privilegios de ADMIN
const isAdminRole = (req, res, next)=> {
    // userLogged > lo seteamos en el middleware "validate-jwt" en la carpeta helpers
    if( !req.userLogged ){
        return res.status(500).json({
            msg: 'El ROLE no se puede verificar, si el usuario no se logeo correctamente'
        })
    }
    const { role, name } = req.userLogged;

    if( role !== 'ADMIN_ROLE'){
        return res.status(401).json({
            msg: `${ name } no tiene privilegios de ADMIN`
        })
    }

    next();
}

// Verificar si tiene un "role" en especifico retornamremos un fn middleware
// con los argumentos requeridos para un middleware o un controlador sino da error
// ...roles > actua como "arguments" pero devueleve un array con todos los parametros
const userHasRole = ( ...roles )=> {
    return (req, res, next) => {
        // si el usuario no esta logeado o las fn no estan en orden de validacion
        if( !req.userLogged ){
            return res.status(500).json({
                msg: 'Se quire verificar ROLE sin validar el token primero'
            })
        }

        // buscamos en el array el "role" especifico 
        if( !roles.includes( req.userLogged.role ) ){
            return res.status(401).json({
                msg: `${ roles.toString() } no se encuentra coincidencia con ninguno de los roles ingresados`
            })
        }

        next();
    }
}

module.exports = {
    isAdminRole,
    userHasRole
}

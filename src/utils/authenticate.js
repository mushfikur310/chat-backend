import bcrypt from 'bcrypt';


//Check if password hash is matched or not.
const checkHashedPassword = (password,hash) => bcrypt.compareSync(password,hash);

//create hash password.
const createHashPassword = (password) => bcrypt.hashSync(password,bcrypt.genSaltSync(10),null);

export {checkHashedPassword,createHashPassword};
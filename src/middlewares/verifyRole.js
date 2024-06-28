const verifyRole = (allowedRoles) => {
  return (req, res, next) => {
    if(allowedRoles.includes(req.user.role)){
        next();
    }else{
        res.status(STATUSCODE.ROLE_NOT_MATCHED).json({message:'Forbidden'})
    }
  };
};

module.exports = verifyRole;

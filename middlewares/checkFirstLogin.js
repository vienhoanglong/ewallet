module.exports = (req, res, next) =>{
    if(!req.session.account.firstLogin){
        return next();
    }
    return res.redirect('/changePassword')
}
module.exports = (req, res, next)=>{
    if(!req.session.account){
        return res.redirect('/')
    }
    if(req.session.account.role === 'user'){
        
        return next()
    }
    return res.redirect('/admin')

}

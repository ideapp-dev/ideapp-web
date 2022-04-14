const isLoggedIn = (req, res, next) => {
    if (!req.isAuthenticated()) {
        //req.session.returnTo = req.originalUrl
        req.flash('error', 'You must be signed in first!');
        return res.redirect('/login');
    }
    next();
}

const isExamTimeOn = function(examObj){
    var start = new Date(examObj.start_time).getTime();
    var now = new Date().getTime();
    var distance =  start - now;

    if(distance > 0)
        return false;
    else
        return true;
}

const isExamTimeEnd = function(examObj){
    var end = new Date(examObj.end_time).getTime();
    var now = new Date().getTime();
    var distance =  end - now;

    if(distance > 0)
        return false;
    else
        return true;
}


module.exports = {
    isLoggedIn,
    isExamTimeOn,
    isExamTimeEnd
};
exports.index = (req, res) => {
    //renderiza o index.ejs e manda como valor para csrfToken: res.locals.csrfToken
    res.render('index', {
        csrfToken: res.locals.csrfToken
    });
    
}


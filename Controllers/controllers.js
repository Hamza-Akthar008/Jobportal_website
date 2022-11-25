exports.register=  (req,res)=>
{
    (req, res, next) => {
        var JOBNAME = req.body.JOBNAME;
        var JOBTPYE = req.body.JOBTYPE;
        var CATEGORY = req.body.CATEGORY;
        var CITY = req.body.CITY;
        var COUNTRY = req.body.COUNTRY;
        var MIN_SAL = req.body.MIN_SAL;
        var MAX_SAL = req.body.MAX_SAL;
        var PUBLISHER = "Admin";
        var JOBIMG = fn;
        var query = "INSERT INTO `job`( `JOBIMG`, `JOBTYPE`, `JOBNAME`, `PUBLISHER`, `CATEGORY`, `CITY`, `COUNTRY`, `MIN_SAL`, `MAX_SAL`) VALUES ('" + JOBIMG + "','" + JOBTPYE + "','" + JOBNAME + "','" + PUBLISHER + "','" + CATEGORY + "','" + CITY + "','" + COUNTRY + "','" + MIN_SAL + "','" + MAX_SAL + "')";
    
        con.query(query, (error, result) => {
            if (error) throw error
            else {
    
                res.redirect("/Registration");
    
    
            }
        })
    }
}

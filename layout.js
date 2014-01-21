var config=require("./config");

const WORKPATH=config.WORKPATH;

module.exports={
			baseLayout : {
				header:WORKPATH+"includes/header.html",
				body:"",
				pageScript:"",
				footer:WORKPATH+"includes/footer.html"
			}
		};

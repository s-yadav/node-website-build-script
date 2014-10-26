/*
 *Node build script 1.0.0
 *Author: Sudhanshu Yadav
 *github.com/s-yadav
 *Copyright (c) 2014 Sudhanshu Yadav.
 *Under MIT licenses
 */
 
var less = require("less"),
	fs = require( 'fs-extra' ),
	fileUtils=require("./fileUtils"),
	utils=require("./utils"),

	defaultOptn={
			
	};


var lessUtils={
	/*
	 * Compile less file to css file
	 * 
	 * Accept objects defining src , dest 
	 * src : source less file to be compiled on destination file
	 * dest : Destination css file where less will be compiled
	 * minify : A flag to tell weather to compress css or not
	 * ** Multiple objects can be passed
	 */
	compile:function(/* multiple object as parameters */){
		var arg=utils.objToAry(arguments);

		arg.forEach(function(obj){
				var optn=utils.mergeObj({},defaultOptn,obj),
					src=optn.src,
					dest=optn.dest;
				//read less data 
				var lessData=fs.readFileSync(src).toString();
		
				//compile less data
				less.render(lessData,{compress:obj.minify}, function (e, css) {
					if(e){
					 	console.log('\033[31m '+JSON.stringify(e)+' \033[39m'); 
					 	return;
					}
					fileUtils.writeFile(dest,css);	
				});
			
			});
			
	}
}


module.exports=lessUtils;
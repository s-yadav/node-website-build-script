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
					parser = new(less.Parser),
					dest=optn.dest;
				//read less data 
				var lessData=fs.readFileSync(src).toString();
		
				parser.parse(lessData, function (e, tree) {
					if(e) console.log('\033[31m '+e+' \033[39m');;
					var css = tree.toCSS({ compress: obj.minify }); // Minify CSS output
					 fileUtils.writeFile(dest,css);				
				})
				//comple less data
				less.render(lessData, function (e, css) {
				});
			
			});
			
	}
}


module.exports=lessUtils;
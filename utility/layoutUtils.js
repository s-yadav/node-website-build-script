var fileUtils=require("./fileUtils"),
	utils=require("./utils"),
	config=require("../config"),
	//default layou pages
	handlebars=require('./handlebarUtils'),
	defaultLayout=require("../layout"),

	parseRegex=/<\?\?\s*(include|layout)\s*\(\s*["'](.*)["']\s*\)\s*\?\?>/g;




/* function to parse layout and return html	
 * 
 * Key on option
 * 
 * src : src path of file
 * layout : a layout object containing path which will be used on layout method
 * html : if src path is not specified also can pass html which will be parsed instead
 */	
function parseLayout(option){
		var src = option.src,
			layout = option.layout || {},
			html = src? fs.readFileSync(option.src).toString() : (option.html || "");
		
		
		//include files
		html=html.replace(parseRegex,function(match ,func, path){
				var pageHtml;
					if(func=="include"){
						pageHtml=fs.readFileSync(config.WORKPATH+path).toString();
					}
					else if(layout[path]){						
						pageHtml=fs.readFileSync(layout[path]).toString();
					}
				//recursively compile html which is included
				pageHtml = parseLayout({
						html : pageHtml,
						layout : layout
					});
				
				
				return pageHtml;
			});
		
		return html;

	}		

var layoutUtil={
	/*
	 * to compile layouts into a destination file
	 * 
	 * Accept objects defining src, dest, layout, templateData, extend
	 * src * : Layout path which you want to parse
	 * dest *: Destination file path where compiled html will be written
	 * layout (optional) : An object containing layout information
	 * templateData (optional): object containing all template data
	 * extend (optional) : name of predifined layout structure if you want to extend through it
	 */
	
	compile:function(/* multiple object as parameters */){
    	var arg=utils.objToAry(arguments);
    	arg.forEach(function(obj){
			var src = obj.src,
				dest = obj.dest,
				layout = obj.layout || {},
				templateData = obj.templateData,
				extend = obj.extend;
			
				
			if(extend){
					layout=utils.mergeObj({},defaultLayout[extend],layout);
				}
			
			//parse layout html
			var html=parseLayout({
					src : src,
					layout:layout,
					templateData : templateData
				});		
			
			html = handlebars.compile(html)(templateData);
			//write result on file
			fileUtils.writeFile(dest,html);	
		});
	}
}


module.exports=layoutUtil;
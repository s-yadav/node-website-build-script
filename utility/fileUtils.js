/*
 *Node build script 1.0.0
 *Author: Sudhanshu Yadav
 *github.com/s-yadav
 *Copyright (c) 2014 Sudhanshu Yadav.
 *Under MIT licenses
 */
// settings
var FILE_ENCODING = 'utf-8',
    EOL = '\n';
 
// Module loading
var fs = require('fs-extra'),
	uglyfyJS = require('uglify-js'),
	utils=require("./utils"),
	handlebars=require('handlebars');
 
//copy a content of source file to destination file
 

var fileUtils={
    //to concat js files and add on destination file
    /* 
     * Accept objects defining src , dest and minify
     *
     * src : all src file in array
     * dest : destination file in which concanitated will be written
     * minify : a flag to tell weather to minfy js files
     */
    concatJs:function(/* multiple object as parameters */){
        var arg=utils.objToAry(arguments);
        arg.forEach(function(obj){
	         var fileList = obj.src,
	            distPath = obj.dest,
	            minify=obj.minify,
	            out = fileList.map(function(filePath){
	                var fileContent=fs.readFileSync(filePath).toString();
	                if(minify){
	                    fileContent = fileUtils.minifyJs({data:fileContent});
	                }
					
	                return fileContent + ';';
	            });
				
				fileUtils.writeFile(distPath,out.join(EOL));	        
       	
        });

    },
	//write data to a file
	/*
	 *	file : file path
	 *	data : data which need to be written
	*/
	writeFile:function(file,data){
			fs.createFileSync(file);
			
		 	fs.writeFileSync(file, data );
			
			console.log('\033[32m'+file+' successfully written with data \033[39m');
		},
    /*
     * to mininfy js file
     * keys in option
     * src : src file which you want to minfy
     * dest : dest file you want to put minifed string
     * data : if want to minify a string pass that string in data instead of src
     * 
     * Return 
     * minified string
     */
    minifyJs:function(option){
	    var srcPath=option.src,
            distPath=option.dest,
            data=option.data,
            jsp = uglyfyJS.parser, // js parser function
            pro = uglyfyJS.uglify,
            ast=data ? jsp.parse(data) : jsp.parse( fs.readFileSync(srcPath, FILE_ENCODING) ),
            minfied;
         
        ast = pro.ast_mangle(ast);
        ast = pro.ast_squeeze(ast);
        minfied=pro.gen_code(ast);

        if(distPath){
            fileUtils.writeFile(distPath,minfied);
        }

        return minfied;
    },
    
    /*
     * TO get html from src file and apply teplate if provided
     * 
     * keys in options
     * src : src file from where you want html
     * templateData : data which you want to put on templates
     * 
     * Return
     * Html data
     * (If template flag and template data is provided it return compile HTML) 
     */
    getHtml:function(option){
    	var tempData = option.templateData,
    		src=option.src,
    		fileContent=fs.readFileSync(src).toString();
    	
    	//if template is provided compile with handlebar
    	if(tempData){
	    	var templateFunc=handlebars.compile(fileContent);		    	
	    	return templateFunc(tempData);
    	}

    	return fileContent;
    },
    
	/*
	 * to get data of specified file
	 * file : file path of which you want data
	 */
	 getData:function(file){
		 	return fs.readFileSync(file).toString();
		 },
	
	/*
	 * Copy all files from a folder or specified files to a folder
	 * 
	 * Accept objects defining srcFile , srcFolder and destFolder
	 * srcFile : can be path of a single file or array of file path
	 * srcFolder : folder path from which all files will be copied to destination folder 
	 * destFolder : Destination folder where file will be copied
	 * 
	 * ** Multiple objects can be passed
	 */
    copy:function(/* multiple object as parameters */){
    	var arg=utils.objToAry(arguments);
    	arg.forEach(function(obj){
     		if(!obj.destFolder){
					console.log('\033[31m No destination folder is specified to copy '+obj.srcFile.join()+' \033[39m');
					return;
				}
			if(obj.srcFolder){
				fs.copySync(obj.srcFolder, obj.destFolder);
    		}
    		if(obj.srcFile){
    			var srcFile=obj.srcFile;
				if(typeof srcFile === "string"){
					srcFile=[srcFile];
				}
				
				srcFile.forEach(function(val){
						var fileName=val.split('/').pop(),
							data=fs.readFileSync(val);
						
						fileUtils.writeFile(obj.destFolder+'/'+fileName,data);
					});	
    		}
   		
    	});
     }
}

 
module.exports=fileUtils;
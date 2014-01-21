var http=require("http"),   
	config=require("./config");
	fileUtils=require("./utility/fileUtils"),
	fs=require("fs"),
	lessUtils = require("./utility/lessUtils"),
	watch=require("watch")
	layoutUtil = require("./utility/layoutUtils.js");

//to start a server
http.createServer(function(){}).listen(1337, '127.0.0.1');


//deployment environment specific code
const environment=config.ENVIRONMENT,
	BUILDPATH=config.BUILDPATH,
	WORKPATH=config.WORKPATH;
var	globalSetting={};
if(environment=="production"){
	globalSetting.minify=true;
}
else{
	globalSetting.minify=false;
}


//All build scripts written inside this function
function build(){
	//Concatinating and minifying all common js files and libraries
	fileUtils.concatJs({
		src:[
			WORKPATH+"assets/js/jquery.js",			
			WORKPATH+"assets/js/bootstrap.js",			
			WORKPATH+"assets/js/modalBox.js",
			WORKPATH+"assets/js/contextMenu.js",
			WORKPATH+"assets/js/base.js"
		],
		dest:BUILDPATH+"assets/js/base.js",
		minify:globalSetting.minify
	},
	//to copy other js files and minify them(page specifi js files)
	{
		src:[
			WORKPATH+"assets/js/home.js",
		],
		dest:BUILDPATH+"assets/js/home.js",
		minify:globalSetting.minify
	},
	//for other project page
	{
		src:[
			WORKPATH+"assets/js/projects.js",
		],
		dest:BUILDPATH+"assets/js/projects.js",
		minify:globalSetting.minify
	});
	
	



	var projectsData= JSON.parse(fileUtils.getData(WORKPATH+"data/projects.json"));
	
	//to create layouts
	//create index page
	layoutUtil.compile({
			layout:{
					body:WORKPATH+"home.html",
					pageScripts:WORKPATH+"includes/homeScript.html",
				},
			templateData:{
				title:"Demo project",
				active:"Home",
				pageCss:"assets/css/home.css"
			},
			src :WORKPATH+"layout.html",
			dest:BUILDPATH+"index.html",
			extend: "baseLayout"
		},
	//create projects page
		{
			layout:{
					body:WORKPATH+"projects.html",
					pageScripts:WORKPATH+"includes/homeScript.html",
				},
			templateData:{
				title:"Other projects",
				projects:projectsData.projects,
				active:"Other",
				pageCss:"assets/css/project.css"
			},
			src :WORKPATH+"layout.html",
			dest:BUILDPATH+"project.html",
			extend: "baseLayout"
		},		
	//create page1
		{
			layout:{
					body:WORKPATH+"page1.html"
				},
			templateData:{
				title:"Demo page",
				active:"Page1"
			},
			src :WORKPATH+"layout.html",
			dest:BUILDPATH+"page1.html",
			extend: "baseLayout"
		},		
	//create page2
		{
			layout:{
					body:WORKPATH+"page2.html"
				},
			templateData:{
				title:"Demo page2",
				active:"Page2"
			},
			src :WORKPATH+"layout.html",
			dest:BUILDPATH+"page2.html",
			extend: "baseLayout"
		});
	

	//function to copy file
	//function to copy all images 
	
	fileUtils.copy({
			srcFolder:WORKPATH+"assets/images",
			destFolder:BUILDPATH+"assets/images"
		});
	

	
	//to create css files from less files
	lessUtils.compile(
		//compile common less to css
		{
			src:WORKPATH+"assets/less/base.less",
			dest:BUILDPATH+"assets/css/base.css",
			minify:globalSetting.minify
		},
		//compile page specific less to css
		{
			src:WORKPATH+"assets/less/home.less",
			dest:BUILDPATH+"assets/css/home.css",
			minify:globalSetting.minify
		},
		{
			src:WORKPATH+"assets/less/project.less",
			dest:BUILDPATH+"assets/css/project.css",
			minify:globalSetting.minify
		}
		);
	
}

(function(){
//initiate build and watch for file change
build();

var reBuildStarted=false;
//watch for file change in build path
watch.watchTree(WORKPATH,function(f){
		//to handle multiple time call in single change in windows
		if(!reBuildStarted && typeof f == "string"){
			console.log(' \033[33m Rebuilding ... \033[39m');
			reBuildStarted=true;
			build();
			
			setTimeout(function(){
					reBuildStarted=false;
				},100);
		}
	});

}());
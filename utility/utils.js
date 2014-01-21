var utils={
	//to create array from array type objects
	objToAry:function(obj,start){
		start=start||0;
		return Array.prototype.slice.call(obj,start);
	},
	
	//to merge two or more objects (currenty merge is only on one level)
	mergeObj:function(){
		var arg=utils.objToAry(arguments),
			target=arg[0],
			ln=arg.length;
		
		for(var i=1; i<ln; i++){
			var obj=arg[i];
			for(var key in obj ){
				if(obj.hasOwnProperty(key)){
					target[key]=obj[key];
				}
				
			}
		}
		
		return 	target;
	},
	
}


module.exports=utils;
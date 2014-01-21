// JavaScript Document
var globV={},
	globOb={};

//cache factory for jquery selectors
function jqOb(selector,refresh){
		if(!globOb[selector] || refresh){
				globOb[selector] = $(selector);
			}
		return 	globOb[selector];
	}	 
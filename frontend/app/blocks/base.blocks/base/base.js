modules.define("base",function(provide){
	provide({
		// инициализируем эффекты при скроле
		/*init_wow: function(){
			new WOW().init();*/
		}
	});
});

modules.require("base",function(provide){
	/*provide.init_wow();*/
});
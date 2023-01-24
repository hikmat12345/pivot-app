$(document).ready(function(){
	
	all_admin();
	all_users();
	all_services();
	all_products();
	feature_request();

/********************************************** admin apis  *********************************/
	//SiguUp
	$("#admin_register").on("submit",function(event){
		event.preventDefault();
		$(".overlay").show();
		$.ajax({
			url : "../database/register.php",
			method : "POST",
			data : $("#admin_register").serialize(),
			success : function(dataa){
				var data = JSON.parse(dataa);
				var status = data.status;
				if (status === "200") {
					$("#admin_register")[0].reset();
					$("#admin_reg").html(
					"<div class='alert alert-warning'><a href='#' class='close' data-dismiss='alert' aria-label='close'>&times;</a><b>"+data.error+"</b></div><script>window.setTimeout(function() {$('.alert').fadeTo(300, 0).slideUp(500, function(){$(this).remove();});}, 4000);</script>"
					);
				}else{
					$("#admin_reg").html(
					"<div class='alert alert-warning'><a href='#' class='close' data-dismiss='alert' aria-label='close'>&times;</a><b>"+data.error+"</b></div><script>window.setTimeout(function() {$('.alert').fadeTo(300, 0).slideUp(500, function(){$(this).remove();});}, 4000);</script>"
					);
				}
				
			}
		});
	});
	//SiguUp
	
//get admins
	function all_admin(){
		$("#admins").dataTable({
		   "bDeferRender" : true,
			"language": {
					"lengthMenu": "Display _MENU_ records per page",
            "zeroRecords": "Nothing found - sorry",
            "info": "Showing page _PAGE_ of _PAGES_",
            "infoEmpty": "No records available",
            "infoFiltered": "(filtered from _MAX_ total records)"
				},
			"ajax":{
				"url":"../database/admin_data.php",
				"type" : "POST",
				"data" : {admins:1},
				"dataSrc" : ""
			},
			"columns":[
				{"data":"name"},
				{"data":"email"},
				{"data":"contact"},
				{
                "mData": null,
                "bSortable": false,
				"mRender": function (s) { return '<button class="btn btn-danger status">'+s.status+'</button>'; }
            },
				{
                "mData": null,
                "bSortable": false,
               "mRender": function (o) { return '<form action="admin_profile.php" method="post" class="pull-left"> <input type="text" value="'+o.admin_id+'" name ="id" class="hidden"><input type="submit" value="View" class="btn btn-primary"></form> <button id="del_admin" data-id ="'+o.admin_id+'" class="btn btn-danger download" >Delete</button>'; }
            }
			
		   
			]
		});
	}
	//del admin
		$(document).on('click', '#del_admin', function () {
		var id = $(this).attr("data-id");
		event.preventDefault();
		$.ajax({
			url : "../database/admin_data.php",
			method : "POST",
			data : {
				delAdmin: 1,
				id: id
			},
			success : function(dataa){
				var data = JSON.parse(dataa);
				var status = data.status;
				if(status === "200"){
					$("#del_admin").html(
					"<div class='alert alert-warning'><a href='#' class='close' data-dismiss='alert' aria-label='close'>&times;</a><b>"+data.del_msg+"</b></div><script>window.setTimeout(function() {$('.alert').fadeTo(300, 0).slideUp(500, function(){$(this).remove();});}, 4000);</script>"
					);
					$("#admins").DataTable().ajax.reload();
				}
				
			}
		});
	});	
	//get users
	function all_users(){
		$("#all_users").dataTable({
		   "bDeferRender" : true,
			"language": {
			"lengthMenu": "Display _MENU_ records per page",
            "zeroRecords": "Nothing found - sorry",
            "info": "Showing page _PAGE_ of _PAGES_",
            "infoEmpty": "No records available",
            "infoFiltered": "(filtered from _MAX_ total records)"
				},
			"ajax":{
				"url":"../database/admin_data.php",
				"type" : "POST",
				"data" : {users:1},
				"dataSrc" : ""
			},
			"columns":[
				{"data":"name"},
				{"data":"email"},
				{"data":"address"},
				{"data":"city"},
				{"data":"contact"},
				{
                "mData": null,
                "bSortable": false,
               "mRender": function (o) { return '<form action="user_view.php" method="post" class="pull-left"> <input type="text" value="'+o.id+'" name ="id" class="hidden"><input type="submit" value="View" class="btn btn-primary"></form> <button id="del_user" data-id ="'+o.id+'" class="btn btn-danger download" >Delete</button>'; }
            }
			
		   
			]
		});
	}
	//del users
		$(document).on('click', '#del_user', function () {
		var id = $(this).attr("data-id");
		event.preventDefault();
		$.ajax({
			url : "../database/admin_data.php",
			method : "POST",
			data : {
				delUser: 1,
				id: id
			},
			success : function(dataa){
				var data = JSON.parse(dataa);
				var status = data.status;
				if(status === "200"){
					$("#del_user").html(
					"<div class='alert alert-warning'><a href='#' class='close' data-dismiss='alert' aria-label='close'>&times;</a><b>"+data.del_msg+"</b></div><script>window.setTimeout(function() {$('.alert').fadeTo(300, 0).slideUp(500, function(){$(this).remove();});}, 4000);</script>"
					);
					$("#all_users").DataTable().ajax.reload();
				}
				
			}
		});
	});	
		//get services
	function all_services(){
		$("#services").dataTable({
		   "bDeferRender" : true,
			"language": {
			"lengthMenu": "Display _MENU_ records per page",
            "zeroRecords": "Nothing found - sorry",
            "info": "Showing page _PAGE_ of _PAGES_",
            "infoEmpty": "No records available",
            "infoFiltered": "(filtered from _MAX_ total records)"
				},
			"ajax":{
				"url":"../database/admin_data.php",
				"type" : "POST",
				"data" : {Services:1},
				"dataSrc" : ""
			},
			"columns":[
				{"data":"title"},
				{"data":"price"},
				{"data":"service_catagory"},
				{
                "mData": null,
                "bSortable": false,
				"mRender": function (s) { return '<button class="btn btn-danger status">'+s.ad_active+'</button>'; }
            },
				{
                "mData": null,
                "bSortable": false,
				"mRender": function (s) { 
					if(s.ad_feature === "yes"){
					return '<label class="switch"><input type="checkbox" checked><span class="slider round slider_rnd"></span></label>'; 	}else{
					return '<label class="switch"><input type="checkbox"><span class="slider round slider_rnd"></span></label>'; 	}

				}
            },
				{
                "mData": null,
                "bSortable": false,
				"mRender": function (s) { return '<button class="btn btn-success status">'+s.ad_promotion_desc+'</button>'; }
            },
					{
                "mData": null,
                "bSortable": false,
				"mRender": function (s) { 
					if(s.average === ""){
					return '<button class="btn btn-warning status">0</button>'; 
					}else{
					return '<button class="btn btn-warning status">'+s.average+'</button>'; 
					}
				}
            },
				{"data":"name"},
				{
                "mData": null,
                "bSortable": false,
               "mRender": function (o) { return '<form action="service_detail.php" method="post" class="pull-left"> <input type="text" value="'+o.service_id+'" name ="id" class="hidden"><input type="submit" value="View" class="btn btn-primary"></form> <button id="del_service" data-id ="'+o.service_id+'" class="btn btn-danger download" >Delete</button>'; }
            }
			
		   
			]
		});
	}
	//del services
		$(document).on('click', '#del_service', function () {
		var id = $(this).attr("data-id");
		event.preventDefault();
		$.ajax({
			url : "../database/admin_data.php",
			method : "POST",
			data : {
				delService: 1,
				id: id
			},
			success : function(dataa){
				var data = JSON.parse(dataa);
				var status = data.status;
				if(status === "200"){
					$("#del_service").html(
					"<div class='alert alert-warning'><a href='#' class='close' data-dismiss='alert' aria-label='close'>&times;</a><b>"+data.del_msg+"</b></div><script>window.setTimeout(function() {$('.alert').fadeTo(300, 0).slideUp(500, function(){$(this).remove();});}, 4000);</script>"
					);
					$("#all_users").DataTable().ajax.reload();
				}
				
			}
		});
	});	
			//get products
	function all_products(){
		$("#allproducts").dataTable({
		   "bDeferRender" : true,
			"language": {
			"lengthMenu": "Display _MENU_ records per page",
            "zeroRecords": "Nothing found - sorry",
            "info": "Showing page _PAGE_ of _PAGES_",
            "infoEmpty": "No records available",
            "infoFiltered": "(filtered from _MAX_ total records)"
				},
			"ajax":{
				"url":"../database/admin_data.php",
				"type" : "POST",
				"data" : {Products:1},
				"dataSrc" : ""
			},
			"columns":[
				{"data":"acces_id"},
				{"data":"product_name"},
				{"data":"model"},
				{"data":"brand"},
				{"data":"price"},
				{
                "mData": null,
                "bSortable": false,
				"mRender": function (s) { 
					if(s.average === ""){
					return '<button class="btn btn-warning status">0</button>';	
					}else{
					return '<button class="btn btn-warning status">'+s.average+'</button>';  	
					}
				}
            	},
				{
                "mData": null,
                "bSortable": false,
               "mRender": function (o) { return '<form action="product.php" method="post" class="pull-left"> <input type="text" value="'+o.acces_id+'" name ="id" class="hidden"><input type="submit" value="View" class="btn btn-primary"></form> <button id="del_product" data-id ="'+o.acces_id+'" class="btn btn-danger download" >Delete</button>'; }
            }
			
		   
			]
		});
	}
	//del product
		$(document).on('click', '#del_product', function () {
		var id = $(this).attr("data-id");
		event.preventDefault();
		$.ajax({
			url : "../database/admin_data.php",
			method : "POST",
			data : {
				delProduct: 1,
				id: id
			},
			success : function(dataa){
				var data = JSON.parse(dataa);
				var status = data.status;
				if(status === "200"){
					$("#del_product").html(
					"<div class='alert alert-warning'><a href='#' class='close' data-dismiss='alert' aria-label='close'>&times;</a><b>"+data.del_msg+"</b></div><script>window.setTimeout(function() {$('.alert').fadeTo(300, 0).slideUp(500, function(){$(this).remove();});}, 4000);</script>"
					);
					$("#allproducts").DataTable().ajax.reload();
				}
				
			}
		});
	});
	//get feature
	function feature_request(){
		$("#features").dataTable({
		   "bDeferRender" : true,
			"language": {
			"lengthMenu": "Display _MENU_ records per page",
            "zeroRecords": "Nothing found - sorry",
            "info": "Showing page _PAGE_ of _PAGES_",
            "infoEmpty": "No records available",
            "infoFiltered": "(filtered from _MAX_ total records)"
				},
			"ajax":{
				"url":"../database/admin_data.php",
				"type" : "POST",
				"data" : {features:1},
				"dataSrc" : ""
			},
			"columns":[
				{"data":"car_name"},
				{"data":"model"},
				{"data":"reg_city"},
				{"data":"color"},
				{"data":"price"},
				{"data":"ad_active"},
				{
                "mData": null,
                "bSortable": false,
				"mRender": function (s) { 
					if(s.average === ""){
					return '<button class="btn btn-warning status">0</button>';	
					}else{
					return '<button class="btn btn-warning status">'+s.average+'</button>';  	
					}
				}
            	},
				{
                "mData": null,
                "bSortable": false,
				"mRender": function (s) {return '<button class="btn btn-danger status">'+s.verify+'</button>';}
            	},
				{
                "mData": null,
                "bSortable": false,
               "mRender": function (o) { return '<form action="#" method="post" class="pull-left"> <input type="text" value="'+o.acces_id+'" name ="id" class="hidden"><input type="submit" value="View" class="btn btn-primary"></form>'; }
            }
			
		   
			]
		});
	}
/********************************************** admin end *********************************/
	
});




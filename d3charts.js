      var width = 500;
      var height = 500;
      var margin = {top:2,left:20,right:2,bottom:20};
      var axisLength = width - 2 * margin; 
      data=[
      	{x:1,input: 400 ,output:200},
      	{x:2,input: 300 ,output:250},
      	{x:3,input: 450 ,output:230},

      ];	
      var barwidth= ((width-margin.left)/data.length);
      console.log(d3);
      var svgContainer = d3.select('svg').
      attr('width',width).
      attr('height',height)
      //creating x array
      function getxarray(){
      	var xarray=[];
      		data.forEach(function(data){ 
      			
      			xarray.push(data.x);
      		});
      	console.log(xarray);	
      	return xarray;
      }	
      function getyarray(){
      	var yarray=[];
      		data.forEach(function(data){ 
      			
      			yarray.push(data.input);
      			yarray.push(data.output);
      		});
      //	console.log(xarray);	
      	return yarray;
      }	
      
      

	// creating x array end

      //create scales
      var xscale=d3.scaleLinear().
      			range([0,width])
      			.domain(getxarray())
      			
      	console.log(xscale.domain());		

      var yscale=d3.scaleBand().
      				domain(getyarray())
      							

      			console.log(yscale);					

      //create scales end
      //axes
      	xaxis=d3.axisBottom(xscale);
      	yaxis=d3.axisLeft(yscale);
 						
      console.log(xaxis);
      var g=svgContainer.append('g')
      svgContainer.append('g').attr('transform','translate(0,'+(height-margin.bottom)+')').call(xaxis)
      g.selectAll("rect")
	   .data(data).
	   enter().
	   append('rect').
	   attr('x',function(d,i){
	   	return i*(barwidth+margin.right)
	   }).attr('y',function(d){
	   	return (height-d.input)
	   }).
	   attr('width',barwidth).
	   attr('height',function(d){

	   	return height-(height-d.input)-margin.bottom;

	   })
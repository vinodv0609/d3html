      var width = 600;
      var height = 600;
      var margin = {top:20,left:20,right:20,bottom:20};
      var  xwidth=width-margin.left-margin.right
      var yheight=height-margin.top-margin.bottom
      var axisLength = width - 2 * margin; 
      data=[
      	{x:1,input: 100 ,output:200},
      	{x:2,input: 200 ,output:250},
      	{x:3,input: 250 ,output:230},

      ];	
      var toggle =true;
      var barwidth= ((width-margin.left)/data.length);
      var svgContainer = d3.select('svg').
      attr('width',width).
      attr('height',height).
      style('background','black')
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
      		});
      //	console.log(xarray);	
      	return yarray;
      }	

      //create scales
      var xmaxrange=d3.max(getxarray());
      var ymaxrange=d3.max(getyarray());
      var xscales=d3.scaleLinear()
      var xscale=	xscales.range([0,xwidth])
      			.domain([0,xmaxrange])
      var yscales=d3.scaleLinear()
      var yscale=yscales.range([0,yheight]).domain([ymaxrange,0]);

      //create scales end
      //axes
      	xaxis=d3.axisBottom(xscale).ticks(data.length);
      	yaxis=d3.axisLeft(yscale).ticks(5);
 						
      console.log(xaxis);
      var input=svgContainer.append('g')
      var output=svgContainer.append('g')
      var path=svgContainer.selectAll('g').selectAll('g')
      //axis line
      svgContainer.append('g').attr('transform','translate('+margin.right+','+(height-margin.bottom)+')').attr('class' ,'axisblue').call(xaxis)
      svgContainer.append('g').attr('transform','translate('+(margin.right)+','+(margin.bottom)+')').attr('class' ,'axisblue').call(yaxis)
      //axis line end
      // input data
      input.selectAll('rect').
            data(data).enter()
            .append('rect').
            attr('x',function(data){
                 return xscales(data.x)      
            }).
            attr('data-index',function(data){
                  //console.log(yscales(data.input))
                 return data.x
            }).
            attr('y',function(data){
                  //console.log(yscales(data.input))
                 return        height-data.input-margin.bottom
            }).
            attr('width',function(data){
                  return 20;
            }).
            attr('fill','orange').
            attr('height',function(data){
                  return data.input;
            })
      //input data end
      //output data
       output.selectAll('rect').
            data(stackeddata(data,height,margin)).enter()
            .append('rect').
            attr('x',function(data){
                 return xscales(data.x)      
            }).
            attr('y',function(data){
                  //console.log(yscales(data.input))
                 return data.y
            }).
             attr('data-index',function(data){
                  //console.log(yscales(data.input))
                 return data.x
            }).
            attr('width',function(data){
                  return 20;
            }).
            attr('fill','blue').
            attr('height',function(data){
                  return data.height;
            })     


      //output data end 

      //calculate output height function
            function stackeddata(data,height,margin){
                  var dataobj=[];
                  data.forEach(function(datainput,index){
                        var yvalue=height-(datainput.input+datainput.output)-margin.bottom
                       dataobj[index]={x:datainput.x,y:yvalue,height:datainput.output} 
             })
                  console.log(dataobj);
                  return dataobj
            }

           function toggledata(data,height,margin){
                  if(toggle == true){
                    toggle=false;          
                  groupeddata(data,height,margin)
                  }
                  else{
                        toggle=true;          
                  stackedchadata(data,height,margin)
                  }
           }       

          function groupeddata(data,height,margin){
            var groupedobj=[];
                  data.forEach(function(datainput,index){
                        var yvalue=height-datainput.output-margin.bottom;
                       groupedobj[index]={x:datainput.x,y:yvalue,height:datainput.output} 
                  });
                  output.selectAll('rect').data(groupedobj).transition().duration(2000).
            attr('x',function(data){
                 return xscales(data.x)-20      
            }).
            attr('y',function(data){
                  //console.log(yscales(data.input))
                 return data.y
            }). attr('data-index',function(data){
                  //console.log(yscales(data.input))
                 return data.x
            }).
            attr('width',function(data){
                  return 20;
            }).
            attr('fill','blue').
            attr('height',function(data){
                  return data.height;
            })     

          } 


          function stackedchadata(data,height,margin){
            var groupedobj=[];
                  data.forEach(function(datainput,index){
                        var yvalue=height-(datainput.input+datainput.output)-margin.bottom
                       groupedobj[index]={x:datainput.x,y:yvalue,height:datainput.output} 
                  });
                  output.selectAll('rect').data(groupedobj).transition().duration(2000).
            attr('x',function(data){
                 return xscales(data.x)      
            }).
            attr('y',function(data){
                  //console.log(yscales(data.input))
                 return data.y
            }). attr('data-index',function(data){
                  //console.log(yscales(data.input))
                 return data.x
            }).
            attr('width',function(data){
                  return 20;
            }).
            attr('fill','blue').
            attr('height',function(data){
                  return data.height;
            })     

          }  



      // calculate output function height


/*******************circle***********************/

      var svg=d3.select('#circle')       
                .attr("width", 200)
                .attr("height", 200)
                .append("g")
                .attr("transform", "translate(100,100)");

      
      jQuery('#root >g >rect').hover(function(){
          // console.log(jQuery(this).attr('data-index')) 
           var index=jQuery(this).attr('data-index');
           console.log(Math.PI*0.25)
            var arc = d3.arc()
                .innerRadius(40)
                .outerRadius(70)
                .cornerRadius(2)

              
               var dataarray=[]
               dataarray.push(data[index-1].input)
               dataarray.push(data[index-1].output)
                var pie=d3.pie().value(function(d){
                  return d;
                });
                var color=d3.scaleOrdinal().range(["orange","blue"])

                  var arcs=svg.selectAll('.arcs').exit().remove().data(pie(dataarray)).enter().
                  append("g").attr("class","arcs")
                  arcs.append("path").attr('d',arc).attr("fill",function(d){
                        return color(d.data)
                  })
                console.log(pie(dataarray))
      })       
              

/*******************circleend***********************/

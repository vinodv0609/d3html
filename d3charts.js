/*******************datepicker and  initialization**********************/

    var width = jQuery(window).width()/2;
    var height = jQuery(window).height();
    var margin = {top:2,left:20,right:2,bottom:20};
    var toggle =true; 
    var svgContainer = d3.select('#root').
                      attr('width',width).
                      attr('height',height)

    var  xwidth=width-margin.left-margin.right
    var yheight=height-margin.top-margin.bottom

  jQuery(document).ready(function(){
    jQuery('#startdate').datepicker({
      format: 'dd-mm-yyyy'
    });
    jQuery('#enddate').datepicker({
      format: 'dd-mm-yyyy'
    });
      });

    var startdate= datecalculator()
    var enddate= startdate;
    var datavalue= getdatafromapi(startdate,enddate);
    console.log(datavalue);
    var data=[]
    datavalue.forEach((value,index)=>{
     // console.log(value)
      var input=(typeof value.inputpower == 'undefined')? 0:(value.inputpower/100)
      var output=(typeof value.outputpower == 'undefined')? 0:(value.outputpower/100)
      data[index]={x:index,input:input,output:output}
    });
    /*************scales ***********/
    var xmaxrange=d3.max(getxarray());
    var xscales=d3.scaleLinear()
    var xscale= xscales.range([0,xwidth]).domain([0,xmaxrange])
    var ymaxrange=d3.max(getyarray());
    console.log(ymaxrange)
    var yscales=d3.scaleLinear()
    var yscale=yscales.range([0,yheight]).domain([ymaxrange,0]);
    var barwidth=20
    /************scales end *******/ 
    /***********axes **************/
    var xaxis=d3.axisBottom(xscale).ticks(data.length);
    var yaxis=d3.axisLeft(yscale).ticks(data.length);         
     /***********axes end **************/
     /************drawing  x-axis*******/
    svgContainer.append('g').attr('transform','translate('+margin.right+','+(height-margin.bottom)+')').attr('class' ,'axisblue').call(xaxis)
    svgContainer.append('g').attr('transform','translate('+(margin.right)+','+(margin.bottom)+')').attr('class' ,'axisblue').call(yaxis)
    /************drawing  x-axis end *******/
    /***********creating bars **************/

    /**********creating bars end **********/
    /******************creating y graph*********************/
    var input=svgContainer.append('g')
    var output=svgContainer.append('g')
    var path=svgContainer.selectAll('g').selectAll('g')
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
                 return  height-data.input-margin.bottom
            }).
            attr('width',function(data){
                  return barwidth;
            }).
            attr('fill','orange').
            attr('height',function(data){
                  return data.input;
            })

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
                  return barwidth;
            }).
            attr('fill','blue').
            attr('height',function(data){
                  return data.height;
            })       


    /******************creating y graph*********************/                        


/*******************datepickerend*******************/
/*******************calculate date ****************/
 function datecalculator(){
    var today = new Date();
    var  dd = today.getDate();
    var mm =  today.getMonth() + 1; //January is 0!
    var yyyy =  today.getFullYear();
    if (dd < 10) {
      dd = '0' + dd;
    }
    if (mm < 10) {
      mm = '0' + mm;
    }
   return today = dd + '-' + mm + '-' + yyyy;
  }

/*******************calculate date end ************/
/******************fetching data******************/
  function getdatafromapi(start,end){
   var data  = $.ajax({ 
        url:"http://iot.sunculture.com/api/v1/impact/dailypowersummary/"+start+'/'+end,
        type: 'GET',
        async: false, 
      });
   return data.responseJSON;
   //console.log(data.responseJSON)
  }


/******************fetching data end ************/	
/******************creating x array data ********/      
  function getxarray(){
      	var xarray=[];
      		data.forEach(function(data){ 
      			
      			xarray.push(data.x);
      		});
      	console.log(xarray);	
      	return xarray;
  }	
 /*********creating x array data end **********/
 /********* creating y array data  ***********/
  function getyarray(){
    var yarray=[];
    data.forEach(function(data){       			
      yarray.push(data.output);
      yarray.push(data.input);
    });
      //	console.log(xarray);	
    return yarray;
  }	
/********* creating y array data end ************/    

/*************stacked data calculation ***************/
            function stackeddata(data,height,margin){
                  var dataobj=[];
                  data.forEach(function(datainput,index){
                        var yvalue=height-(datainput.input+datainput.output)-margin.bottom
                       dataobj[index]={x:datainput.x,y:yvalue,height:datainput.output} 
             })
                  console.log(dataobj);
                  return dataobj
            }

/*************stacked data calculation ***************            
/******************button toggle function ***********/

/******************button toggle function end ***********/       
/**************groupeddaata*****************/
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

/******************grouped data end *************/
/******************stackeddatafunction*******/
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

/******************stackeddatafunctionend*******/
/*******************circle***********************/

      var svg=d3.select('#circle')       
                .attr("width", 200)
                .attr("height", 200)
                .append("g")
                .attr("transform", "translate(100,100)");
  /*******************bar hover*********************/    
      jQuery('#root >g >rect').hover(function(){
          // console.log(jQuery(this).attr('data-index')) 
           var index=jQuery(this).attr('data-index');
           console.log(Math.PI*0.25)
            var arc = d3.arc()
                .innerRadius(40)
                .outerRadius(70)
                .cornerRadius(2)

              
               var dataarray=[]
               dataarray.push(data[index].input)
               dataarray.push(data[index].output)
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
              
/*******************bar hover end*********************/   

function toggledata(data,height,margin){
              console.log(data)
                  if(toggle == true){
                    toggle=false;          
                  groupeddata(data,height,margin)
                  }
                  else{
                        toggle=true;          
                  stackedchadata(data,height,margin)
                  }
           }

           jQuery('#generate_graphs').on('click',function(){

              var startdate=jQuery('#startdate').val();
              var enddate=jQuery('#enddate').val();
              if(startdate == ''){
                  alert("Please enter the start date");
                  jQuery('#startdate').focus();
              }
              else if(enddate ==''){
                alert("Please enter the end date");
                jQuery('#enddate').focus();   
              }
              var datevalues=getdatafromapi(startdate,enddate);
              console.log(datevalues)
               var dataval=[] 
              datevalues.forEach((value,index)=>{
                var input=(typeof value.inputpower == 'undefined')? 0:(value.inputpower/100)
                var output=(typeof value.outputpower == 'undefined')? 0:(value.outputpower/100)
                dataval[index]={x:index,input:input,output:output}
              });
              console.log(dataval)
              input.selectAll('rect').
                exit().remove().
            data(dataval).enter()
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
                 return  height-data.input-margin.bottom
            }).
            attr('width',function(data){
                  return barwidth;
            }).
            attr('fill','orange').
            attr('height',function(data){
                  return data.input;
            })

       output.selectAll('rect').exit().remove().
            data(stackeddata(dataval,height,margin)).enter().
            append('rect').
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
                  return barwidth;
            }).
            attr('fill','blue').
            attr('height',function(data){
                  return data.height;
            })       





           });

/*****************update graphs******************/   

/*****************update graphs end******************/       
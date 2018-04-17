var character = [
					{"flavor":"Fruity", "color":"green","share":1},
					{"flavor":"Smoky", "color":"gray","share":1}
				]; // Text and color set up for the wheel

// Canvas size set up
var margin = {top:5, right:5, bottom:100, left:100};
var w_wheel = 400,
	h_wheel = 400;

var w_suggestion = 1200,
	h_suggestion = 800;

// Set up #wheel
var wheel = d3.select("#wheel")
			.append("svg")
			.attr("width",w_wheel)
			.attr("height",h_wheel)
			.attr("transform","translate(0,0)");

var radius = w_wheel/2;

var path = d3.arc()
			.innerRadius(0)
			.outerRadius(radius);

var pie = d3.pie().value(function(d){return d.share;});


var arcs = wheel.selectAll("g.arc")
       		 .data(pie(character))
       		 .enter()
       		 .append("g")
       		 .attr("class","slice")
       		 .attr("transform","translate(" + radius + "," + radius +")");

arcs.append("path")
    .attr("d", path)
    .attr("fill",function(d){return d.data.color;});

arcs.append("text")
    .attr("transform", function(d){return "translate(" + path.centroid(d) + ")";})
    .attr("dy",".35em")
    .style("text-anchor","middle")
    .text(function(d){return d.data.flavor;})
    .style("stroke","white");

// Set up the table on #suggestion
var suggestion = d3.select("#suggestion")
				   .attr("width",w_suggestion)
				   .attr("height",h_suggestion);

var tabulate = function(data,columns){
	var table = suggestion.append("table");
	var thead = table.append("thead");
	var tbody = table.append("tbody");

	thead.append("tr")
		 .selectAll("th")
		 .data(columns)
		 .enter()
		 .append("th")
		 .text(function(d){return d;});

	var rows = tbody.selectAll("tr")
					.data(data)
					.enter()
					.append("tr");

	var cells = rows.selectAll("td")
					.data(function(row){
						return columns.map(function(col){
							return {column: col, value: row[col]};
						})
					})
					.enter()
					.append("td")
					.text(function(d){return d.value;});

	return table;
}

d3.csv("whisky_clear.csv",function(error,data){
	if (error) throw error;



	data.forEach(function(d){
		d.whisky = d.whisky;
		d.score = +d.score;
		d.review = +d.review;
		d.cost = +d.cost;
		d.class = d.class;
		d.cluster = d.cluster;
		d.country = d.country;
		d.type = d.type;
	});

	var nest = d3.nest().key(function(d){return d.country;})
						.rollup(function(d){return d.length;})
						.entries(data); 
	
	console.log(data);

	var selection = d3.select("#dropdown");

	selection.append("select")
			 .selectAll("option")
			 .data(nest)
			 .enter()
			 .append("option")
			 .attr("value",function(d){return d.key;})
			 .text(function(d){return d.key;});

	// Interaction for user to select country and flavor to filter
	// Default selection to Scotland
	var selectedCountry = "Scotland";
	console.log(selectedCountry);

	var selectedFlavor;

	
	selection.on("change",function(){

		selectedCountry = d3.select(this)
							.select("select")
							.property("value");

		console.log(selectedCountry);

		var result = data.filter(function(d){return d.country == selectedCountry;});
		console.log(result);
		var table = tabulate(result,col);
		table.selectAll("thead th")
		 .text(function(col){return col.charAt(0).toUpperCase()+col.substr(1);});
	})


	wheel.selectAll(".slice").on("click",function(d){
		selectedFlavor = d.data.flavor;
			//console.log(d.data.flavor);
			//console.log(selectedCountry);
			console.log(selectedFlavor);
	});
	console.log("Outside is " + selectedFlavor);

	var result = data.filter(function(d){return d.country == selectedCountry;});
	console.log(result);


	console.log(result)
	var col = ["whisky","score","review","cost","cluster","class","country","type"];

	

	//var table = tabulate(result,col); // Generate a table of suggestion
	



	//table.selectAll("thead th")
	//	 .text(function(col){return col.charAt(0).toUpperCase()+col.substr(1);});

}); // End read
d3.csv('wealth-health-2014.csv',d3.autoType
).then(data=>{

	console.log(data);
	const margin = ({top: 120, right: 120, bottom: 120, left: 120})
	const width=650-margin.left-margin.right,
		height=500-margin.top-margin.bottom

	let incomeMin=d3.min(data,d=>d.Income),
		incomeMax=d3.max(data,d=>d.Income);

	let incomeScale=d3.scaleLinear()
		.domain([0, incomeMax])
		.range([0,width])

	let lifeExpectancyMin=d3.min(data,d=>d.LifeExpectancy),
		lifeExpectancyMax=d3.max(data,d=>d.LifeExpectancy);

	let lifeExpectancyScale=d3.scaleLinear()
		.domain([lifeExpectancyMin, lifeExpectancyMax])
		.range([width,0])

	let populationMin=d3.min(data,d=>d.Population),
		populationMax=d3.max(data,d=>d.Population);
	
	let populationScale=d3.scaleLog()
		.domain([populationMin,populationMax])
		.range([0,width/40])

	let regionOrdinal=d3.scaleOrdinal(d3.schemeTableau10)

	let svg=d3.select('.chart').append('svg')
		.attr('width',width+margin.left+margin.right)
		.attr('height',height+margin.top+margin.bottom)
		.append('g')
		.attr('transform','translate('+margin.left+','+margin.top+')')

	svg.selectAll()
		.data(data)
		.enter()
		.append('circle')
		.attr('cx',function(d){
			return incomeScale(d.Income)
		})
		.attr('cy',function(d){
			return lifeExpectancyScale(d.LifeExpectancy)
		})
		.attr('r',function(d){
			if(d.Population>0){
				return populationScale(d.Population)
			} else{ return 0}
		})
		.attr('fill',function(d){
			return regionOrdinal(d.Region)
		})
		.attr('stroke','black')
		.on('mouseover',(event,d)=>{
			const pos=d3.pointer(event, window)
			d3.select("#tooltip")
        		.style("left", pos[0] + "px")
        		.style("top", pos[1] + "px")
				.html(
					"Country: "+d.Country+
					"<br>Life Expectancy: "+d3.format(".1f")(d.LifeExpectancy)+
					"<br>Income: "+d.Income+
					"<br>Population: "+d.Population+
					"<br>Region: "+d.Region);
			
			d3.select('#tooltip').classed('hidden',false)
		})
		.on('mouseout',(event,d)=>{
			d3.select('#tooltip').classed('hidden',true)
		})

	const xAxis=d3.axisBottom()
		.scale(incomeScale)
		.ticks(5, "s")

	svg.append('g')
		.attr('class','axis x-axis')
		.call(xAxis)
		.attr("transform", `translate(0, ${height+95})`)

	const yAxis=d3.axisLeft()
		.scale(lifeExpectancyScale)

	svg.append('g')
		.attr('class','axis y-axis')
		.call(yAxis)
		.attr("transform", `translate(0, -58)`)

	svg.append('text')
		.attr('x',width-20)
		.attr('y',height+120)
		.text('Income')

	svg.append('text')
		.attr('class','y-title')
		.attr('x',-40)
		.attr('y',-40)
		.text('Life Expectance')

	svg.selectAll('rect')
		.data(regionOrdinal.domain())
		.enter()
		.append('rect')
		.attr('x',300)
		.attr('y',function(d,i){
			return 150+(i*20)
		})
		.attr('height',15)
		.attr('width',15)
		.attr('fill',function(d){
			return regionOrdinal(d)
		})

	svg.selectAll()
		.data(regionOrdinal.domain())
		.enter()
		.append('text')
		.attr('x',330)
		.attr('y',function(d,i){
			return 160+(i*20)
		})
		.attr('font-size',11)
		.attr('text-anchor','left')
		.text(function(d){
			return d
		})
		
	

	

})


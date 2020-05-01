const D3Node = require('d3-node')
const _ = require('lodash')

const rollingAverage = (values, size, key) => {
  let buffer = []
  let averagedValues = []

  for (let value of values) {
    buffer.push(value[key])
    if (buffer.length > size) {
      buffer = buffer.slice(buffer.length - size)
    }
    
    let average = Math.floor(_.sum(buffer) / size)
    let modifiedValue = _.clone(value)
    modifiedValue[key] = average
    averagedValues.push(modifiedValue)
  }
  return averagedValues
}

const svgSparklineWithData = (values, width, height) => {
  const d3n = new D3Node()      // initializes D3 with container element
  const d3 = d3n.d3
  const margin =  {top: 10, right: 10, bottom: 10, left: 10}

  const chartWidth = width - margin.right - margin.left
  const chartHeight = height - margin.top - margin.bottom;

  var parseTime = d3.timeParse("%Y-%m-%d");
  values.forEach(d => { d.date = parseTime(d.date); d.value = +d.value })

  var x = d3.scaleTime().range([0, chartWidth]);
  var y = d3.scaleLinear().range([chartHeight, 0])

  x.domain(d3.extent(values, function(d) { return d.date; }));
  y.domain([0, d3.max(values, function(d) { return d.value; })]);

  var line = d3.line()
    .x(function(d) { return x(d.date); })
    .y(function(d) { return y(d.value); })
    .curve(d3.curveMonotoneX);

  var area = d3.area()
    .x(function(d) { return x(d.date); })
    .y0(chartHeight)
    .y1(function(d) { return y(d.value); })
    .curve(d3.curveMonotoneX)

  var svg = d3n.createSVG(width, height)
    .append('g')
    .attr('transform', 'translate(' + margin.left + ',' + margin.top + ')')

  svg.append("path")
    .data([values])
    .attr("class", "area")
    .attr('fill', 'rgba(0, 0, 0, 0.2)')
    .attr("d", area);

  svg.append('path')
    .data([values])
    .attr('class', 'line')
    .attr("stroke", "black")
    .attr("fill", "none")
    .attr('d', line)

  return d3n.svgString()
}

const svgBarChartWithData = (values, width, height, maxY, fillColor) => {
  const d3n = new D3Node()      // initializes D3 with container element
  const d3 = d3n.d3
  const margin =  {top: 10, right: 10, bottom: 10, left: 10}

  const chartWidth = width - margin.right - margin.left
  const chartHeight = height - margin.top - margin.bottom;

  var parseTime = d3.timeParse("%Y-%m-%d");
  values.forEach(d => { d.date = parseTime(d.date); d.value = +d.value })

  if (!maxY) {
    maxY = d3.max(values, function(d) { return d.value; })
  }

  var x = d3.scaleBand().range([0, chartWidth]);
  var y = d3.scaleLinear().range([chartHeight, 0])

  x.domain(d3.range(values.length)).padding(0.01);
  y.domain([0, maxY]);

  var svg = d3n.createSVG(width, height)
    .append('g')
    .attr('transform', 'translate(' + margin.left + ',' + margin.top + ')')

  svg.selectAll('rect')
    .data(values)
    .enter().append('rect')
    .attr('class', 'bar')
    .attr('x', (d, i) => x(i))
    .attr('width', x.bandwidth() - 2)
    .attr('y', d=> y(d.value))
    .attr('height', d => y(0) - y(d.value))
    .attr('fill', fillColor)

  return d3n.svgString()  
}

exports.svgSparklineWithData = svgSparklineWithData
exports.svgBarChartWithData = svgBarChartWithData
exports.rollingAverage = rollingAverage
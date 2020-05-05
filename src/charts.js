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


// Returns an SVG of the line chart given the values.
//
// @param values: Array of objects in the form of {date: '', value: 0}.
// @param width: Int Width of the resulting SVG
// @param height: Int Height of the resulting SVG
// @param options: {
//  padding: {top: 0, right: 0, bottom: 0, left: 0}, 
//  showCeilingValue: boolean, 
//  showLastValue: boolean,
//  lastValueLabel: int
//  }
const svgSparklineWithData = (values, width, height, options) => {
  const d3n = new D3Node()      // initializes D3 with container element
  const d3 = d3n.d3

  let padding = {top: 10, right: 10, bottom: 10, left: 10}
  if (options.padding) {
    padding = options.padding
  }

  const chartWidth = width - padding.right - padding.left
  const chartHeight = height - padding.top - padding.bottom;

  var parseTime = d3.timeParse("%Y-%m-%d");
  values.forEach(d => { d.date = parseTime(d.date); d.value = +d.value })


  var x = d3.scaleTime().range([0, chartWidth]);
  var y = d3.scaleLinear().range([chartHeight, 0])

  x.domain(d3.extent(values, function(d) { return d.date; }));

  const valueMin =  d3.min([d3.min(values, function(d) { return d.value; }), 0])
  const valueMax =  d3.max(values, function(d) { return d.value; })
  y.domain([valueMin, valueMax]);

  var line = d3.line()
    .x(function(d) { return x(d.date); })
    .y(function(d) { return y(d.value); })
    .curve(d3.curveMonotoneX);

  var area = d3.area()
    .x(function(d) { return x(d.date); })
    .y0(chartHeight)
    .y1(function(d) { return y(d.value); })
    .curve(d3.curveMonotoneX)

  var svg = d3n.createSVG()
    .attr('viewBox', `0 0 ${width} ${height}`)    
    .append('g')
    .attr('transform', 'translate(' + padding.left + ',' + padding.top + ')')

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

  // Draw max and current line.
  const labelFontSize = 10;
  if (options.showLastValue) {
    const axisLabelMargin = 3
    const yFinal = values[values.length - 1].value

    svg.append('circle')
      .attr('cx', chartWidth)
      .attr('cy', y(yFinal))
      .attr('r', 2)
      .attr('stroke', 'none')
      .attr('fill', 'black')

    svg.append('text')
      .attr('class', 'axis-final-label')
      .attr('font-family', 'sans-serif')
      .attr('font-size', `${labelFontSize}px`)
      .attr('x', chartWidth + axisLabelMargin)
      .attr('y', y(yFinal) + (labelFontSize / 4) )
      .text(options.lastValueLabel ? options.lastValueLabel : yFinal)
  }

  if (options.showCeilingValue) {
    const ceilingLineLength = 5
    const ceilingLabelMargin = 5

    const roundUp = (v) => {
      if (v < 50) { 
        return parseInt(Math.ceil(v / 10 + 1) * 10)
      }
      return parseInt(Math.floor((v * 1.3)/10) * 10)
    };

    let ceilingValue = roundUp(valueMax)
    let ceilingY = y(ceilingValue)
    console.log(ceilingValue, ceilingY)
    const linePoints = [[chartWidth - ceilingLineLength, ceilingY], [chartWidth, ceilingY]]
    let ceiling = d3.line()(linePoints)
    svg.append('path')
      .attr('class', 'axis-ceiling')
      .attr('stroke-width', '1')
      .attr('stroke', 'black')
      .attr('fill', 'none')
      .attr('d', ceiling)

      svg.append('text')
        .attr('class', 'axis-ceiling-label')
        .attr('font-family', 'sans-serif')
        .attr('text-anchor', 'end')
        .attr('font-size', `${labelFontSize}px`)
        .attr('x', chartWidth - ceilingLineLength - ceilingLabelMargin)
        .attr('y', ceilingY + (labelFontSize / 4) )
        .text(ceilingValue)
  }
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

  var svg = d3n.createSVG()
    .attr('viewBox', `0 0 ${width} ${height}`)    
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
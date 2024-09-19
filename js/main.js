const margin = {top: 20, right: 30, bottom: 50, left: 70};
const width = 1000 - margin.left - margin.right;
const height = 600 - margin.top - margin.bottom;

const svg = d3.select('#myDataVis').select('svg')
    .attr('width', width + margin.left + margin.right)
    .attr('height', height + margin.top + margin.bottom)
  .append('g')
    .attr('transform', `translate(${margin.left},${margin.top})`);


// STEP_3 DATASET PREPARATION
let maleData = [];
let femaleData = [];
    
// Load male data first
d3.csv('data/males_data.csv').then(maleCsvData => {
    maleData  = maleCsvData.
                    filter(d => d.Year >= 1991)
                    .map(d => ({
                        Year: new Date(d.Year, 0, 1),
                        India: +d.India,
                        Australia: +d.Australia,
                        China: +d.China,
                        Pakistan: +d.Pakistan,
                        Russia: +d.Russia,
                        Argentina: +d.Argentina,
                        Brazil :  +d.Brazil
                    }));
    
            // Load female data after male data is loaded
        d3.csv('data/females_data.csv').then(femaleCsvData => {
            femaleData = femaleCsvData
                .filter(d => d.Year >= 1991)
                .map(d => ({
                    Year: new Date(d.Year, 0, 1),
                    India: +d.India,
                    Australia: +d.Australia,
                    China: +d.China,
                    Pakistan: +d.Pakistan,
                    Russia: +d.Russia,
                    Argentina: +d.Argentina,
                    Brazil :  +d.Brazil
                }));
    
            // Initialize chart with default country (India)
            drawLollipopChart();
        });
    });
    
function drawLollipopChart() {

    const selectedCountry = document.getElementById('column-1-select').value;

    const selectedMaleData = maleData.map(d => ({
        Year: d.Year,
        Value: d[selectedCountry]
    }));
    
    const selectedFemaleData = femaleData.map(d => ({
        Year: d.Year,
        Value: d[selectedCountry]
    }));


    // STEP-4 AXIS

    const xScale = d3.scaleTime()
        .domain([new Date(1990, 0, 1), new Date(2023, 0, 1)]) 
        .range([0, width]);

    const maxValue = d3.max([
        d3.max(selectedMaleData, d => d.Value),
        d3.max(selectedFemaleData, d => d.Value)
    ]) || 0;

    const yScale = d3.scaleLinear()
        .domain([0, maxValue])
        .range([height, 0]); //Here Top Left Corner is considered as (0,0) so we will we doing (Height, 0).

    const transitionDuration = 1000;  // Animation duration of 1 second

    svg.selectAll('.x-axis').remove();
    svg.selectAll('.y-axis').remove();

    svg.append('text')
    .attr('x', width / 2)
    .attr('y', height + margin.bottom -8) // Position at bottom margin
    .attr('text-anchor', 'middle') // Center horizontally
    .text('Year');

    svg.append('text')
    .attr('transform', 'rotate(-90)') // Rotate y-axis title
    .attr('x', -height / 2) // Position at the middle of the height
    .attr('y', 15 - margin.left) // Position at the left margin
    .attr('text-anchor', 'middle') // Center vertically
    .text('Employment Rate');


    // STEP-5 LOLLIPOP CHART

    const offset = 5;


    const linesMale = svg.selectAll('line.male')
        .data(selectedMaleData, d => d.Year);

    linesMale.enter()
        .append('line')
        .attr('class', 'male')
        .attr('x1', d => xScale(d.Year) - offset)
        .attr('x2', d => xScale(d.Year) - offset)
        .attr('y1', height)
        .attr('y2', height)
        .attr('stroke', 'blue')
        .attr('stroke-width', 2)
        .transition()
        .duration(transitionDuration)
        .attr('y2', d => yScale(d.Value));

    linesMale.transition()
        .duration(transitionDuration)
        .attr('x1', d => xScale(d.Year) - offset)
        .attr('x2', d => xScale(d.Year) - offset)
        .attr('y2', d => yScale(d.Value));

    linesMale.exit()
        .transition()
        .duration(transitionDuration)
        .attr('y2', height)
        .remove();

    const circlesMale = svg.selectAll('circle.male')
        .data(selectedMaleData, d => d.Year);

    circlesMale.enter()
        .append('circle')
        .attr('class', 'male')
        .attr('cx', d => xScale(d.Year) - offset)
        .attr('cy', height)
        .attr('r', 5)
        .attr('fill', 'blue')
        .transition()
        .duration(transitionDuration)
        .attr('cy', d => yScale(d.Value));

    circlesMale.transition()
        .duration(transitionDuration)
        .attr('cx', d => xScale(d.Year) - offset)
        .attr('cy', d => yScale(d.Value));

    circlesMale.exit()
        .transition()
        .duration(transitionDuration)
        .attr('cy', height)
        .remove();

    // Update lines and circles for female data
    const linesFemale = svg.selectAll('line.female')
        .data(selectedFemaleData, d => d.Year);

    linesFemale.enter()
        .append('line')
        .attr('class', 'female')
        .attr('x1', d => xScale(d.Year) + offset)
        .attr('x2', d => xScale(d.Year) + offset)
        .attr('y1', height)
        .attr('y2', height)
        .attr('stroke', 'red')
        .attr('stroke-width', 2)
        .transition()
        .duration(transitionDuration)
        .attr('y2', d => yScale(d.Value));

    linesFemale.transition()
        .duration(transitionDuration)
        .attr('x1', d => xScale(d.Year) + offset)
        .attr('x2', d => xScale(d.Year) + offset)
        .attr('y2', d => yScale(d.Value));

    linesFemale.exit()
        .transition()
        .duration(transitionDuration)
        .attr('y2', height)
        .remove();

    const circlesFemale = svg.selectAll('circle.female')
        .data(selectedFemaleData, d => d.Year);

    circlesFemale.enter()
        .append('circle')
        .attr('class', 'female')
        .attr('cx', d => xScale(d.Year) + offset)
        .attr('cy', height)
        .attr('r', 5)
        .attr('fill', 'red')
        .transition()
        .duration(transitionDuration)
        .attr('cy', d => yScale(d.Value));

    circlesFemale.transition()
        .duration(transitionDuration)
        .attr('cx', d => xScale(d.Year) + offset)
        .attr('cy', d => yScale(d.Value));

    circlesFemale.exit()
        .transition()
        .duration(transitionDuration)
        .attr('cy', height)
        .remove();

       
        // STEP-6 LEGEND

    // Male legend (blue)
    const legend = svg.append('g')
        .attr('class', 'legend')
        .attr('transform', `translate(${width - 200}, 0)`);
    // Male legend (blue)
    legend.append('rect')
        .attr('x', 0)
        .attr('y', 0)
        .attr('width', 15)
        .attr('height', 15)
        .attr('fill', 'blue');

    legend.append('text')
        .attr('x', 20)
        .attr('y', 12)
        .text('Male Employment Rate');

    // Female legend (red)
    legend.append('rect')
        .attr('x', 0)
        .attr('y', 20)
        .attr('width', 15)
        .attr('height', 15)
        .attr('fill', 'red');

    legend.append('text')
        .attr('x', 20)
        .attr('y', 32)
        .text('Female Employment Rate');


    // Create x-axis
    svg.append('g')
        .attr('class', 'x-axis')
        .attr('transform', `translate(0, ${height})`)
        .call(d3.axisBottom(xScale).ticks(10));

        svg.append('g')
        .attr('class', 'y-axis')
        .attr('transform', `translate(0, 0)`)
        .call(d3.axisLeft(yScale).ticks(10));

       
}


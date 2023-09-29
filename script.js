const data = {
  expenses: {
      "movie": getRandomValue(),
      "food": getRandomValue(),
      "rent": getRandomValue()
  },
  income: {
      "earnings": getRandomValue(),
  }
};

// Преобразование данных для круговой диаграммы
const formattedData = [];
for (const category in data.expenses) {
  formattedData.push({ category, amount: data.expenses[category] });
}
for (const category in data.income) {
  formattedData.push({ category, amount: data.income[category] });
}



// Chart dimensions
const width = 300;
const height = 300;
const radius = Math.min(width, height) / 2;

// Colors for the pie chart
const colors = ["#70d6ff", "#ff70a6", "#ff9770", "#ffd670"];

// Create an initial SVG for the pie chart
const svg = d3.select("#chart").append("svg")
  .attr("width", width)
  .attr("height", height)
  .append("g")
  .attr("transform", `translate(${width / 2},${height / 2})`);

// Create an SVG for the legend
const legendSvg = d3.select("#legend").append("svg")

// Define the pie layout
const pie = d3.pie()
  .value(d => d.amount);

// Define the arc generator
const arc = d3.arc()
  .outerRadius(radius - 10)
  .innerRadius(0)


// Create initial pie slices
const path = svg.selectAll("path")
  .data(pie(formattedData))
  .enter().append("path")
  .attr("fill", (d, i) => colors[i])
  .attr("d", arc)
  .each(function(d) { this._current = d; }); // Store the initial angles

// Create legend items
const legendItems = legendSvg.selectAll("g")
  .data(formattedData)
  .enter().append("g")
  .attr("transform", (d, i) => `translate(10, ${i * 25 + 10})`)
  
  

legendItems.append("rect")
  .attr("width", 20)
  .attr("height", 20)
  .attr("fill", (d, i) => colors[i]);

legendItems.append("text")
  .attr("x", 30)
  .attr("y", 12)
  .text(d => `${d.category}`);
 

// Function to update the pie chart with new random data
function updateData() {
  for (const category in data.expenses) {
      data.expenses[category] = getRandomValue();
  }
  for (const category in data.income) {
      data.income[category] = getRandomValue();
  }

  const updatedData = [];
  for (const category in data.expenses) {
      updatedData.push({ category, amount: data.expenses[category] });
  }
  for (const category in data.income) {
      updatedData.push({ category, amount: data.income[category] });
  }

  path.data(pie(updatedData))
      .transition()
      .duration(1000)
      .attrTween("d", arcTween); // Use custom arcTween function for smooth transitions

  // Update text labels
  svg.selectAll("text")
      .data(pie(updatedData))
      .transition()
      .duration(1000)
      .attr("transform", d => `translate(${arc.centroid(d)})`)
      .text(d => d.data.category); // Display the category as text
}

// Custom arcTween function for smooth transitions
function arcTween(a) {
  const i = d3.interpolate(this._current, a);
  this._current = i(0);
  return function(t) {
      return arc(i(t));
  };
}

// Helper function to get random values
function getRandomValue() {
  return Math.random() * 100;
}

// Initial chart rendering
updateData();

// Button click event to update data
document.getElementById("updateButton").addEventListener("click", updateData);
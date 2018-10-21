// Deplyed to: https://mighty-citadel-48390.herokuapp.com/ 

function buildMetadata(sample) {

    console.log("trying to load metadata: " + sample);

    d3.json("/metadata/" + sample).then((metadata) => {
        console.log(metadata);
        var selector = d3.select('#sample-metadata')
        selector.html("")
        Object.entries(metadata).forEach((sample) => {
          selector
          .append('div')
          .text(sample[0] + " : " + sample[1])
        });

    });

}

function buildCharts(sample) {

  // @TODO: Use `d3.json` to fetch the sample data for the plots

    // @TODO: Build a Bubble Chart using the sample data

    // @TODO: Build a Pie Chart
    // HINT: You will need to use slice() to grab the top 10 sample_values,
    // otu_ids, and labels (10 each).
    d3.json("/samples/" + sample).then((sample) => {
      // console.log(sample);
      var bellies = sample.otu_ids.map((id, index) => {
        return {id: id, value: sample.sample_values[index]}
      })
      // console.log(bellies);
      bellies.sort((a, b) => b.value - a.value)
      // console.log("sorted")
      // console.log(bellies);
      var data = [{
         values: bellies.map((belly) => belly.value).slice(0, 10),
         labels: bellies.map((belly) => belly.id).slice(0, 10),
         type: 'pie'
      }];
      var bubble_data = [{
      	x: sample.otu_ids,
      	y: sample. sample_values,
      	text: sample.otu_labels,
      	mode: 'markers',
      	marker: {
      		color:sample.otu_ids,
      		size: sample.sample_values
      		}
      	
      	}];
      Plotly.newPlot('pie', data);
      Plotly.newPlot('bubble', bubble_data);

    });
  }


function init() {
  // Grab a reference to the dropdown select element
  var selector = d3.select("#selDataset");

  // Use the list of sample names to populate the select options
  d3.json("/names").then((sampleNames) => {
    sampleNames.forEach((sample) => {
      selector
        .append("option")
        .text(sample)
        .property("value", sample);
    });

    // Use the first sample from the list to build the initial plots
    const firstSample = sampleNames[0];
    buildCharts(firstSample);
    buildMetadata(firstSample);
  });
}

function optionChanged(newSample) {
  // Fetch new data each time a new sample is selected
  buildCharts(newSample);
  buildMetadata(newSample);
}

// Initialize the dashboard
init();

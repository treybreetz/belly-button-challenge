// Define a global variable to hold the URL
const url = 'https://2u-data-curriculum-team.s3.amazonaws.com/dataviz-classroom/v1.1/14-Interactive-Web-Visualizations/02-Homework/samples.json'

function Bargraph(sampleId) {

    d3.json(url).then(data => {

        let samples = data.samples;
        let resultArray = samples.filter(s => s.id == sampleId);
        let result = resultArray[0];

        let otu_ids = result.otu_ids;
        let otu_labels = result.otu_labels;
        let sample_values = result.sample_values;

        let yticks = otu_ids.slice(0,10).map(otuId => `OTU ${otuId}`).reverse();

        // Create a trace object
        let barData = {
            x: sample_values.slice(0,10).reverse(),
            y: yticks,
            type: 'bar',
            text: otu_labels.slice(0,10).reverse(),
            orientation: 'h'
        };

        // Put the trace object into an array
        let barArray = [barData];

        // Create a layout object
        let barLayout = {
            title: "Top 10 - Bacteria Cultures Found",
            margin: {t: 30, l: 150}
        };

        // Call the Plotly function
        Plotly.newPlot('bar', barArray, barLayout);
    })
}

function Bubblechart(sampleId) {

    d3.json(url).then(data => {
        let samples = data.samples;
        let resultArray = samples.filter(s => s.id == sampleId);
        let result = resultArray[0];

        let otu_ids = result.otu_ids;
        let otu_labels = result.otu_labels;
        let sample_values = result.sample_values;

        // Create a trace
        let bubbleData = {
            x: otu_ids,
            y: sample_values,
            text: otu_labels,
            mode: 'markers',
            marker: {
                size: sample_values,
                color: otu_ids,
                colorscale: 'Picnic'
            }
        }

        // Put the trace into an array
        let bubbleArray = [bubbleData];

        // Create a layout object
        let bubbleLayout = {
            title: 'Bacteria Cultures Per Sample',
            margin: {t: 30},
            hovermode: 'closest',
            xaxis: {title: "OTU ID"},
        };

        // Call Plotly funtion
        Plotly.newPlot('bubble', bubbleArray, bubbleLayout);
    })
}


function AllMetaData(sampleId) {

    d3.json(url).then((data) => {
        let metadata = data.metadata;

        // Filter data
        let result = metadata.filter(meta => meta.id == sampleId)[0];
        let demographicInfo = d3.select('#sample-metadata');

        // Clear existing data in demographicInfo
        demographicInfo.html('');

        // Add key and value pair to the demographicInfo panel
        Object.entries(result).forEach(([x, y]) => {
            demographicInfo.append('h6').text(`${x}: ${y}`);
        });
    });
}

function Gauge(sampleId) {

    d3.json(url).then(data => {
        let metadata = data.metadata;
        let result = metadata.filter(meta => meta.id == sampleId)[0];

        // Extract the washing frequency value
        let washFrequency = result.wfreq;

        // Create a gauge chart trace
        let gaugeData = [
            {
                type: "indicator",
                mode: "gauge+number",
                value: washFrequency,
                title: { text: "Belly Button Washing Frequency<br>Scrubs per Week", font: { size: 16 } },
                gauge: {
                    axis: { range: [null, 9], tickwidth: 1, tickcolor: "goldenrod" },
                    bar: { color: "lightpink" },
                    bgcolor: "white",
                    borderwidth: 2,
                    bordercolor: "gray",
                    steps: [
                        { range: [0, 1], color: "rgba(0, 75, 128, 0.05)" },
                        { range: [1, 2], color: "rgba(0, 75, 128, 0.1)" },
                        { range: [2, 3], color: "rgba(0, 75, 128, 0.2)" },
                        { range: [3, 4], color: "rgba(0, 75, 128, 0.3)" },
                        { range: [4, 5], color: "rgba(0, 75, 128, 0.4)" },
                        { range: [5, 6], color: "rgba(0, 75, 128, 0.5)" },
                        { range: [6, 7], color: "rgba(0, 75, 128, 0.6)" },
                        { range: [7, 8], color: "rgba(0, 75, 128, 0.7)" },                       
                        { range: [8, 9], color: "rgba(0, 75, 128, 0.8)" }
                    ],
                }
            }
        ];


        // Define the layout for the gauge chart
        let gaugeLayout = { width: 400, height: 300, margin: { t: 0, b: 0 } };

        // Call Plotly to draw the gauge chart
        Plotly.newPlot('gauge', gaugeData, gaugeLayout);
    });
}

function optionChanged(sampleId) {

    Bargraph(sampleId);
    Bubblechart(sampleId);
    AllMetaData(sampleId);
    Gauge(sampleId);
}

function FinalDashBoard() {

    // Get a handle to the dropdown
    let selector = d3.select('#selDataset');

    d3.json(url).then(data => {

        let sampleNames = data.names;

        // Populate the dropdown
        for (let i = 0; i < sampleNames.length; i++) {
            let sampleId = sampleNames[i];
            selector.append('option').text(sampleId).property('value', sampleId);
        };

        // Read the current value from the dropdown
        let initialId = selector.property('value');

        // Draw the bargraph for the selected sample id
        Bargraph(initialId);

        // Draw the bubblechart for the selected sample id
        Bubblechart(initialId);

        // Show the metadata for the selected sample id
        AllMetaData(initialId);

        // Show the gauge for the selected sample id
        Gauge(initialId);

    });

    


}

FinalDashBoard();
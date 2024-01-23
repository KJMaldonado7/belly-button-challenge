let sampleData = {};

function init() {
    // Use D3 to read samples.json
    d3.json("samples.json")
        .then(function(importedData) {
            sampleData = importedData;

            // create and populate dropdown menu, make sure it clears
            let dropdown = d3.select("#selDataset");
            // clear dropdown
            dropdown.html("");
            // create dropdown options
            sampleData.names.forEach(name => {
                dropdown.append("option").text(name).property("value", name);
            });

            // call updatePlots to update all plots with default data
            updatePlots(sampleData.names[0]);
        })
}

function updatePlots(selectedID) {
    barchart(selectedID);
    bubblechart(selectedID);
    displayMetadata(selectedID);
}

// create horizontal bar chart
function barchart(selectedID) {
    let selectedData = sampleData.samples.find(sample => sample.id === selectedID);
    let { sample_values, otu_ids, otu_labels } = selectedData;
    let sortedData = sample_values.slice(0, 10).reverse();
    let otuIDs = otu_ids.slice(0, 10).map(id => `OTU ${id}`);
    let otuLabels = otu_labels.slice(0, 10);

    let data = [
        {
            x: sortedData,
            y: otuIDs,
            text: otuLabels,
            type: "bar",
            orientation: "h",
        },
    ];

    let layout = {
        height: 600,
        width: 800,
    };

    Plotly.newPlot("bar", data, layout);
}

// create bubble chart
function bubblechart(selectedID) {
    let selectedData = sampleData.samples.find(sample => sample.id === selectedID);

    let trace1 = {
        x: selectedData.otu_ids,
        y: selectedData.sample_values,
        text: selectedData.otu_labels,
        mode: "markers",
        marker: {
            size: selectedData.sample_values,
            color: selectedData.otu_ids,
            colorscale: "YlGnBu",
        },
    };

    let data = [trace1];

    let layout = {
        height: 600,
        width: 1300,
    };

    Plotly.newPlot("bubble", data, layout);
}

// display metadata
function displayMetadata(selectedID) {
    let metadataInfo = d3.select("#sample-metadata");
    // clear metadata
    metadataInfo.html("");

    // populate selected data/id
    let selectedMetadata = sampleData.metadata.find(metadata => metadata.id === parseInt(selectedID));

    Object.entries(selectedMetadata).forEach(([key, value]) => {
        metadataInfo.append("p").text(`${key}: ${value}`);
    });
}

// change dropdown selection
function DropdownChange(selectedID) {
    updatePlots(selectedID);
}

// Initialize the dashboard
init();
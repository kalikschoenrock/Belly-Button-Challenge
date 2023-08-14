// Create a horizontal bar chart with a dropdown menu to display the top 10 OTUs found in that individual.
    // Use sample_values as the values or the bar chart
    // Use otu_ids as the labels for the bar chart.
    // Use otu_labels as the hovertext for the chart.

//---------------------------------------------------------
// Read in the data

const url = "https://2u-data-curriculum-team.s3.amazonaws.com/dataviz-classroom/v1.1/14-Interactive-Web-Visualizations/02-Homework/samples.json";
//  Initilize lists for the data
let sHovertext = [];
let sValues = [];
let sLabels = [];
let samples = [];

// Fetch the JSON data
let data = d3.json(url);

data.then(function(d) {

    // Pull first subject's data
    sHovertext = d.samples[1].otu_ids;
    sValues = d.samples[1].sample_values;
    sLabels = d.samples[1].otu_labels;
    
    // Make list of dictionaries for samples 
    samples = d.samples;


    // Build initial plot using a function
    function init() {
        let data = [{
            y: sValues,
            x: sHovertext,
            type: "bar",
            orientation: "h",
            hovertext: sLabels
      
        }]
        //make initial plot
        Plotly.newPlot("cow", data);
    }

    // -----------------------------------------------------------
    // Drop Down Menu Options
    let dropDownOptions = d["samples"].map(item => item.id);
    console.log(`THeses are the drop down objects${dropDownOptions[1]}`)

    // For loop to put in the options 
    for (let i =0; i< dropDownOptions.length; i++) {
        var x = document.getElementById("selDataset");
        var option = document.createElement("option");
        option.text = dropDownOptions[i];
        option.value = dropDownOptions[i];
        x.add(option);
      
    };
  

    // -----------------------------------------------------------
    // Establish what happens when drop down menu is used 
    document.getElementById("selDataset").onchange = function() {optionChanged()};;

    // Grab data for drop down
    function optionChanged() {
        var x = document.getElementById("selDataset");
        let dataset = x.value;
        console.log(x.value);

        // filter function to make sure the id matches the dropdown
        function grabDict(sample) {
            console.log(`dataset inside the grabDict function: ${dataset}`);
            return sample.id == dataset;
        };

        // Apply filter to grab just the chosen dataset dictionary
        let dataset_dict = samples.filter(grabDict);
        console.log(`dataset_dict: ${JSON.stringify(dataset_dict)}`);


        // Send chosen dataset through the format Data function to be readied to plot
        let data = formatData(dataset_dict);
        
        
        // Call function to update plots
        updatePlotly(data);

        update_bubbleChart(dataset_dict[0].otu_ids, dataset_dict[0].sample_values);

        
    };
        
    // Function to update the restyled plot's values
    function updatePlotly(newdata) {
        Plotly.newPlot("cow",newdata);
    };

  
    
    init();
    init_bubbleChart()
});



// Function to reformat dataset to ready for plotting
function formatData(dataset_dict) {
    // Pseudocode: Would sort data by highest population of the bacteria and then slice it to get the top ten
    let da = dataset_dict[0];

    // Initialize lists
    var data_org =[];
    let otu_ids = da.otu_ids;
    let sample_values = da.sample_values;
    let otu_labels = da.otu_labels

    // Loop through lists and create a list of dictionaries (a dictionary for each otu)
    for (i=0; i<otu_ids.length; i++) {
        var s ={
            ids: otu_ids[i],
            svs: sample_values[i],
            labels: otu_labels[i]

        };
        data_org.push(s);
    };

    // Sort the list of dictionaries by the sample value, descending
    let sorted_data_org = data_org.sort((a,b) => b.svs - a.svs);

    // Slice the data so only the 10 otus with the highest sample values are picked
    let sliced_data_org = sorted_data_org.slice(0,10);

    //initialize empty lists to fill in the x and y values needed to graph
    var x_values = [];
    var y_values = [];
    var SHovertext = [];
    for (i=0; i<10;i++) {
        x_values.push(sliced_data_org[i].ids);
        y_values.push(sliced_data_org[i].svs);
        SHovertext.push(sliced_data_org[i].labels)
    };


    console.log(x_values);
    
    console.log(y_values);

    let data = [{
        y: x_values,
        x: y_values,
        type: "bar",
        orientation: "h",
        hovertext: SHovertext
  
    }];
    
    return data;
};

// Function to initiate the bubble chart
//Random data was used 
function init_bubbleChart() {
    var trace1 = {
        x: [1, 2, 3, 4],
        y: [10, 11, 12, 13],
        mode: 'markers',
        marker: {
          color: ['rgb(93, 164, 214)', 'rgb(255, 144, 14)',  'rgb(44, 160, 101)', 'rgb(255, 65, 54)'],
          
          size: [40, 60, 80, 100]
        }
      };
      
      var data = [trace1];
      
      var layout = {
        title: 'Marker Size and Color',
        showlegend: false,
        height: 600,
        width: 600
      };
      
      Plotly.newPlot('bubble', data, layout);
};

// Function to update the bubblechart depending on the dropdown choice
function update_bubbleChart(xs,ys) {
    // Make an array for to size the bubbles. 
    var marker_size = [];
        for (var i = 0; i <= xs.length; i++) {
        marker_size.push(i);
        };
    var trace1 = {
        x: xs,
        y: ys,
        mode: 'markers',
        marker: {
          //pseudocode: color: would make each bubble a different color depending on the otu_id
          //pseudocode: Need to also sort the sample values and then they would be scaled properly
          size: marker_size
        }
      };
      
      var data = [trace1];
      
      var layout = {
        title: 'Marker Size and Color',
        showlegend: false,
        height: 600,
        width: 600
      };
      
      Plotly.newPlot('bubble', data, layout);
};
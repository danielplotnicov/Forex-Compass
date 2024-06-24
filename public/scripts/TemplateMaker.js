// Create a set to track added indicators
const addedIndicators = new Set();

// Add an event listener to the "Add Indicator" button
document.getElementById('addIndicatorButton').addEventListener('click', function() {
    const indicatorsSelect = document.getElementById('indicators');  // Get the indicators dropdown
    const selectedIndicator = indicatorsSelect.options[indicatorsSelect.selectedIndex].text;  // Get the selected indicator
    const indicatorList = document.getElementById('indicatorList');  // Get the list element to display added indicators

    // Check if the indicator has already been added
    if (addedIndicators.has(selectedIndicator)) {
        alert('This indicator has already been added.');
        return;
    }

    // Add the selected indicator to the set
    addedIndicators.add(selectedIndicator);

    // Create a new list item element
    const li = document.createElement('li');
    li.textContent = selectedIndicator;

    // Create a remove button for the list item
    const removeButton = document.createElement('button');
    removeButton.textContent = 'Remove';
    // Set styles for the remove button
    removeButton.style.backgroundColor = '#dc3545';
    removeButton.style.color = '#fff';
    removeButton.style.border = 'none';
    removeButton.style.borderRadius = '5px';
    removeButton.style.padding = '5px 10px';
    removeButton.style.cursor = 'pointer';
    removeButton.style.marginLeft = '10px';

    // Add an event listener to the remove button to handle removal of the indicator
    removeButton.addEventListener('click', function() {
        indicatorList.removeChild(li);
        addedIndicators.delete(selectedIndicator);
    });

    // Append the remove button to the list item and the list item to the list
    li.appendChild(removeButton);
    indicatorList.appendChild(li);
});

// Add an event listener to the form submission
document.getElementById('strategyForm').addEventListener('submit', function(event) {
    event.preventDefault();  // Prevent the default form submission behavior

    // Get the form input values
    const strategyName = document.getElementById('strategyName').value;
    const indicators = Array.from(document.getElementById('indicatorList').children).map(li => li.firstChild.textContent);
    const description = document.getElementById('description').value;

    // Function to generate a random ID
    function generateRandomId() {
        return Math.floor(Math.random() * 1e18).toString();
    }

    // Define the strategy details
    const strategyDetails = {
        id: generateRandomId(),  // Generate a random ID for the strategy
        symbol: 'EURUSD',
        description: description,
        period_type: 1,
        period_size: 1,
        digits: 5,
        tick_size: 0.000000,
        position_time: Math.floor(new Date().getTime() / 1000),  // Current timestamp in seconds
        scale_fix: 0,
        scale_fixed_min: 1.0786,
        scale_fixed_max: 1.0893,
        windowHeight: 100  // Default height; adjust based on UI or requirements
    };


    // Generate the template content using the selected indicators and strategy details
    const tplContent = generateTplContent(indicators, strategyDetails);

    // Send a POST request to save the template
    fetch('/save-template', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ strategyName, templateContent: tplContent })
    })
        .then(response => {
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            return response.json();
        })
        .then(data => {
            if (data.templateId) {
                // Reload templates to update the profile page
                window.loadTemplates();
            } else {
                alert('Error saving template');
            }
        })
        .catch(error => console.error('Error:', error))
        .finally(() => {
            // Download the template file regardless of the save result
            const blob = new Blob([tplContent], { type: 'text/plain' });
            const url = URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.href = url;
            a.download = `${strategyName}.tpl`;
            a.click();
            URL.revokeObjectURL(url);
        });
});

// Function to generate the template content
function generateTplContent(indicators, strategyDetails) {
    // Predefined templates for different indicators
    const indicatorTemplates = {
        'Simple Moving Average (SMA)': `<indicator>
name=Moving Average
path=
apply=1
show_data=1
scale_inherit=0
scale_line=0
scale_line_percent=50
scale_line_value=0.000000
scale_fix_min=0
scale_fix_min_val=0.000000
scale_fix_max=0
scale_fix_max_val=0.000000
expertmode=0
fixed_height=-1

<graph>
name=
draw=129
style=0
width=1
color=255
</graph>
period=10
method=0
</indicator>`,

        'Exponential Moving Average (EMA)': `<indicator>
name=Double Exponential Moving Average
path=
apply=1
show_data=1
scale_inherit=0
scale_line=0
scale_line_percent=50
scale_line_value=0.000000
scale_fix_min=0
scale_fix_min_val=0.000000
scale_fix_max=0
scale_fix_max_val=0.000000
expertmode=0
fixed_height=-1

<graph>
name=
draw=129
style=0
width=1
color=255
</graph>
period=14
</indicator>`,

        'Moving Average Convergence Divergence (MACD)': `<indicator>
name=MACD
path=
apply=1
show_data=1
scale_inherit=0
scale_line=0
scale_line_percent=50
scale_line_value=0.000000
scale_fix_min=0
scale_fix_min_val=-0.002818
scale_fix_max=0
scale_fix_max_val=0.003037
expertmode=0
fixed_height=-1

<graph>
name=
draw=2
style=0
width=1
color=12632256
</graph>

<graph>
name=
draw=1
style=2
width=1
color=255
</graph>
fast_ema=12
slow_ema=26
macd_sma=9
</indicator>`,

        'Relative Strength Index (RSI)': `<indicator>
name=Relative Strength Index
path=
apply=1
show_data=1
scale_inherit=0
scale_line=0
scale_line_percent=50
scale_line_value=0.000000
scale_fix_min=1
scale_fix_min_val=0.000000
scale_fix_max=1
scale_fix_max_val=100.000000
expertmode=0
fixed_height=-1

<graph>
name=
draw=1
style=0
width=1
color=16748574
</graph>

<level>
level=30.000000
style=2
color=12632256
width=1
descr=
</level>

<level>
level=70.000000
style=2
color=12632256
width=1
descr=
</level>
period=14
</indicator>`,

        'Bollinger Bands': `<indicator>
name=Bollinger Bands
path=
apply=1
show_data=1
scale_inherit=0
scale_line=0
scale_line_percent=50
scale_line_value=0.000000
scale_fix_min=0
scale_fix_min_val=0.000000
scale_fix_max=0
scale_fix_max_val=0.000000
expertmode=0
fixed_height=-1

<graph>
name=
draw=131
style=0
width=1
arrow=0
shift=0
shift_y=0
color=255
</graph>

<graph>
name=
draw=131
style=0
width=1
arrow=0
shift=0
shift_y=0
color=255
</graph>

<graph>
name=
draw=131
style=0
width=1
arrow=0
shift=0
shift_y=0
color=255
period=20
deviation=2.000000
</indicator>`,

        'Stochastic Oscillator': `<indicator>
name=Stochastic Oscillator
path=
apply=0
show_data=1
scale_inherit=0
scale_line=0
scale_line_percent=50
scale_line_value=0.000000
scale_fix_min=1
scale_fix_min_val=0.000000
scale_fix_max=1
scale_fix_max_val=100.000000
expertmode=0
fixed_height=-1

<graph>
name=
draw=1
style=0
width=1
color=3329330
</graph>

<graph>
name=
draw=1
style=2
width=1
color=255
</graph>

<level>
level=20.000000
style=2
color=12632256
width=1
descr=
</level>

<level>
level=80.000000
style=2
color=12632256
width=1
descr=
</level>
kperiod=8
dperiod=3
slowing=3
price_apply=0
method=0
</indicator>`
    };

    // Generate XML for each selected indicator using its template
    const indicatorXML = indicators.map(indicatorName => {
        console.log(`Processing indicator: ${indicatorName}`);
        if (indicatorTemplates[indicatorName]) {
            console.log(`Found template for indicator: ${indicatorName}`);
            return `<window>
height=${strategyDetails.windowHeight}
objects=0
${indicatorTemplates[indicatorName]}
</window>`;
        } else {
            console.error(`No template found for indicator: ${indicatorName}`);
            return ''; // or handle differently if necessary
        }
    }).join('');

    console.log('Indicator XML:', indicatorXML);

    // Generate the complete template content with all the indicators and strategy details
    const tplContent = `<chart>
id=${strategyDetails.id}
symbol=${strategyDetails.symbol}
description=${strategyDetails.description}
period_type=${strategyDetails.period_type}
period_size=${strategyDetails.period_size}
digits=${strategyDetails.digits}
tick_size=${strategyDetails.tick_size}
position_time=${strategyDetails.position_time}
scale_fix=${strategyDetails.scale_fix}
scale_fixed_min=${strategyDetails.scale_fixed_min}
scale_fixed_max=${strategyDetails.scale_fixed_max}
windows_total=${indicators.length}
${indicatorXML}
</chart>`;

    console.log('Generated TPL Content:', tplContent);

    return tplContent;
}

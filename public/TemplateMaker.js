const addedIndicators = new Set();

document.getElementById('addIndicatorButton').addEventListener('click', function() {
    const indicatorsSelect = document.getElementById('indicators');
    const selectedIndicator = indicatorsSelect.options[indicatorsSelect.selectedIndex].text;
    const indicatorList = document.getElementById('indicatorList');

    if (addedIndicators.has(selectedIndicator)) {
        alert('This indicator has already been added.');
        return;
    }

    addedIndicators.add(selectedIndicator);

    const li = document.createElement('li');
    li.textContent = selectedIndicator;

    const removeButton = document.createElement('button');
    removeButton.textContent = 'Remove';
    removeButton.style.backgroundColor = '#dc3545';
    removeButton.style.color = '#fff';
    removeButton.style.border = 'none';
    removeButton.style.borderRadius = '5px';
    removeButton.style.padding = '5px 10px';
    removeButton.style.cursor = 'pointer';
    removeButton.style.marginLeft = '10px';
    removeButton.addEventListener('click', function() {
        indicatorList.removeChild(li);
        addedIndicators.delete(selectedIndicator);
    });

    li.appendChild(removeButton);
    indicatorList.appendChild(li);
});

document.getElementById('strategyForm').addEventListener('submit', function(event) {
    event.preventDefault();

    const strategyName = document.getElementById('strategyName').value;
    const indicators = Array.from(document.getElementById('indicatorList').children).map(li => li.firstChild.textContent);
    const description = document.getElementById('description').value;

    const strategyDetails = {
        id: '133603774023127622', // Example ID, generate or fetch as needed
        symbol: 'EURUSD',
        description: description,
        period_type: 1,
        period_size: 1,
        digits: 5,
        tick_size: 0.000000,
        position_time: new Date().getTime() / 1000 | 0, // Current timestamp in seconds
        scale_fix: 0,
        scale_fixed_min: 1.0786,
        scale_fixed_max: 1.0893,
        windowHeight: 100 // Default height; adjust based on UI or requirements
    };

    const tplContent = generateTplContent(indicators, strategyDetails);

    downloadTplFile(`${strategyName}.tpl`, tplContent);

    console.log('Strategy Name:', strategyName);
    console.log('Selected Indicators:', indicators);
    console.log('Description:', description);
});

function generateTplContent(indicators, strategyDetails) {
    const indicatorTemplates = {
        'SMA': `<indicator>
name=Simple Moving Average
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
</indicator>`,

        'EMA': `<indicator>
name=Exponential Moving Average
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
</indicator>`,

        'MACD': `<indicator>
name=Moving Average Convergence Divergence
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
draw=1
style=0
width=1
arrow=0
shift=0
shift_y=0
color=255
</graph>
</indicator>`,

        'RSI': `<indicator>
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
arrow=0
shift=0
shift_y=0
color=65280
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
</graph>
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
        // More indicators can be added here following the same pattern.
    };

    // Handle cases where the indicator might not be defined
    const indicatorXML = indicators.map(indicatorName => {
        if (indicatorTemplates[indicatorName]) {
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

    return `<chart>
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
}

function downloadTplFile(filename, content) {
    const blob = new Blob([content], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = filename;
    a.click();
    URL.revokeObjectURL(url);
}

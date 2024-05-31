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

    const tplContent = generateTplContent(indicators);

    downloadTplFile(`${strategyName}.tpl`, tplContent);

    console.log('Strategy Name:', strategyName);
    console.log('Selected Indicators:', indicators);
    console.log('Description:', description);
});

function generateTplContent(indicators) {
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
<graph>
name=
draw=1
style=0
width=1
arrow=0
shift=0
shift_y=0
color=255,
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
<graph>
name=
draw=1
style=0
width=1
arrow=0
shift=0
shift_y=0
color=65280,
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
        'BollingerBands': `<indicator>
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
<graph>
name=
draw=1
style=0
width=1
arrow=0
shift=0
shift_y=0
color=255,
</graph>
<graph>
name=
draw=1
style=0
width=1
arrow=0
shift=0
shift_y=0
color=255,
</graph>
<graph>
name=
draw=1
style=0
width=1
arrow=0
shift=0
shift_y=0
color=255,
</graph>
period=20
deviation=2
shift=0
</indicator>`,
        'StochasticOscillator': `<indicator>
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
<graph>
name=
draw=1
style=0
width=1
arrow=0
shift=0
shift_y=0
color=3329330,
</graph>
<graph>
name=
draw=1
style=2
width=1
arrow=0
shift=0
shift_y=0
color=255,
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

    return `<chart>
id=128968182740683593
symbol=USDJPY
period_type=1
period_size=1
digits=2
tick_size=0.000000
position_time=0
scale_fix=0
scale_fixed_min=91.800000
scale_fixed_max=95.200000
scale_fix11=0
scale_bar=0
scale_bar_val=1.000000
scale=4
mode=1
fore=0
grid=1
volume=0
scroll=1
shift=0
shift_size=20.000000
fixed_pos=0.000000
ohlc=0
bidline=1
askline=0
lastline=0
days=1
descriptions=0
window_left=0
window_top=0
window_right=0
window_bottom=0
window_type=1
background_color=0
foreground_color=16777215
barup_color=65280
bardown_color=65280
bullcandle_color=0
bearcandle_color=16777215
chartline_color=65280
volumes_color=3329330
grid_color=10061943
bidline_color=10061943
askline_color=255
lastline_color=49152
stops_color=255

<window>
height=100
${indicators.map(indicator => indicatorTemplates[indicator]).join('')}
</window>
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
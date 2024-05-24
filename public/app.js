const currencyPairs = ['EURUSD', 'GBPUSD', 'USDCHF', 'USDJPY', 'AUDUSD', 'NZDUSD', 'USDCAD'];

const previousPrices = {};

const socket = new WebSocket('ws://localhost:8080');

socket.onopen = () => {
    console.log('WebSocket connection opened');
};

socket.onmessage = (event) => {
    console.log('Data received from server:', event.data);
    const data = JSON.parse(event.data);

    currencyPairs.forEach(symbol => {
        const askElement = document.getElementById(`${symbol.toLowerCase()}-ask`);
        const bidElement = document.getElementById(`${symbol.toLowerCase()}-bid`);

        console.log(`Updating prices for ${symbol}:`, data[symbol]);

        updatePriceElement(askElement, data[symbol].ask, symbol, 'ask');
        updatePriceElement(bidElement, data[symbol].bid, symbol, 'bid');
    });
};

socket.onclose = () => {
    console.log('WebSocket connection closed');
};

function updatePriceElement(element, newPrice, symbol, type) {
    if (!element) { // Check if the element exists
        console.error(`Element not found for ${symbol}-${type}`);
        return;
    }

    const previousPrice = previousPrices[`${symbol}-${type}`];

    element.textContent = newPrice;

    if (previousPrice !== undefined) {
        if (newPrice > previousPrice) {
            element.style.color = 'green';
        } else if (newPrice < previousPrice) {
            element.style.color = 'red';
        } else {
            element.style.color = ''; // Reset to default color
        }
    }

    previousPrices[`${symbol}-${type}`] = newPrice;
}

$('.menubutton a').on('click', function (e) {

    e.preventDefault();

    $(this).parent().addClass('active');
    $(this).parent().siblings().removeClass('active');

    target = $(this).attr('href');

    // $('.tab-content > div').not(target).hide();

    $(target).fadeIn(600);

});
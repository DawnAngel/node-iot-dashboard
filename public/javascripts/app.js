(function($, window, document) {
    'use strict';

    /**
     * Add chart to the html
     */
    function addChart(key, serie, min, max)  {
        var rangeDiff = Math.max(max - min, 1)/1000;

        var newChartId = "chart-id-" + parseInt(Math.random()*10E16, 10);

        var chartGenericElement = document.querySelector("#chart-generic");
        var titleElement = document.createElement('h3');
        var chartElement = chartGenericElement.cloneNode();
        var brElement = document.createElement('br');
        var hrElement = document.createElement('hr');

        titleElement.innerHTML = key;

        chartElement.id = newChartId;
        chartElement.className = 'epoch';

        chartGenericElement.parentNode.appendChild(titleElement);
        chartGenericElement.parentNode.appendChild(brElement);
        chartGenericElement.parentNode.appendChild(chartElement);
        chartGenericElement.parentNode.appendChild(hrElement);

        var domain = [min - rangeDiff, max + rangeDiff];
        var scale = d3.scale.linear().domain(domain).nice();
        console.log(domain);

        var graph = new Rickshaw.Graph({
            element: chartElement,
            height: 200,
            renderer: 'line',
            series: [{
                color: "#29b980",
                data: serie,
                name: key,
                scale: scale
            }]
        });
        var hover = new Rickshaw.Graph.HoverDetail({
            graph: graph
        });
        var axes = new Rickshaw.Graph.Axis.Time({
            graph: graph
        });
        var y_axis = new Rickshaw.Graph.Axis.Y.Scaled({
            graph: graph,
            scale: scale
        });
        graph.render();
    }

    // Initialize dashboard
    $(function() {
        $.getJSON('/api/data', function(json) {
            json.data.forEach(function(data, index) {
                addChart(data.id, data.data, data.min, data.max);
            });
        });
    });
}(window.jQuery, window, document));

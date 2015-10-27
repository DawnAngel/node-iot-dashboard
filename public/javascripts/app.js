(function($, window, document) {
    'use strict';

    var graphs = {};

    var series = {};

    /**
     * Add chart to the html
     */
    function addChart(key, serie, min, max)  {

        if (undefined === graphs[key]) {
            series[key] = serie;

            var rangeDiff = Math.max(max - min, 1)/100;
            var newChartId = "chart-id-" + key;
            var chartElement = document.querySelector("#"+newChartId);

            if (!chartElement) {
                var chartGenericElement = document.querySelector("#chart-generic");
                chartElement = chartGenericElement.cloneNode();
                chartElement.id = newChartId;
                chartElement.className = 'epoch';

                var titleElement = document.createElement('h3');
                titleElement.innerHTML = key;

                chartGenericElement.parentNode.appendChild(titleElement);
                chartGenericElement.parentNode.appendChild(document.createElement('br'));
                chartGenericElement.parentNode.appendChild(chartElement);
                chartGenericElement.parentNode.appendChild(document.createElement('hr'));
            }

            var domain = [min - rangeDiff, max + rangeDiff];
            var scale = d3.scale.linear().domain(domain).nice();

            var graph = new Rickshaw.Graph({
                element: chartElement,
                height: 200,
                renderer: 'line',
                series: [{
                    color: "#29b980",
                    data: series[key],
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
            graphs[key] = graph;
            graphs[key].render();
        } else {

            series[key].map(function(value, index) {
                series[key][index] = serie[index];
            });
            graphs[key].update();
        }

    }

    // Initialize dashboard
    $(function() {
        window.setInterval(function() {
            $.getJSON('/api/data', function(json) {
                json.data.forEach(function(data, index) {
                    addChart(data.id, data.data, data.min, data.max);
                });
            });
        },1000);
    });
}(window.jQuery, window, document));

Chart.plugins.register({

	label_options: {
		enabled: false,
		font_style: "normal",
		font_family: "Arial",
		font_color: "white",
		background_color: "#FFBA4B",
		default_width: 1150,
		default_font_size: 20,
		default_padding: 10,
		default_arrow_width: 20,
		show_zeros: true
	},

	draw_single_label: function(chart, text, element) {

		var ctx = chart.ctx;
		var position = element.getCenterPoint();

		var font_size = Math.min(chart.width * this.get_option(chart, "default_font_size") / this.get_option(chart, "default_width"), this.get_option(chart, "default_font_size"));
		var padding = Math.min(chart.width * this.get_option(chart, "default_padding") / this.get_option(chart, "default_width"), this.get_option(chart, "default_padding"));
		var arrow_width = Math.min(chart.width * this.get_option(chart, "default_arrow_width") / this.get_option(chart, "default_width"), this.get_option(chart, "default_arrow_width"));

		ctx.save();

		ctx.font = Chart.helpers.fontString(font_size, this.get_option(chart, "font_style"), this.get_option(chart, "font_family"));
		ctx.textBaseline = 'top';
		ctx.textAlign = 'left';

		var width_text = ctx.measureText(text).width;

		var x_rectangle = (position.x - element._model.width / 2 - width_text - padding * 2);
		var y_rectangle = position.y - padding;
		var height_rectangle = parseInt(font_size) + padding * 2;
		var width_rectangle = width_text + padding * 2;

		// Min height
		if (y_rectangle + height_rectangle >= chart.chart.chartArea.bottom) {
			y_rectangle = chart.chart.chartArea.bottom - height_rectangle - 5;
		}

		// Arrow (triangle)
		var x_triangle = x_rectangle + width_rectangle - 1;
		var y_triangle = y_rectangle;
		var height_triangle = parseInt(font_size) + padding * 2;

		// Space between the full box and the chart (X only)
		var box_margin_x = Math.min(element._model.width, 100);

		// draw the box		
		ctx.fillStyle = this.get_option(chart, "background_color");
		ctx.fillRect(x_rectangle - box_margin_x,
					y_rectangle,
					width_rectangle,
					height_rectangle);

		//draw the triangle
		ctx.beginPath();
		ctx.moveTo(x_triangle - box_margin_x, y_triangle);
		ctx.lineTo(x_triangle - box_margin_x + arrow_width, y_triangle + height_triangle / 2);
		ctx.lineTo(x_triangle - box_margin_x, y_triangle + height_triangle);
		ctx.fill();

		// draw the text
		ctx.fillStyle = this.get_option(chart, "font_color");
		ctx.fillText(text, x_rectangle - box_margin_x + padding, y_rectangle + padding);

		ctx.restore();

	},

	calculate_labels: function(chart) {

		var that = this;

		if (chart.data.datasets.length > 0) {
			var meta = chart.getDatasetMeta(0);

			if (!meta.hidden && chart.data.datasets.length == 1) {

				var first_value = chart.data.datasets[0].data[0];

				meta.data.forEach(function(element, index) {

					if (index > 0) {
						var value = Math.round(chart.data.datasets[0].data[index] * 100 / first_value);

						if (value > 0 || that.get_option(chart, "show_zeros")) {
							that.draw_single_label(chart, value + "%", element);
						}

					}
				});
			}
		}

	},

	get_option: function(chart, option) {
		if (typeof(this.label_options[option]) != "undefined") {
			if ( (typeof(chart.options.funnel_labels) != "undefined") && (typeof(chart.options.funnel_labels[option]) != "undefined") ) {
				option_value = chart.options.funnel_labels[option];
			} else {
				option_value = this.label_options[option];
			}
		} else option_value = "";

		return option_value;
	},

	afterInit: function(chart) {

	},

	afterDatasetsDraw: function(chart, easing) {
		// To only draw at the end of animation, check for easing === 1
		if (this.get_option(chart, "enabled")) {
			this.calculate_labels(chart);
		}
	},

	resize: function(chart) {
		if (this.get_option(chart, "enabled")) {
			this.calculate_labels(chart);
		}
	}
});

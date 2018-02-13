Chart.plugins.register({

	label_options: {
		enabled: false,
		font_style: "normal",
		font_family: "Arial",
		font_color: "white",
		background_color: "#FFBA4B",
		rectangle_width_scale_factor: 5,
		show_zeros: true,
		decimals: 1,
		min_width_upper_label: 150,
		allow_upper_label: true,
		force_upper_label: false,
    border_color: '#FFBA4B',
    border_colors: [],
		sub_text: null,
    sub_text_size: 10,
		text_align: "center"
	},

	draw_left_label: function(chart, text, x_previous, x_current, y_current, labelIndex) {
		var ctx = chart.ctx;
		var available_width = x_current - x_previous;

		var rectangle_width = available_width / this.get_option(chart, "rectangle_width_scale_factor");
		var triangle_width = rectangle_width / 3;

		var font_size = rectangle_width / 3;
		var padding_x = text.length * 3;
		var padding_y = rectangle_width / 5;

		ctx.font = Chart.helpers.fontString(font_size, this.get_option(chart, "font_style"), this.get_option(chart, "font_family"));
		ctx.textBaseline = "top";
		ctx.textAlign = this.get_option(chart, "text_align");

		var common_height = font_size + padding_y * 2;
		var x_rectangle = x_previous + (available_width / 2) - ((rectangle_width + triangle_width) / 2);
		var y_rectangle = y_current - common_height / 2;

		// Min y position
		if (y_rectangle + common_height >= chart.chart.chartArea.bottom) {
			y_rectangle = chart.chart.chartArea.bottom - common_height - 5;
		}

		// Arrow (triangle)
		var x_triangle = x_rectangle + padding_x / 2 + rectangle_width - 1;
		var y_triangle = y_rectangle;

		ctx.save();

		// draw the box		
		ctx.fillStyle = this.get_option(chart, "background_color");
		ctx.fillRect(x_rectangle - padding_x / 2,
					y_rectangle,
					rectangle_width + padding_x,
					common_height);

		// determine border color - ALLOWS GRADIENT!
    var borderColors = this.get_option(chart, "border_colors");
    if(borderColors.length > 1 && borderColors[labelIndex]) {
      // render gradient
      var borderGradient = ctx.createLinearGradient(x_rectangle, 0, x_rectangle + rectangle_width + triangle_width, 0);
      borderGradient.addColorStop("0", borderColors[labelIndex - 1]);
      borderGradient.addColorStop("1", borderColors[labelIndex]);
      ctx.strokeStyle = borderGradient;
    } else if(borderColors.length === 1) {
      ctx.strokeStyle = borderColors[0];
    } else {
      // render borderColor
      ctx.strokeStyle = this.get_option(chart, "border_color");
    }
    ctx.strokeRect(x_rectangle - padding_x / 2,
      y_rectangle,
      rectangle_width + padding_x,
      common_height);

		//draw the triangle
		ctx.beginPath();
    ctx.lineWidth = 2;
		ctx.moveTo(x_triangle, y_triangle);
		ctx.lineTo(x_triangle + triangle_width, y_triangle + common_height / 2);
		ctx.lineTo(x_triangle, y_triangle + common_height);
    ctx.stroke();
		ctx.fill();

		// draw the text
		ctx.fillStyle = this.get_option(chart, "font_color");
    // Calculate position of texts
    const subText = this.get_option(chart, "sub_text");

    var textXPosition;
    console.log(this.get_option(chart, "text_align"));
    switch(this.get_option(chart, "text_align")) {
			case 'center': {
				textXPosition = x_rectangle + rectangle_width / 2;
				break;
			}
			case 'right' : {
        textXPosition = x_rectangle - rectangle_width / 2;
        break;
			}
			default: {
        textXPosition = x_rectangle;
        break;
			}
		}

    if(subText) {
      const subTextSize = this.get_option(chart, "sub_text_size");
      ctx.fillText(text, textXPosition, y_rectangle + common_height / 2 - font_size / 2 - subTextSize / 2);
      ctx.font = Chart.helpers.fontString(this.get_option(chart, "sub_text_size"), this.get_option(chart, "font_style"), this.get_option(chart, "font_family"));
      ctx.fillText(subText, textXPosition, y_rectangle + common_height / 2 + subTextSize / 2);
    } else {
      ctx.fillText(text, textXPosition, y_rectangle + common_height / 2 - font_size / 2);
    }

    ctx.restore();

	},

	draw_upper_label: function(chart, width_current, text, tooltip_position) {
		var ctx = chart.ctx;

		var rectangle_width = width_current / 2;
		var font_size = rectangle_width / 3;
		var padding_x = text.length * 3;
		var padding_y = rectangle_width / 5;

		ctx.font = Chart.helpers.fontString(font_size, this.get_option(chart, "font_style"), this.get_option(chart, "font_family"));
		ctx.textBaseline = "top";
		ctx.textAlign = "center";

		var common_height = font_size + padding_y * 2;
		var margin_bottom = common_height / 4;

		ctx.save();

		// draw the box		
		ctx.fillStyle = this.get_option(chart, "background_color");
		ctx.fillRect(tooltip_position.x - rectangle_width / 2 - padding_x / 2,
					tooltip_position.y - common_height - margin_bottom,
					rectangle_width + padding_x,
					common_height);

		// draw the text
		ctx.fillStyle = this.get_option(chart, "font_color");
		ctx.fillText(text, tooltip_position.x, tooltip_position.y - font_size - padding_y - margin_bottom);

		ctx.restore();

	},

	calculate_single_label: function(chart, text, element_current, element_previous, labelIndex) {

		var x_previous = element_previous.getCenterPoint().x + element_previous._view.width/2;
		var x_current = element_current.getCenterPoint().x - element_current._view.width/2;

		if (x_current - x_previous > this.get_option(chart, "min_width_upper_label") && !this.get_option(chart, "force_upper_label")) {
			this.draw_left_label(chart, text, x_previous, x_current, element_current.getCenterPoint().y, labelIndex);
		} else if (this.get_option(chart, "force_upper_label") || this.get_option(chart, "allow_upper_label")) {
			this.draw_upper_label(chart, element_current._view.width, text, element_current.tooltipPosition());
		}

	},

	calculate_labels: function(chart) {

		var that = this;

		if (chart.data.datasets.length > 0) {
			var meta = chart.getDatasetMeta(0);

			if (!meta.hidden && chart.data.datasets.length == 1) {

				var decimals = 1;
				var tmp = this.get_option(chart, "decimals");
				if (tmp > 0) {
					while (tmp > 0) {
						decimals *= 10;
						--tmp;
					}
				}

				var element_previous;
				meta.data.forEach(function(element, index) {

					if (index > 0) {
						var previous_value = chart.data.datasets[0].data[index - 1];

						if (previous_value != 0) {
							var value = Math.round( (chart.data.datasets[0].data[index] * 100 / previous_value) * decimals ) / decimals;
							if (value > 0 || that.get_option(chart, "show_zeros")) {
								that.calculate_single_label(chart, value + "%", element, element_previous, index);
							}
						}
					}

					element_previous = element;
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

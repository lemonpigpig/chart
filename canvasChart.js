/*
* 基于canvas 图表组件
* wutianzhi@bianfeng.com
**/ 


// chartData:[
//     {
//         type:'line' //bar
//         ,showXis:true //是否显示x轴
//         ,showYis:true //是否显示Y轴
        
//         ,showXGrid:true//默认横向的网格
//         ,showYGrid:true//默认竖向的网格
//         ,lineWidth:2// 外层线条宽度
//         ,animationDuration:0.3//默认动画时间
//         ,strokeColor:'' // 线条描边的颜色
//         ,fillColor:'' // 填充的颜色
//         ,margin:{   // chart 距离间距
//             top:0
//             right:0
//             bottom:0
//             left:0
//         }
//         ,showYisPercent:false // 如果Y轴值为％。则显示.其他的单位为k
//     }
// ],
// xLabels:[
//     '中国','美国','日本','韩国'
// ]

// 取最大值
function getBigVal(arr){
	return Math.max.apply(Math,arr);
}
// 取最小值
function getMinVal(arr){
	return Math.min.apply(Math,arr);
}




;(function(){
	function CanvasChart (arg) {
		if(!arg.chartData || !arg.xLabels) return;
		this.canvas = document.getElementById(arg.canvasID);
		this.ctx = this.canvas.getContext('2d');
		this.showXis = arg.showXis || true //是否显示x轴
	    this.showYis = arg.showXis || true //是否显示Y轴
	    this.showXGrid = arg.showXis || true //默认横向的网格
	    this.showYGrid = arg.showXis || false //默认竖向的网格
	    this.gridLineWidth = arg.gridLineWidth || 1// 外层线条宽度
	    this.animationDuration = arg.animationDuration || 0.3//默认动画时间
	    this.strokeColor = arg.fillColor || '#fff' // 线条描边的颜色
	    this.fillColor = arg.fillColor || '#000' // 填充的颜色
	    this.margin = arg.margin || {top:0, right:0, bottom:0, left:0 } // chart 距离间距
	    this.showYisPercent = arg.showYisPercent || false;

		this.xLabels = arg.xLabels;
		this.chartData = arg.chartData || [];

		if(!this.chartData || this.chartData.length == 0) return;
		
		

		this.ctx.strokeStyle = this.strokeColor;
		this.ctx.fillStyle = this.fillColor;
	    this.ctx.lineWidth = this.gridLineWidth;

	    // 动画设置
	    // this.ctr = 0;
     //    this.numctr = 100;
        this.speed = 10;


        // 画Y轴之执行一次
		// this.drawYaisValAndXgrid();


		for(var i=0;i<this.chartData.length;i++){
			this.init(this.chartData[i]);
		}
	}


	CanvasChart.prototype = {
		// 1个图表中不可能同时出现bar 和line 只能是同一类型
		init: function(obj){
			var type = obj.type;
			


			if(type == 'bar'){
				return this.drawBarChart(obj)
			}else{
				return this.drawLineChart(obj)
			}
		},

		drawBarChart: function(obj){
			// 画坐标
			this.data = obj.data;
			this.barWidth = 50;

			this.itemStorkeColor = obj.storkeColor;
			this.itemFillColor = obj.fillColor;
			this.maxVal = getBigVal(this.data);
			this.minVal = getMinVal(this.data);
			this.yRadio = (this.canvas.height - this.margin.top - this.margin.bottom)/this.maxVal;
			this.xRadio = (this.canvas.width - this.margin.left - this.margin.right)/(this.xLabels.length + 1);
			this.stepSize = 1000;// 求Y轴坐标的间隔参数需要动态的计算得到
			

			// 画y轴值网格
			this.drawYaisValAndXgrid();
			// 画x轴刻度
			this.drawXaisVal();

			// 画Y轴
			this.drawXais()
			this.drawYais()
			this.drawChartWithAnimation()

		},

		drawYaisValAndXgrid: function(){
			this.ctx.beginPath();
			this.ctx.textAlign = "right";
	        this.ctx.textBaseline = "middle";

	        var count = 0;
	    	for(var scale = this.maxVal; scale >= 0; scale -= this.stepSize){
	    		var y = this.margin.top + (this.yRadio*count*this.stepSize);
	    		this.ctx.fillText(scale,this.margin.left - 10,y);
	            this.ctx.moveTo(this.margin.left,y+0.5);// + 0.5 解决宽<=1的时候变宽的bug    
	    		this.ctx.lineTo(this.canvas.width - this.margin.right,y+0.5);
	    		count++;
	    	}

	    	this.ctx.stroke();
	        this.ctx.closePath();
		},

		drawXaisVal: function(type){
			// bar 分文字在底部和文字在上部
			// line 文字在底部，并且有刻度
			this.ctx.beginPath();
            this.ctx.strokeStyle = 'rgba(255,255,255,.8)';
            type == 'line' ? this.ctx.textAlign = "center" : this.ctx.textAlign = "left";
            this.ctx.textBaseline = "top";
            this.ctx.lineWidth = 2;
            this.ctx.lineJoin="round";
        	for(var i=0;i<this.xLabels.length;i++){
        		this.calcY(this.data[i]);
        		this.ctx.fillText(this.xLabels[i],this.xRadio*(i+1)+(type == 'line' ? 0:15), this.canvas.height - this.margin.top + 5)
				// 画线条边框
        		if(type == 'line') this.ctx.lineTo(this.xRadio*(i+1),this.y - this.margin.top);
                
        	}
        	if(type == 'line') this.ctx.stroke();
            this.ctx.closePath();
		},

		

		calcY: function(v){//计算Y轴最大的坐标比例
            this.y = this.canvas.height - v*this.yRadio;
    	},

    	drawYGrid: function(){

    	},

		drawXais: function(){
			this.ctx.beginPath();
        	this.ctx.lineWidth = 1;
        	this.ctx.moveTo(this.margin.left,this.canvas.height - this.margin.top + 0.5);
        	this.ctx.lineTo(this.canvas.width - this.margin.right,this.canvas.height - this.margin.top + 0.5);
        	this.ctx.stroke();
        	this.ctx.closePath();
		},

		drawYais: function(){
			this.ctx.beginPath();
        	// this.ctx.fillStyle = this.fillColor;
        	this.ctx.lineWidth = 1;
        	this.ctx.moveTo(this.margin.left+0.5,this.margin.top - 20);
        	this.ctx.lineTo(this.margin.left+0.5,this.canvas.height - this.margin.top);
        	this.ctx.stroke();
        	this.ctx.closePath();
		},

		drawChartWithAnimation: function(type){
			// for bar
			var that = this;
			var start = 0, during = 100;

			if(type == 'line'){
				// var _run1 = function(){
				// 	start++;
		  //           for (var i = 0; i < that.data.length; i++) {
		  //               var bVal = that.data[i];
		  //               var top = Tween.Quart.easeOut(start, 0, bVal, during);
		  //               that.drawRect(i,top, true);
		  //           }
		            
		  //           if (start < during) {
		  //               requestAnimationFrame(_run)
		  //           }	
				// }
	         	
	   //       	_run1()





			}else{
				this.ctx.translate(0, this.canvas.height - this.margin.top);
	            this.ctx.scale(this.xRadio, -1 * this.yRadio);
	        	
	        	
				var _run = function(){
					start++;
		            for (var i = 0; i < that.data.length; i++) {
		                var bVal = that.data[i];
		                // var bHt = (bVal) / that.numctr * that.ctr;


		                 //* t: current time（当前时间）；
						 // * b: beginning value（初始值）；
						 // * c: change in value（变化量）；
						 // * d: duration（持续时间）。
						 // easeOut: function(t, b, c, d) {

		                var top = Tween.Quart.easeOut(start, 0, bVal, during);
		                that.drawRect(i,top, true);
		            }
		            
		            if (start < during) {
		                requestAnimationFrame(_run)
		            }	
				}
	         	
	         	_run()


			}

			
			
            

		},

		drawRect: function(i,bht,fill){

			this.ctx.beginPath();
            this.ctx.lineWidth = 2;
        	
        	if (fill) {
                var gradient = this.ctx.createLinearGradient(0, 0, 0, this.maxVal);
                gradient.addColorStop(0, 'green');
                gradient.addColorStop(1, 'rgba(67,203,36,.15)');
                this.ctx.fillStyle = gradient;
                this.ctx.strokeStyle = gradient;
                this.ctx.fill();
            }else{
            	this.ctx.fillStyle = this.itemFillColor;
            }

        	this.ctx.fillRect(i + 1, 0, 0.5, bht);
            this.ctx.closePath();
 		},

		drawLine: function(){

		},

		drawXsmallVal: function(){
			this.ctx.beginPath();
            this.ctx.strokeStyle = 'rgba(255,255,255,0.2)';
            this.ctx.lineWidth = 1;
            for(var i=0;i<this.data.length;i++){
                this.calcY(this.data[i]);
                this.ctx.moveTo(this.xRadio*(i+1)+0.5,this.canvas.height - this.margin.top);
                this.ctx.lineTo(this.xRadio*(i+1)+0.5,this.canvas.height - this.margin.top + 5);
            }

            this.ctx.stroke();
            this.ctx.closePath();
		},

		drawLineChart: function(obj){
			// 可以有不存在x轴和y轴的情况
			// 画Y轴grid
			if(this.showYGrid){
				this.drawYGrid();
			}

			this.data = obj.data;

			this.itemStorkeColor = obj.storkeColor;
			this.itemFillColor = obj.fillColor;
			this.maxVal = getBigVal(this.data);
			this.minVal = getMinVal(this.data);
			this.yRadio = (this.canvas.height - this.margin.top - this.margin.bottom)/this.maxVal;
			this.xRadio = (this.canvas.width - this.margin.left - this.margin.right)/(this.xLabels.length + 1);
			this.stepSize = 1000;// 求Y轴坐标的间隔参数需要动态的计算得到
			
			// 画y轴值网格
			this.drawYaisValAndXgrid();
			
			// 画x轴文字
			this.drawXaisVal();

			// 画x刻度小点
			this.drawXsmallVal();
			
			// this.drawChartWithAnimation('line');

			// 画line 封闭图形
			this.drawLineBorder();
			this.closeGraphics();


		},

		drawLineBorder: function(){
			this.ctx.beginPath();
            this.ctx.strokeStyle = 'rgba(255,255,255,.8)';
            this.ctx.textAlign = "center"
            this.ctx.textBaseline = "top";
            this.ctx.lineWidth = 2;
            this.ctx.lineJoin="round";
        	for(var i=0;i<this.xLabels.length;i++){
        		this.calcY(this.data[i]);
        		
        		this.ctx.lineTo(this.xRadio*(i+1),this.y - this.margin.top);
                
        	}
        	this.ctx.stroke();
            
		},
		
		closeGraphics: function(){
			this.ctx.beginPath();
            this.ctx.fillStyle = 'rgba(255,255,255,.2)';
            this.ctx.moveTo(this.xRadio*(1),this.canvas.height - this.margin.top);
            for(var i=0;i<this.data.length;i++){
                this.calcY(this.data[i]);
                this.ctx.lineTo(this.xRadio*(i+1),this.y - this.margin.top);
            }
            this.ctx.lineTo(this.xRadio*(3+1),this.canvas.height - this.margin.top);
            this.ctx.closePath();
            this.ctx.fill();
		}

	}

	return window.CanvasChart = CanvasChart;

})()




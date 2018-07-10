function ObjectSize(obj) {
    var size = 0, key;
    for (key in obj) {
        if (obj.hasOwnProperty(key)) size++;
    }
    return size;
}

function OuterHTML(obj)
{
	return obj.clone().wrap('<p>').parent().html();
}

$(document).ready(function(){
	var ZStatsCFG = {
		Selector		: 	"div[ZStats]",
		Attribute		: 	"ZStats",
		ItemsAttribute	: 	"ZStatsItems",
		AnimSpeed 		: 	1000
	};

	$("head").prepend('<style type="text/css">@import url("https://fonts.googleapis.com/css?family=Nunito");</style>');

	$(ZStatsCFG.Selector).each(function(){
		try
		{
			var ZStatsElement = $(this);
			var ElementCFG = JSON.parse(ZStatsElement.attr(ZStatsCFG.Attribute));

			// Defaults
			if(ElementCFG["Type"] == undefined) ElementCFG["Type"] = "Bar";
			if(ElementCFG["Width"] == undefined) ElementCFG["Width"] = 200;
			if(ElementCFG["Height"] == undefined) ElementCFG["Height"] = 200;
			if(ElementCFG["Background"] == undefined) ElementCFG["Background"] = "#FFFFFF";
			if(ElementCFG["Min"] == undefined) ElementCFG["Min"] = 0;
			if(ElementCFG["Max"] == undefined) ElementCFG["Max"] = 100;

			// Build container
			ZStatsElement.css({
				"position"		: 	"relative",
				"width"			: 	ElementCFG["Width"],
				"height"		: 	ElementCFG["Height"],
				"background"	: 	ElementCFG["Background"],
				"display" 		: 	"inline-block",
				"font-family" 	: 	"Nunito"
			});

			// Items
			var Items = JSON.parse(ZStatsElement.attr(ZStatsCFG.ItemsAttribute));
			var TotalItems = ObjectSize(Items);
			var PctPer = ((ElementCFG["Width"] / TotalItems) / ElementCFG["Width"]) * 100;

			// Build
			if(ElementCFG["Type"] == "Bar")
			{
				var First = true;
				for (var key in Items){
					if(Items.hasOwnProperty(key)) {
						var Bar = $("<div>").css({"width":PctPer+"%", "height":"100%", "box-sizing":"border-box", "display":"inline-block", "position":"relative"});
						var BarContent = $("<div>").css({"width":"70%", "max-width":"40px", "height":0, "background":"orange", "position":"absolute", "bottom":"0px", "left":"50%", "transform":"translateX(-50%)"});
						var BarText = $("<div>").css({"transform":"rotate(90deg)", "position":"absolute", "top":parseInt(ElementCFG["Height"])+30, "white-space":"nowrap", "font-size":"16px", "font-weight":"bold"}).html(key);
						Bar.append(BarContent, BarText);
						ZStatsElement.append(Bar);
						BarContent.animate({"height":Items[key]}, ZStatsCFG.AnimSpeed);
						First = false;
					}
				}
			}
			else if(ElementCFG["Type"] == "Radial")
			{
				for (var key in Items){
					var TempCFG = {
						"StrokeWidth" 	: 	(ElementCFG["StrokeWidth"] == undefined) ? "10" : ElementCFG["StrokeWidth"],
						"StrokeColor" 	: 	(ElementCFG["StrokeColor"] == undefined) ? "orange" : ElementCFG["StrokeColor"],
						"FillColor" 	: 	(ElementCFG["FillColor"] == undefined) ? "transparent" : ElementCFG["FillColor"],
					};
					var Txt = $("<div style='transform:translate(-50%, -50%); width: 90%; text-align: center;'>").html(key).css({"font-size":"18px", "font-weight":"bold", "text-align":"center", "position":"absolute", "top":"50%", "left":"50%", "tansform":"translate(-50%, -50%)"}).append("<div style='font-size: 2em;'>"+Items[key]+"</div>");
					var Pct = parseFloat(Items[key]);
					var Circle = $("<circle>").attr("cx", ElementCFG["Width"]/2).attr("cy",ElementCFG["Height"]/2).attr("r", ElementCFG["Width"]/2 - ElementCFG["Width"]*0.1).css({"stroke-width":TempCFG["StrokeWidth"], "stroke":TempCFG["StrokeColor"], "fill":TempCFG["FillColor"]});
					var SVG = $("<svg>"+OuterHTML(Circle)+"</svg>").css({"-webkit-transform":"rotate(-90deg)", "transform":"rotate(-90deg)", "width":ElementCFG["Width"], "height":ElementCFG["Height"]});
					ZStatsElement.append(SVG);
					var FullRadius = Circle.attr("r") * (Math.PI * 2);
					SVG.find("circle").css({"stroke-dasharray":FullRadius, "stroke-dashoffset":FullRadius});
					SVG.find("circle").animate({"stroke-dashoffset": FullRadius - (FullRadius * (Pct / 100))}, ZStatsCFG.AnimSpeed / 0.75);
					ZStatsElement.append(Txt);
				}
			}
		}
		catch(err)
		{
			alert("Invalid ZStats setup");
		}
	});
});
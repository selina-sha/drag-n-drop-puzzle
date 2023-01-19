const NUMBER_OF_GRID_EACH_ROW = 8
const NUM_OF_DROPZONES = 4

function onDragStart(event) {
  event.dataTransfer.setData("text", event.target.id);
}

function onDragOver(event) {
  event.preventDefault();
}

function onDrop(event) {
  event.preventDefault();
  var data = event.dataTransfer.getData("text");
  var draggableElement = document.getElementById(data);
  var targetDropZoneId = event.target.id;
  var lastItem = event.target.lastElementChild;
  if (lastItem == null){event.target.appendChild(draggableElement);}
  else{
    var text = lastItem.textContent;
    var newTargetDropZoneId = findDropZoneId(text, targetDropZoneId) 

    if (!(targetDropZoneId === newTargetDropZoneId)){
      event.preventDefault();
      gridNum = getGridNumber(document.getElementById(targetDropZoneId), NUMBER_OF_GRID_EACH_ROW) 
      for (let k = newTargetDropZoneId; k <= NUM_OF_DROPZONES; k++){ 
        for (let i = 0; i < gridNum; i++){
          const column = document.createElement("div"); 
          column.classList.add("indent")
          document.getElementById((k).toString()).appendChild(column);
        }
      }
      document.getElementById(newTargetDropZoneId).appendChild(draggableElement)
    }
    else{
      event.target.appendChild(draggableElement);
    }
  }

function getGridNumber(element, totalGrid) {
  elem_children = element.children 
  elem_children = Array.from(elem_children)
  found_num = 0
  for (let j = 0; j < totalGrid; j++){
    if (!(elem_children[j]?.classList.contains("indent")) || (elem_children[j].children.length > 0 && !(elem_children[j]?.children[0].classList.contains("indent")))){
      found_num = j
      break
    }
  }
  item = null
  console.log(elem_children[found_num].children)
  if (elem_children[found_num]?.children.length > 0){
    if(!(elem_children[found_num].children[0]?.classList.contains("indent"))){
      item = document.getElementById(elem_children[found_num].children[0].id)
    }
  }else{
    item = document.getElementById(elem_children[found_num]?.id);
  }
  const rect = item?.getBoundingClientRect(); 
  const GRIDWIDTH = 59.29;
  const gridCol = Math.floor(rect?.left / GRIDWIDTH) + 1;
  return gridCol;
}

function findDropZoneId(last_elemt_text, cur_id){
  if (last_elemt_text.includes(":")){
    curId = parseInt(cur_id);
    curId += 1;
    return (curId.toString());
  }
  else{
    return cur_id;
  }
}

$('.draggable').draggable({
    stop: function(event, ui) {
      var currentPos = $(this).offset();
      var otherPositions = $('.draggable').not(this).map(function() {
        return $(this).offset();
      });
  
      $.each(otherPositions, function(index, otherPos) {
        var distance = Math.sqrt(Math.pow(currentPos.left - otherPos.left, 2) + Math.pow(currentPos.top - otherPos.top, 2));
  
        if (distance < 50) {
          $(event.target).appendTo($('.draggable').not(event.target)[index]);
        }
      });
    }
});

function findDivToken(divInput){ 
  var name = ""
  if (divInput.getAttribute("class").includes("droptarget")){ 
    name = divInput.getAttribute("class").replace("droptarget", "").trim()
  }
  else{
    name = divInput.getAttribute("class")
  }
  if (name == "example-draggable-operater"){
    return {"text": divInput.textContent, type: "operator"}
  }
  else if (name == "example-draggable-input"){
    return { "text": divInput.children[0].value}
  }
  else if (name == "example-draggable-input-function"){
    return { "text": "str(" + divInput.children[0].value + ")", type: "built-in-function" }
  }
  else if (name == "example-draggable-var"){
    return {"text": divInput.textContent, type: "user-defined-variable"}
  }
  else if (name == "example-draggable-number"){
    return {"text": divInput.textContent, type: "number"}
  }
  else if (name == "example-draggable-keywords"){
    return {"text": divInput.textContent, type: "built-in-function"}
  }
  else{
    return {"not found": name}
  }

}

let button = document.getElementById("myButton");
var result_json = {"lines":[{"indentation":0,"tokens":[{"text":"\n            count\n          ","type":"user-defined-variable"},{"text":"\n            =\n          ","type":"operator"},{"text":"\n            0\n          ","type":"number"}]},{"indentation":1,"tokens":[{"text":"\n            while\n          ","type":"built-in-function"},{"text":"count < 10"},{"text":"\n            :\n          ","type":"operator"}]},{"indentation":2,"tokens":[{"text":"\n            print\n          ","type":"built-in-function"},{"text":"\n            (\n          ","type":"operator"},{"text":"\"count\""},{"text":"\n            +\n          ","type":"operator"},{"text":"str(count)","type":"built-in-function"},{"text":"\n            )\n          ","type":"operator"}]},{"indentation":2,"tokens":[{"text":"\n            count\n          ","type":"user-defined-variable"},{"text":"\n            =\n          ","type":"operator"},{"text":"count + 1"}]}]}
button.addEventListener("click", () => {
  dropzone_id = [1, 2, 3, 4];
  json_layout = {"lines": [{"indentation": 0},
                          {"indentation": getGridNumber(document.getElementById("2"), NUMBER_OF_GRID_EACH_ROW)},
                          {"indentation": getGridNumber(document.getElementById("3"), NUMBER_OF_GRID_EACH_ROW)},
                          {"indentation": getGridNumber(document.getElementById("4"), NUMBER_OF_GRID_EACH_ROW)}]}
  for (let i = 0; i < dropzone_id.length; i++){
    str_dropzone_id = (dropzone_id[i]).toString();
    curr_zone = document.getElementById(str_dropzone_id)
    divList = curr_zone.querySelectorAll("[draggable = 'true']");
    let divArray = Array.from(divList)
    tokens = []
    divArray.forEach(div => {tokens.push(findDivToken(div))})
    json_layout["lines"][i]["tokens"] = tokens
  }
  
  if (JSON.stringify(json_layout) == JSON.stringify(result_json)){
    document.getElementById("tooltip").innerHTML = "Puzzle solved successfully!";
    document.getElementById("tooltip").style.display = "block";
    document.getElementById("tooltip").style.backgroundColor = "rgb(124, 252, 0)"
  }else{
    document.getElementById("tooltip").innerHTML = "Mission Failed! Try one more time in 3 seconds.";
    document.getElementById("tooltip").style.display = "block";
    document.getElementById("tooltip").style.backgroundColor = "red"
    setTimeout(function(){location.reload()}, 3000)
  }
});


}

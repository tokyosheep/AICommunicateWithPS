(function(){
    var objects = activeDocument.selection;
    if(objects.length<1){
        alert("nothing you selected image");
        return false;
    }
    var array = [];
    for(var i=0;i<objects.length;i++){
        if(objects[i].typename == "PlacedItem"){
            array[i] = objects[i].file.fullName;
            $.writeln(array[i]);
        }
    }
    if(array.length < 1){
        alert("nothing you selected image");
        return false;
    }
    return JSON.stringify(array);
})();
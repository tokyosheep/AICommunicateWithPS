function placeImg(images){
    for(var i=0;i<images.length;i++){
        var lay = activeDocument.layers.add();
        var img = activeDocument.placedItems.add();
        img.file = new File(images[i]);
    }
    return;
}
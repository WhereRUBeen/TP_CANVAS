/**
 * Created by mmayam on 2017-12-18.
 */
"use strict";

document.addEventListener("DOMContentLoaded",function () {
    console.log("DOMContentLoaded");

    // canvas principal
    let canvas = document.getElementById("canvas");
    console.log("canvas ",canvas);
    //get l'image sélectionné
    let selectedImage = document.getElementById('selectedImage');

    // scale image
    let scaleSlider = document.getElementById("scaleSlider");
    let scale = 1.0;
    let MINIMUM_SCALE = 1.0;
    let MAXIMUM_SCALE = 3.0;

    /////////////////////////////////////////////////////////////////////////////////////

    let ctx = canvas.getContext('2d');

    // canvas width et height
    let width = canvas.width;
    console.log("width ", width);
    let height = canvas.height;
    console.log("height ", height);


    // cree et colorie rectangle
    ctx.fillStyle ="gray";
    ctx.fillRect(0,0,width,height);

    // ecoute sur le fichier image selectionnée
    selectedImage.addEventListener("change",function () {
        // recuper le fichier image
        let file = this.files[0];
        console.log(file.name,file.type);

        if(img_verification(file)){
            console.log("le fichier ", file.name," est une image");

            // une Image
            let image = new Image();
            load_img_FileReader(file,image);


            scaleSlider.onchange = function (e) {
                scale = e.target.value;

                if(scale < MINIMUM_SCALE){
                    scale = MINIMUM_SCALE;
                }
                else if(scale > MAXIMUM_SCALE)
                    scale = MAXIMUM_SCALE;

                drawScaleText(scale);
                drawImage(image);
            };

            ///initialisaton
             ctx.fillStyle = "cornflowerblue";
             ctx.strokeStyle = "yellow";
             ctx.shadowColor = "rgba(50,50,50,1.0)";
             ctx.shadowOffsetX = 5;
             ctx.shadowOffsetY = 5;
             ctx.shadowBlur = 10;

           // drawImage(image);

            image.addEventListener('load',function () {
                //canvas.width = this.width;
               // canvas.height = this.height;
               ctx.clearRect(0,0,canvas.width,canvas.height);
               ctx.drawImage(this,0,0,width,height);

               for(let i = 0; i <3; i++)
                    imagesFiltres(this,i);
               /** let sw = width * scale;
                let sh = height* scale;

                ctx.clearRect(0,0,width,height);
                ctx.drawImage(this, -sw/2 + w/2, -sh/2 + h/2, sw, sh);
                drawScaleText(scaleSlider.value);
                */
            });

            // le button black and white
            let button = document.getElementById("blackwhite");
            button.addEventListener("click",function () {
                imgBlacWhite();
            });

            // button couleur
            let bttnCouleur = document.getElementById("filterColor");
            bttnCouleur.addEventListener("click",function () {
                imgCouleur(image);
            });

            // bttn negative color
            let bttnNegativeColor = document.getElementById("negativeColor");
            bttnNegativeColor.addEventListener("click",function () {
                console.log("bttn negative filter");
                negativeFilter();
            });

            //bttn enregistrer
            let bttnEnregistrer = document.getElementById("enregistrer");
            bttnEnregistrer.addEventListener("click",function () {
                let dataImage = localStorage.getItem('imgData');
                let bannerImg = document.getElementById('test64image');
                bannerImg.src = "data:image/png;base64," + dataImage;
            });

        }

    });


    //bttn reaffichage
    let bttnCharger = document.getElementById("charge");
    console.log(bttnCharger);
    bttnCharger.addEventListener("click",function () {
        console.log("hello");
        //let dataImage = localStorage.getItem('dataImage');
        //let bannerImg = document.getElementById('test64image');
        //if(dataImage != null){

            //bannerImg.setAttribute("src",dataImage); //src = "data:image/png;base64," + dataImage;
        //}


    });




////////////////////////////////////////////////////////////////////////////////////////////////
//FUNCTIONS

    // cree images
    function imagesFiltres(image, index) {
        console.log("function images filtres");
        let imgdiv = document.getElementById("imagesDiv");

        let canvas = document.createElement('canvas');
        canvas.width = 300;
        canvas.height = 300;
        let context = canvas.getContext('2d');


        switch (index){
            case 0 : imgCouleur(image,context, canvas) ;
            case 1 : imgBlacWhite(context ,canvas) ;

        }
        context.drawImage(image,0,0,canvas.width,canvas.height);

        imgdiv.appendChild(canvas);

    }

    // Cree canvas
    function createCanvas(w,h) {
        let canvas = document.createElement('canvas');
        canvas.width = w;
        canvas.height = h;
        let context = canvas.getContext('2d');
        context.fillStyle = "gray";
        context.fillRect(0,0,canvas.width,canvas.height);

        return canvas;
    }

// verifie si fichier est une image
    function img_verification(file) {
        let imgtype = file.type.split("/")[1];
        console.log(imgtype);
        return (["jpeg", "png"].indexOf(imgtype) >= 0);
    }

// lecture d'image avec dataURL
    function load_img_dataURL(file, image) {
        image.addEventListener('load', function(){
            URL.revokeObjectURL(image.src);
        });
        image.src = URL.createObjectURL(file);
    }

// lecture d'image avec fileReader
    function load_img_FileReader(file, image) {
        let reader = new FileReader();
        reader.addEventListener('load', function() {
            image.src = reader.result; // Le contenu du fichier est stocké dans la propriété result de FileReader
        });
        reader.readAsDataURL(file);
    }
// function drawImage
    function drawImage(image){

        image.addEventListener('load',function () {
            let sw = width * scale;
            let sh = height* scale;
            ctx.clearRect(0,0,width,height);
            ctx.drawImage(image, -sw/2 + w/2, -sh/2 + h/2, sw, sh);
        });

    }

//function save image

    function saveImage(image) {
        let canvas = document.createElement('canvas');
        let context = canvas.getContext('2d');
        let data;

        canvas.width = image.width;
        canvas.height = image.height;

        context.drawImage(image,0,0);
        data = canvas.toDataURL('image\jpg',1.0);
        console.log(data);

        try{
            localStorage.setItem("dataImage", data);
        }catch (e){
            console.log("Strorage faled : " + e);
        }
        return data.replace(/^data:image\/(png|jpg);base64,/, "");

    }
// function
    function drawScaleText(value) {
        let text = parseFloat(value).toFixed(2);
        let percent = parseFloat(value - MINIMUM_SCALE)/parseFloat(MAXIMUM_SCALE-MINIMUM_SCALE);

        scaleOutput.innerText = text;
        percent = percent < 0.35 ? 0.35 : percent;
        scaleOutput.style.fontSize = percent*MAXIMUM_SCALE/1.5 + 'em';
    }

    // black and white filter
    function imgBlacWhite(context = null,canv = null ) {
        console.log("black white filter");

        if (context != null && canv != null){
            let data = undefined,
                i = 0;
            let imageData = context.getImageData(0,0,canv.width, canv.height);
            data = imageData.data;
            for(i= 0; i < data.length -4; i+=4){
                let average = (data[i] + data[i+1]+ data[i+2])/3;
                data[i] = average;
                data[i+1] = average;
                data[i+2] = average;
            }
            context.putImageData(imageData,0,0);
        }
        else{
        let data = undefined,
            i = 0;
        let imageData = ctx.getImageData(0,0,canvas.width, canvas.height);
        data = imageData.data;
        for(i= 0; i < data.length -4; i+=4){
            let average = (data[i] + data[i+1]+ data[i+2])/3;
            data[i] = average;
            data[i+1] = average;
            data[i+2] = average;
        }
        ctx.putImageData(imageData,0,0);
        }
    }

    // filter color
/*    function imgCouleur(image,context, canv) {
        if(context != null && canv != null){
            context.drawImage(image,0,0,image.width,image.height,0,0,
                context.canv.width,context.canv.height);
        }
        else{
        ctx.drawImage(image,0,0,image.width,image.height,0,0,
        ctx.canvas.width,ctx.canvas.height);
        }
    }*/

    // negative filter
    function negativeFilter() {
        console.log("negative filter");
        let imageData = ctx.getImageData(0,0,canvas.width, canvas.height),
            data = imageData.data;
        for(let i=0; i <= data.length - 4; i+=4){
            data[i] = 255 - data[i];
            data[i+1] = 255 - data[i+1];
            data[i+2] = 255 - data[i+2];
        }
        ctx.putImageData(imageData,0,0);
    }
});


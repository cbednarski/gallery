// variables
var dropArea = document.getElementById('dropArea');
var destinationUrl = "/upload";
var list = [];
var totalSize = 0;
var totalProgress = 0;

// main initialization
(function(){

    // init handlers
    function initHandlers() {
        document.body.addEventListener('drop', handleDrop, false);
        dropArea.addEventListener('dragover', handleDragOver, false);
    }

    // drag over
    function handleDragOver(event) {
        event.stopPropagation();
        event.preventDefault();

        dropArea.className = 'hover';
    }

    // drag drop
    function handleDrop(event) {
        event.stopPropagation();
        event.preventDefault();

        processFiles(event.dataTransfer.files);
    }

    // process bunch of files
    function processFiles(filelist) {
        if (!filelist || !filelist.length || list.length) return;

        totalSize = 0;
        totalProgress = 0;

        for (var i = 0; i < filelist.length; i++) {
            list.push(filelist[i]);
            totalSize += filelist[i].size;
        }
        uploadNext();
    }

    function wookmarkCall(){
        jQuery('.gallery_element').wookmark(
            {
                offset: 10,
                container: jQuery("#dropArea")
            }
        );
    }
    
    // on complete - start next file
    function handleComplete(size) {
        totalProgress += size;
        jQuery(".gallery_element").addClass(gallery_mode);
 
        wookmarkCall();
        jQuery(".fancybox").fancybox();

        uploadNext();
    }
    
    window.onresize = function(event) {
        wookmarkCall();
    };
    // upload file
    function uploadFile(file, status) {

        // prepare XMLHttpRequest
        var xhr = new XMLHttpRequest();
        xhr.open('post', destinationUrl);
        xhr.onload = function() {
            //dropArea.innerHTML += this.responseText;
            $(dropArea).append(this.responseText);
            handleComplete(file.size);
        };
        xhr.onerror = function() {
            //dropArea.textContent += this.responseText;
            handleComplete(file.size);
        };
        xhr.upload.onprogress = function(event) {
            //handleProgress(event);
        };
        xhr.upload.onloadstart = function(event) {
        };

        // prepare FormData
        var formData = new FormData();
        formData.append('newfile', file);
        xhr.send(formData);
    }

    function progressMessage(){
        var gallery = jQuery("#gallery_instruction");
        if (list.length) {
            gallery.html("Uploading.... "+list.length+" more files left.");
            gallery.show();
        }
        else{
            gallery.hide();
        }
    }
    
    // upload next file
    function uploadNext() {
        progressMessage();
        
        if (list.length) {
            var nextFile = list.shift();
            if (nextFile.size >= 10485760) { // 3mb
                //$(dropArea).append('<div class="f">Too big file (max filesize exceeded)</div>');
                handleComplete(nextFile.size);
            } else {
                uploadFile(nextFile, status);
            }
        } else {
            dropArea.className = '';
        }
    }

    initHandlers();
})();
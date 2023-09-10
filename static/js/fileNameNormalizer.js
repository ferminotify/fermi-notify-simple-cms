/*
 * On backend I use crappy libraries. 
 * I cannot manipulate the file name in backend so I have to do it 
 * here.
 */

// Get the file input element and output element
const file = document.getElementById('file');

file.addEventListener('change', function(event) {
    const selectedFiles = event.target.files;

    if (selectedFiles.length > 0) {
        const f = selectedFiles[0];
        handleFileUpload(f);
    }
});

function handleFileUpload(f) {
    const normalize = document.getElementById("normalizer").checked;

    if (normalize) {
        const myFile = new File([f], (new Date().toJSON().slice(0, 19) + "_" + f.name));

        const dataTransfer = new DataTransfer();
        dataTransfer.items.add(myFile);
        document.querySelector('input[type="file"]').files = dataTransfer.files;
    }

    document.getElementById("filename").innerHTML = "File name: " + document.getElementById("file").files[0].name + ' <a href="javascript:location.reload()">Undo</a>';
    document.getElementById("normalizer").disabled = true;
}
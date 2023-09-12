function getFileName()
{
  const fileInput = document.getElementById('file-upload');

  fileInput.addEventListener('change', (event) => {
    const filename = event.target.value.split('\\').pop();

    const updateFileName = document.querySelector('#select-file-name');

    updateFileName.innerHTML = filename;

    // console.log(filename);
  });

}
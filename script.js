document.getElementById('uploadButton').addEventListener('click', function() {
  var fileInput = document.getElementById('fileInput');
  var file = fileInput.files[0];

  // Check if a file was selected
  if (!file) {
    alert('Please select a file to upload.');
    return;
  }


  
  // Validate the file type (should be 'application/pdf')
  if (file.type !== 'application/pdf') {
    alert('Please select a PDF file.');
    return;
  }

  // Proceed with the file upload
  var formData = new FormData();
  formData.append('pdfFile', file);

  fetch('/upload', {
    method: 'POST',
    body: formData
  })
  .then(response => {
    if (!response.ok) {
      throw new Error('Network response was not ok ' + response.statusText);
    }
    return response.json();
  })
  .then(data => {
    if (data.success) {
      // Send a message to the extension with the URL of the uploaded PDF
      let extensionId = "YOUR_EXTENSION_ID"; // Replace with your actual extension ID
      chrome.runtime.sendMessage(extensionId, {
        action: 'printPDF',
        fileUrl: '/uploads/' + data.filename // Assuming the server responds with the filename
      }, function(response) {
        if (chrome.runtime.lastError) {
          console.error("Error sending message to extension:", chrome.runtime.lastError);
        } else {
          console.log("Message sent to extension:", response);
        }
      });
    } else {
      console.error('Failed to upload PDF file. Server response:', data);
    }
  })
  .catch(error => {
    console.error('Error:', error);
  });
});

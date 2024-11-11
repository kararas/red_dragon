document.getElementById('uploadButton').addEventListener('click', function() {
  var fileInput = document.getElementById('fileInput');

  // Check if fileInput element exists
  if (!fileInput) {
    alert('File input element not found.');
    return;
  }

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
      // Send a message to the extension if running in a Chrome extension context
      if (typeof chrome !== 'undefined' && chrome.runtime) {
        let extensionId = "coipnbadfcdapccchnllaibdnfeajhcl"; // Replace with your actual extension ID
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
        console.log("chrome.runtime is not available.");
      }
    } else {
      console.error('Failed to upload PDF file. Server response:', data);
    }
  })
  .catch(error => {
    console.error('Error:', error);
  });
});

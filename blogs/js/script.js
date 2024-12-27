function formatText(command) {
    document.execCommand(command, false, null);
     }

        const editor = document.getElementById('editor');
        const contextMenu = document.getElementById('context-menu');

        // Show custom context menu on right-click
        editor.addEventListener('contextmenu', function(event) {
            event.preventDefault();
            contextMenu.style.left = `${event.pageX}px`;
            contextMenu.style.top = `${event.pageY}px`;
            contextMenu.style.display = 'block';
        });

        // Hide the context menu when clicking elsewhere
        document.addEventListener('click', function() {
            contextMenu.style.display = 'none';
        });

          // Handle Upload Image Toolbar
        document.getElementById('toolbar-img-upload').addEventListener('click', function() {
            document.getElementById('image-upload').click();
        });

        // Handle Upload Image right click
        document.getElementById('upload-image-option').addEventListener('click', function() {
            document.getElementById('image-upload').click();
        });
		
		

        // Handle image upload
        document.getElementById('image-upload').addEventListener('change', function(event) {
            const file = event.target.files[0];
            const reader = new FileReader();
            
            reader.onload = function(e) {
                const imgContainer = createImageContainer(e.target.result);
                editor.appendChild(imgContainer);
            };
            
            if (file) {
                reader.readAsDataURL(file);
            }
        });

        // Function to create an image container
        function createImageContainer(src) {
            const imgContainer = document.createElement('div');
            imgContainer.style.position = 'relative';
            imgContainer.style.display = 'inline-block';

            const img = document.createElement('img');
            img.src = src;
            img.className = 'draggable-image';
            img.style.maxWidth = '100%';

            const resizer = document.createElement('div');
            resizer.className = 'image-resizer';
            imgContainer.appendChild(img);
            imgContainer.appendChild(resizer);

            const removeBtn = document.createElement('div');
            removeBtn.className = 'remove-btn';
            removeBtn.textContent = 'X';
            imgContainer.appendChild(removeBtn);

            // Add event listeners
            addImageClickHandler(imgContainer, removeBtn, resizer);
            makeImageDraggable(imgContainer);
            makeImageResizable(resizer, img);

            return imgContainer;
        }

        function addImageClickHandler(imgContainer, removeBtn, resizer) {
            imgContainer.addEventListener('mouseenter', () => {
                removeBtn.style.display = 'block'; // Show remove button
                resizer.style.display = 'block'; // Show resizer
            });
            imgContainer.addEventListener('mouseleave', () => {
                removeBtn.style.display = 'none'; // Hide remove button
                resizer.style.display = 'none'; // Hide resizer
            });

            removeBtn.addEventListener('click', () => {
                imgContainer.remove(); // Remove image on button click
            });
        }

        function makeImageDraggable(imageContainer) {
            let isDragging = false;
            let startX, startY, origX, origY;

            imageContainer.addEventListener('mousedown', (e) => {
                isDragging = true;
                startX = e.clientX;
                startY = e.clientY;
                origX = imageContainer.offsetLeft;
                origY = imageContainer.offsetTop;
                document.body.style.cursor = 'move'; // Change cursor
                e.preventDefault(); // Prevent default behavior
            });

            document.addEventListener('mouseup', () => {
                isDragging = false;
                document.body.style.cursor = 'default'; // Reset cursor
            });

            document.addEventListener('mousemove', (e) => {
                if (isDragging) {
                    const editorRect = editor.getBoundingClientRect();
                    const dx = e.clientX - startX;
                    const dy = e.clientY - startY;

                    // Calculate new position
                    const newLeft = origX + dx;
                    const newTop = origY + dy;

                    // Boundary checks
                    if (newLeft >= 0 && newLeft + imageContainer.offsetWidth <= editorRect.width) {
                        imageContainer.style.left = `${newLeft}px`;
                    }
                    if (newTop >= 0 && newTop + imageContainer.offsetHeight <= editorRect.height) {
                        imageContainer.style.top = `${newTop}px`;
                    }
                    imageContainer.style.position = 'absolute'; // Set absolute position for dragging
                }
            });
        }

        function makeImageResizable(resizer, image) {
            let isResizing = false;
            let startX, startY;

            resizer.addEventListener('mousedown', (e) => {
                isResizing = true;
                startX = e.clientX;
                startY = e.clientY;
                document.body.style.cursor = 'se-resize'; // Change cursor
                e.stopPropagation(); // Prevent triggering the drag event
            });

            document.addEventListener('mouseup', () => {
                isResizing = false;
                document.body.style.cursor = 'default'; // Reset cursor
            });

            document.addEventListener('mousemove', (e) => {
                if (isResizing) {
                    const newWidth = image.clientWidth + (e.clientX - startX);
                    const newHeight = image.clientHeight + (e.clientY - startY);
                    image.style.width = `${newWidth}px`;
                    image.style.height = `${newHeight}px`;
                    startX = e.clientX;
                    startY = e.clientY;
                }
            });
        }

        document.getElementById('submit').addEventListener('click', function (event) {
            event.preventDefault();
            var PostTitle = document.getElementById("post-title").value;
            var editorContent = document.getElementById('editor').innerHTML;

            if (PostTitle === "") {
                alert("Please Enter Post Title");
                return false;
            }
            if (editorContent === "") {
                alert("Please Enter Post Content");
                return false;
            }

            editorContent = btoa(editorContent);
            const dataToSend = { post_title: PostTitle, post_content: editorContent };
            $.ajax({
                url: 'server/write_data.php',
                type: 'POST',
                contentType: 'application/json',
                data: JSON.stringify(dataToSend),
                success: function (response) {
				     showToast({msg:"Post Added Successfully!!",className:"bg-success text-white",addonStyle:""})
                     
                },
                error: function (xhr, status, error) {
				    showToast({msg:'Error: '+ status +" , "+ error,className:"bg-danger text-white",addonStyle:""})
                     
                }
            });
        });
		
		
	function showToast(msgBody)
    {
        console.log(msgBody)
      document.getElementById('toastMsg').innerHTML=msgBody.msg;
      var myToast = document.getElementById('myToast')
      
      if(msgBody.addonStyle)
        myToast.setAttribute("style","position: relative;"+msgBody.addonStyle);
        
      myToast.setAttribute("class","toast "+msgBody.className);
      var toast = new bootstrap.Toast(myToast);
   
        toast.show();
 
        // Automatically hide the toast after 5 seconds
        setTimeout(function () {
            toast.hide();
        }, 5000);
    }
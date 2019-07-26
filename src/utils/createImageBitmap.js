/* Safari and Edge polyfill for createImageBitmap
 * https://developer.mozilla.org/en-US/docs/Web/API/WindowOrWorkerGlobalScope/createImageBitmap
 */
if (!("createImageBitmap" in window)) {
  window.createImageBitmap = function(data) {
    return new Promise((resolve, reject) => {
      data.toBlob(blob => {
        const newImg = document.createElement("img");
        const url = URL.createObjectURL(blob);

        newImg.onload = () => {
          // no longer need to read the blob so it's revoked
          URL.revokeObjectURL(url);
          resolve(this);
        };
        newImg.src = url;
      });
    });
  };
}

//   const image = new Image();
//   image.src = data.toDataURL("image/png");
//   image.addEventListener("load", function() {
//     resolve(this);
//   });
// });
// };

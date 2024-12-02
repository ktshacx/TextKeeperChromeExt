document.addEventListener("DOMContentLoaded", () => {
  const savedTextsDiv = document.getElementById("saved-texts");
  const viewTextDiv = document.getElementById("view-text");

  function damn() {
    savedTextsDiv.innerHTML = "";
    chrome.storage.local.get(["texts"], (result) => {
      const texts = result.texts || [];
      texts.forEach(({ text, url, title, time }, index) => {
        const div = document.createElement("div");
        div.classList.add("texts");
        div.innerHTML = `
          <div class="part-1">
            <p class="main-text">${text.slice(0, 20)}...</p>
            <a class="sub-text" href="#" data-url="${url}">${title.slice(0, 20)}... - ${new Date(time).toLocaleString()}</a>
          </div>
          <div class="part-2">
            <button class="del" data-index="${index}">❌</button>
          </div>
        `;
        savedTextsDiv.appendChild(div);
      });
  
      // Attach event listeners to delete buttons
      const deleteButtons = savedTextsDiv.querySelectorAll(".del");
      deleteButtons.forEach((btn) => {
        btn.addEventListener("click", (e) => {
          const index = parseInt(e.target.getAttribute("data-index"));
          chrome.storage.local.get(["texts"], (result) => {
            const texts = result.texts || [];
            texts.splice(index, 1); // Remove the item at the specified index
            chrome.storage.local.set({ texts });
            damn(); // Re-render the items
          });
          e.stopPropagation(); // Prevent parent event triggers
        });
      });
  
      // Attach event listeners to open full text
      const textDivs = savedTextsDiv.querySelectorAll(".texts");
      textDivs.forEach((div, idx) => {
        div.addEventListener("click", (e) => {
          if (!e.target.classList.contains("del")) {
            savedTextsDiv.classList.add("hide");
            viewTextDiv.classList.remove("hide");
            const { text, title, time, url } = texts[idx];
            viewTextDiv.innerHTML = `
              <button class="btn" id="back-btn">\< Back</button>
              <p class="main-text">${text}</p>
              <p class="sub-text">${title} - ${new Date(time).toLocaleString()}</p>
              <button class="btn" id="visit-btn">\< Visit</button>
            `;
            const backBtn = document.getElementById("back-btn");
            backBtn.addEventListener("click", () => {
              savedTextsDiv.classList.remove("hide");
              viewTextDiv.classList.add("hide");
            });
  
            const visitBtn = document.getElementById("visit-btn");
            visitBtn.addEventListener("click", () => {
              chrome.tabs.create({ url });
            });
          }
        });
      });
    });
  }
  

  damn();
});
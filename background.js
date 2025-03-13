// chrome.runtime.onInstalled.addListener(() => {
//   chrome.tabs.query({}, (tabs) => {
//     tabs.forEach((tab) => {
//       chrome.scripting.executeScript({
//         target: { tabId: tab.id },
//         function: togglePopup
//       });
//     });
//   });
// });

// // 监听标签页更新事件，当标签页加载完成时执行脚本
chrome.tabs.onUpdated.addListener((tabId, changeInfo, tab) => {
  if (changeInfo.status === 'complete') {
    chrome.scripting.executeScript({
      target: { tabId: tabId },
      function: togglePopup,
    });
  }
});

function togglePopup() {
  console.log("lixumin")
  let popup = document.getElementById('draggable-popup');

  document.addEventListener('keydown', (event) => {
    
    if (event.metaKey && event.key === '.') {
      if (popup.style.display === 'none') {
        popup.style.display = 'block';  // 显示弹窗
        const inputElement = document.getElementById('content-input');
        // 调用 focus() 方法将焦点聚焦到输入框
        inputElement.focus();
      } else {
        popup.style.display = 'none';  // 隐藏弹窗
      }
    }
  });

  if (!popup) {
    // 如果弹窗不存在，创建它
    popup = document.createElement('div');
    popup.id = 'draggable-popup';
    popup.innerHTML = `
      <div id="drag-header-top"></div>
      <div id="drag-header-bottom"></div>
      <div id="drag-header-left"></div>
      <div id="drag-header-right"></div>
      <div class="input-container">
        <input type="text" id="content-input" placeholder="Enter content" />
      </div>
      <div id="stream-output" style="color: black;white-space: pre-wrap;"></div>
      <div class="resize-handle" id="resize-br"></div>
      <div class="resize-handle" id="resize-bl"></div>
      <div class="resize-handle" id="resize-tr"></div>
      <div class="resize-handle" id="resize-tl"></div>
    `;

    // 设置样式
    popup.style.display = 'none';  // 隐藏弹窗
    popup.style.position = 'fixed';
    popup.style.zIndex = '2147483645'; // 最大 z-index
    popup.style.top = '100px';
    popup.style.left = '100px';
    popup.style.width = '500px';
    popup.style.height = '200px'; // 初始高度
    popup.style.padding = '10px';
    popup.style.backgroundColor = 'white';
    popup.style.border = '2px solid black';
    popup.style.boxShadow = '0px 4px 8px rgba(0, 0, 0, 0.2)';
    popup.style.overflow = 'auto'; // 允许内容溢出时滚动
  
    document.body.appendChild(popup);

    const style = document.createElement('style');
    style.textContent = `
      /* 总容器样式 */
      .input-container {
          display: flex;
          align-items: center;
          gap: 8px;
          width: 100%;
          max-width: 800px;
          margin: 10px auto;
          padding: 0 15px;
      }

      /* 输入框样式 */
      #content-input {
          flex: 1;
          padding: 5px 5px;
          font-size: 16px;
          border: 1px solid #dcdfe6;
          border-radius: 8px;
          transition: all 0.3s ease;
          box-shadow: 0 2px 4px rgba(0, 0, 0, 0.05);
          color: white; /* 设置字体颜色为白色 */
          background-color: black; /* 设置背景颜色为黑色 */
      }

      /* 输入框聚焦效果 */
      #content-input:focus {
          border-color: #409eff;
          box-shadow: 0 0 8px rgba(64, 158, 255, 0.3);
          outline: none;
      }

      /* 输入框占位符样式 */
      #content-input::placeholder {
          color: #909399;
      }
    `;
    document.head.appendChild(style);
    // 添加拖动功能
    let isDragging = false;
    let offsetX, offsetY;
  
    // const header = document.getElementById('popup-header');
    

    const header = ['top', 'bottom', 'left', 'right']; // 右下、左下、右上、左上
    header.forEach(handle => {
      const dragHeader = document.getElementById(`drag-header-${handle}`);
      dragHeader.style.position = 'absolute';
      dragHeader.style.backgroundColor = 'rgba(255, 0, 0, 0.05)';  // 设置透明以接收鼠标事件
      
      if (handle === 'top' || handle === 'bottom') {
        dragHeader.style.left = '0';
        dragHeader.style.right = '0';
        dragHeader.style.height = '10px';
        dragHeader.style[handle] = '0';  // 设置具体的 top 或 bottom
      } else if (handle === 'left' || handle === 'right') {
        dragHeader.style.top = '0';
        dragHeader.style.bottom = '0';
        dragHeader.style.width = '10px';
        dragHeader.style[handle] = '0';  // 设置具体的 left 或 right
      }
      dragHeader.style.cursor = 'move';
      dragHeader.onmousedown = (e) => {
        isDragging = true;
        offsetX = e.clientX - popup.offsetLeft;
        offsetY = e.clientY - popup.offsetTop;

        document.onmousemove = (e) => {
          if (isDragging) {
            popup.style.left = e.clientX - offsetX + 'px';
            popup.style.top = e.clientY - offsetY + 'px';
          }
        };

        document.onmouseup = () => {
          isDragging = false;
          document.onmousemove = null; // 清除事件处理程序
        };
      };
    });
 

    // 设置四个角的 resize 手柄样式
    const handles = ['br', 'bl', 'tr', 'tl']; // 右下、左下、右上、左上
    handles.forEach(handle => {
      const resizeHandle = document.getElementById(`resize-${handle}`);
      resizeHandle.style.position = 'absolute';
      resizeHandle.style.width = '20px';
      resizeHandle.style.height = '20px';
      resizeHandle.style.cursor = handle === 'br' ? 'nwse-resize' : handle === 'bl' ? 'nesw-resize' : handle === 'tr' ? 'nesw-resize' : 'nwse-resize';
      resizeHandle.style.backgroundColor = 'rgba(0, 0, 0, 0.01)';
    });

    document.getElementById('resize-br').style.bottom = '0';
    document.getElementById('resize-br').style.right = '0';
    document.getElementById('resize-bl').style.bottom = '0';
    document.getElementById('resize-bl').style.left = '0';
    document.getElementById('resize-tr').style.top = '0';
    document.getElementById('resize-tr').style.right = '0';
    document.getElementById('resize-tl').style.top = '0';
    document.getElementById('resize-tl').style.left = '0';
    
    let isResizing = false;
    let initialWidth, initialHeight, initialX, initialY, resizeDirection;

    // 函数：根据不同的手柄调整大小
    const startResizing = (e, handle) => {
      isResizing = true;
      initialWidth = popup.offsetWidth;
      initialHeight = popup.offsetHeight;
      initialX = e.clientX;
      initialY = e.clientY;
      resizeDirection = handle;

      document.onmousemove = (e) => {
        if (isResizing) {
          if (resizeDirection === 'br') {
            popup.style.width = initialWidth + (e.clientX - initialX) + 'px';
            popup.style.height = initialHeight + (e.clientY - initialY) + 'px';
          } else if (resizeDirection === 'bl') {
            popup.style.width = initialWidth - (e.clientX - initialX) + 'px';
            popup.style.height = initialHeight + (e.clientY - initialY) + 'px';
            popup.style.left = initialX + (e.clientX - initialX) + 'px';
          } else if (resizeDirection === 'tr') {
            popup.style.width = initialWidth + (e.clientX - initialX) + 'px';
            popup.style.height = initialHeight - (e.clientY - initialY) + 'px';
            popup.style.top = initialY + (e.clientY - initialY) + 'px';
          } else if (resizeDirection === 'tl') {
            popup.style.width = initialWidth - (e.clientX - initialX) + 'px';
            popup.style.height = initialHeight - (e.clientY - initialY) + 'px';
            popup.style.left = initialX + (e.clientX - initialX) + 'px';
            popup.style.top = initialY + (e.clientY - initialY) + 'px';
          }
        }
      };

    document.onmouseup = () => {
        isResizing = false;
        document.onmousemove = null; // 清除事件处理程序
      };
    };

    handles.forEach(handle => {
      document.getElementById(`resize-${handle}`).onmousedown = (e) => startResizing(e, handle);
    });

    document.addEventListener('paste', (e) => {
      const clipboardData = e.clipboardData || window.clipboardData;
      console.log(clipboardData)
      const pastedData = clipboardData.getData('Text');
      
      if (pastedData.startsWith('http://') || pastedData.startsWith('https://')) {
        const iframe = document.getElementById('popup-iframe');
        if (iframe) {
          iframe.src = pastedData;
        }
      }
    });


    // const streamBtn = document.getElementById('stream-btn');
    const contentInput = document.getElementById('content-input');
    const streamOutput = document.getElementById('stream-output');
    // let script = document.createElement('script');
    // script.src = "https://cdn.jsdelivr.net/npm/mathpix-markdown-it@2.0.4/es5/bundle.js";
    // document.head.append(script);

    // 点击按钮时执行 streamRequest 函数
    // streamBtn.addEventListener('click', () => {
    //     const content = contentInput.value;
    //     if (content) {
    //         streamRequest(content);
    //     }
    // });

    contentInput.addEventListener('keydown', function(event) {
      if (event.key === 'Enter') {
        // 回车键被按下时触发的操作
        const inputValue = event.target.value;
        console.log(inputValue)
        console.log(event.target.value)
        console.log(contentInput.value)
        if (inputValue) {
          streamRequest(inputValue);
        } 
      }
    });
  
    async function streamRequest(content) {
      const url = "https://lismin.online:10002/chat";
      // const url = chrome.runtime.getURL(" 
      const data = {
          content: content
      };
      streamOutput.innerHTML = ''; // 清空之前的输出内容
      // 发起 POST 请求
      const response = await fetch(url, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(data)
      });
      console.log(JSON.stringify(data))

      
      const reader = response.body.getReader();
      const decoder = new TextDecoder("utf-8"); // 创建一个文本解码器
      let buffer = ""; // 缓存不完整的字符
      let text = "";
      while (true) {
          const { done, value } = await reader.read(); // 从流中读取字节块
          if (done) {
              break; // 当流结束时，退出循环
          }
  
          // 将字节转换为字符串并追加到缓冲区
          buffer += decoder.decode(value, { stream: true });

          try {
              // 尝试打印解码后的文本
              // text += buffer;
              // if (streamOutput) {
              //   const options = {
              //     htmlTags: true
              //   };
              //   const html = render(text, options);
              //   streamOutput.outerHTML = html;
              // }
              streamOutput.innerHTML += buffer;
              buffer = ""; // 清空缓冲区
          } catch (e) {
              // 如果解码失败，保留缓冲区内容以等待后续字节补全
              console.log(e)
              console.log("Decoding error, waiting for more data...");
          }
      }
    }
  }
}


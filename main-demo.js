let res
function shorturl() {
  if (document.querySelector("#longURL").value == "") {
    alert("Url cannot be empty!")
    return
  }

  document.getElementById("searchbtn").disabled = true;
  document.getElementById("searchbtn").innerHTML = '<span class="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span>Please wait...';
  fetch(window.location.pathname, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ url: document.querySelector("#longURL").value, customShortURL: document.querySelector("#customShortURL").value, password: document.querySelector("#passwordText").value })
  }).then(function (response) {
    return response.json();
  })
    .then(function (myJson) {
      res = myJson;
      document.getElementById("searchbtn").disabled = false;
      document.getElementById("searchbtn").innerHTML = ' Shorten it';
      if (res.key !== "") {
        document.getElementById("result").innerHTML = window.location.host + res.key;
      }
      $('#exampleModal').modal('show')

      // 成功生成短链
      if (res.status == "200") {
        let keyShortURL = window.location.host + res.key;
        let valueLongURL = document.querySelector("#longURL").value;
        // save to localStorage
        localStorage.setItem(keyShortURL, valueLongURL);
        // add to urlList on the page
        addUrlToList(keyShortURL, valueLongURL)
      }

    }).catch(function (err) {
      alert("Unknow error. Please retry!");
      console.log(err);
      document.getElementById("searchbtn").disabled = false;
      document.getElementById("searchbtn").innerHTML = ' Shorten it';
    })
}
function copyurl(id, attr) {
  let target = null;

  if (attr) {
    target = document.createElement('div');
    target.id = 'tempTarget';
    target.style.opacity = '0';
    if (id) {
      let curNode = document.querySelector('#' + id);
      target.innerText = curNode[attr];
    } else {
      target.innerText = attr;
    }
    document.body.appendChild(target);
  } else {
    target = document.querySelector('#' + id);
  }

  try {
    let range = document.createRange();
    range.selectNode(target);
    window.getSelection().removeAllRanges();
    window.getSelection().addRange(range);
    document.execCommand('copy');
    window.getSelection().removeAllRanges();
    console.log('Copy success')
  } catch (e) {
    console.log('Copy error')
  }

  if (attr) {
    // remove temp target
    target.parentElement.removeChild(target);
  }
}
function loadUrlList() {
  // 清空列表
  let urlList = document.querySelector("#urlList")
  while (urlList.firstChild) {
      urlList.removeChild(urlList.firstChild)
  }

  // 遍历localStorage
  let len = localStorage.length
  console.log(+len)
  for (; len > 0; len--) {
      let keyShortURL = localStorage.key(len - 1)
      let valueLongURL = localStorage.getItem(keyShortURL)
      addUrlToList(keyShortURL, valueLongURL)
  }
}

function addUrlToList(shortUrl, longUrl) {
  let urlList = document.querySelector("#urlList")
  let child = document.createElement('li')
  let text = document.createTextNode(shortUrl + " " + longUrl)
  child.appendChild(text)
  child.classList.add("list-group-item")
  urlList.append(child)
}

function filterUrlList() {
  let longUrl = document.querySelector("#longURL")

  // 如果长链接文本框为空，显示全部urlList
  if (longUrl =="") {
    let urlList = document.querySelector("#urlList").children
    for (let i = 0; i < urlList.length; i++) {
      urlList[i].classList.remove("invisible")
      urlList[i].classList.add("visible")
    }
  } else {
    // 如果长链接文本框为空，显示包含有链接的li元素，隐藏其它
    let urlList = document.querySelector("#urlList").children
    for (let i = 0; i < urlList.length; i++) {
      if (urlList[i].contains(longUrl)) {
        urlList[i].classList.remove("invisible")
        urlList[i].classList.add("visible")
      }
      else {
        urlList[i].classList.remove("visible")
        urlList[i].classList.add("invisible")
      }
    }
  }
}

function clearLocalStorage() {
  localStorage.clear()
}

$(function () {
  $('[data-toggle="popover"]').popover()
})

loadUrlList()